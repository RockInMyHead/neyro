import asyncio
import os
import uuid
from typing import List

import cv2
import numpy as np
import torch
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

# ────────────────────────────────────
# Локальные импорты
# ────────────────────────────────────
from endmain import SessionState, _read_prompts, logger, pipeline
from conf import get_settings
from shemas import SessionCreateIn, PromptIn  # <-- ваши pydantic-схемы

# ────────────────────────────────────
# Настройки и инициализация
# ────────────────────────────────────
sessions: dict[str, SessionState] = {}
settings = get_settings()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# очистка памяти GPU
def _cleanup():
    torch.cuda.empty_cache()
    logger.info("Shutdown complete")

app.add_event_handler("shutdown", _cleanup)

# ────────────────────────────────────
# Static music endpoint (пример)
# ────────────────────────────────────
@app.get("/music/{filename}.mp3")
async def get_music(filename: str):
    base = os.path.dirname(__file__)
    file_path = os.path.join(base, "music", f"{filename}.mp3")
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Music not found")
    return FileResponse(file_path, media_type="audio/mpeg")

# ────────────────────────────────────
# Session endpoints
# ────────────────────────────────────
def get_prompts_by_type(prompt_type: int) -> List[str]:
    base = os.path.dirname(__file__)
    filepath = os.path.join(base, f"{prompt_type}.txt")
    if os.path.exists(filepath):
        with open(filepath, encoding="utf-8") as f:
            return [line.strip() for line in f if line.strip()]
    return ["Default prompt — файл не найден"]

@app.post("/session")
async def create_session(data: SessionCreateIn):
    # 1) прямой список
    if data.prompts:
        initial = data.prompts
    # 2) promptType
    elif data.promptType is not None:
        initial = get_prompts_by_type(data.promptType)
    # 3) fallback
    else:
        initial = _read_prompts(settings.prompts_file) or ["Dog in sunny meadow"]

    sid = str(uuid.uuid4())
    state = SessionState(initial)
    await state.build_initial()
    sessions[sid] = state
    logger.info("Created session %s with prompts: %s", sid, initial)
    return JSONResponse({"session_id": sid, "prompts": initial})

@app.post("/session/{sid}/prompt")
async def add_prompt(sid: str, data: PromptIn):
    state = sessions.get(sid)
    if not state:
        raise HTTPException(status_code=404, detail="Session not found")

    # если короткий (<10 слов) — расширяем LLM-ом
    if len(data.prompt.split()) < 10:
        prompt = await pipeline.generate_prompt(data.prompt)
    else:
        prompt = data.prompt

    await state.insert_user_prompt(prompt)
    return {"status": "accepted", "prompt": prompt}

# ────────────────────────────────────
# Slerp для интерполяции latent-ов
# ────────────────────────────────────
def _slerp(t: float, v0: torch.Tensor, v1: torch.Tensor) -> torch.Tensor:
    dot = (v0 * v1).sum() / (torch.norm(v0) * torch.norm(v1))
    omega = torch.acos(torch.clamp(dot, -1, 1))
    so = torch.sin(omega)
    if so == 0:
        return (1 - t) * v0 + t * v1
    return (
        (torch.sin((1 - t) * omega) / so) * v0
        + (torch.sin(t * omega) / so) * v1
    )

# ────────────────────────────────────
# WebSocket-стрим
# ────────────────────────────────────
@app.websocket("/session/{sid}/stream")
async def stream(sid: str, ws: WebSocket):
    state = sessions.get(sid)
    if not state:
        await ws.close(code=1008)
        return
    await ws.accept()
    logger.info("WebSocket opened for session %s", sid)

    # отправляем первый кадр сразу
    im0 = state.imgs[0]
    frame0 = cv2.cvtColor(np.array(im0), cv2.COLOR_RGB2BGR)
    cv2.putText(
        frame0,
        state.prompts[0],
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        (255, 255, 255),
        2,
    )
    _, buf0 = cv2.imencode(".jpg", frame0, [cv2.IMWRITE_JPEG_QUALITY, 85])
    await ws.send_bytes(buf0.tobytes())

    async def consumer():
        try:
            while True:
                msg = await ws.receive_json()
                text = msg.get("text")
                if text:
                    prompt = await pipeline.generate_prompt(text)
                    await state.insert_user_prompt(prompt)
        except WebSocketDisconnect:
            logger.info("Consumer disconnected for %s", sid)

    async def producer():
        try:
            while True:
                next_idx = state.current_idx + 1

                # если нужно, заранее генерируем latent следующего кадра
                if state.next_lat is None and next_idx < len(state.prompts):
                    prev_img = state.imgs[state.current_idx]
                    comp = f"{state.prompts[state.current_idx]}, {state.prompts[next_idx]}"
                    is_user = next_idx in state.user_indices
                    scale = (
                        settings.user_guidance_scale
                        if is_user
                        else settings.guidance_scale
                    )
                    steps = (
                        settings.user_img_steps
                        if is_user
                        else settings.img_steps
                    )
                    strength = 0.45 if is_user else settings.strength  # ↓ сохр. композицию
                    new_img = await pipeline.img2img(
                        prev_img, comp, scale, steps, strength
                    )
                    new_lat = await pipeline.img2lat(new_img)
                    state.imgs.append(new_img)
                    state.lats.append(new_lat)
                    state.next_lat = new_lat

                if state.next_lat is not None:
                    prev_lat = state.lats[state.current_idx]
                    prompt_text = state.prompts[state.current_idx + 1]
                    is_user = (state.current_idx + 1) in state.user_indices
                    blend = (
                        settings.user_blend_frames
                        if is_user
                        else settings.blend_frames
                    )

                    for f in range(blend):
                        t = f / max(blend - 1, 1)
                        lat_interp = _slerp(t, prev_lat, state.next_lat)
                        frame = await pipeline.lat2bgr(lat_interp)
                        cv2.putText(
                            frame,
                            prompt_text,
                            (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.0,
                            (255, 255, 255),
                            2,
                        )
                        _, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                        await ws.send_bytes(buf.tobytes())

                    state.current_idx += 1

                    # если кадр пользовательский — «задерживаем» его
                    if is_user:
                        hold_frame = state.imgs[state.current_idx]
                        hold_bgr = cv2.cvtColor(
                            np.array(hold_frame), cv2.COLOR_RGB2BGR
                        )
                        for _ in range(settings.hold_frames):
                            cv2.putText(
                                hold_bgr,
                                prompt_text,
                                (10, 30),
                                cv2.FONT_HERSHEY_SIMPLEX,
                                1.0,
                                (255, 255, 255),
                                2,
                            )
                            _, bufh = cv2.imencode(
                                ".jpg", hold_bgr, [cv2.IMWRITE_JPEG_QUALITY, 85]
                            )
                            await ws.send_bytes(bufh.tobytes())
                        state.user_indices.remove(state.current_idx)

                    # сбрасываем, чтобы сгенерировать следующий
                    state.next_lat = None

                await asyncio.sleep(1.0)
        except WebSocketDisconnect:
            logger.info("Producer disconnected for %s", sid)

    # запускаем одновременно
    await asyncio.gather(consumer(), producer())

# ────────────────────────────────────
# Entrypoint
# ────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
