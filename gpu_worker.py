#gpu_worker
import queue
import threading
import time
import torch
from diffusers import (
    StableDiffusionPipeline,
    StableDiffusionImg2ImgPipeline,
    DPMSolverMultistepScheduler,
)

# ─── DEVICE & DTYPE ─────────────────────────────────────────────────────────
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[gpu_worker] DEVICE = {DEVICE}")
TORCH_DTYPE = torch.float16 if DEVICE.startswith("cuda") else torch.float32

# ─── LOAD TXT2IMG PIPELINE ───────────────────────────────────────────────────
pipe_txt = StableDiffusionPipeline.from_pretrained(
    "prompthero/openjourney",
    torch_dtype=TORCH_DTYPE
)
pipe_txt.scheduler = DPMSolverMultistepScheduler.from_config(pipe_txt.scheduler.config)
pipe_txt = pipe_txt.to(DEVICE)
pipe_txt.unet.eval()
pipe_txt.vae.eval()
pipe_txt.text_encoder.eval()

# ─── LOAD IMG2IMG PIPELINE ───────────────────────────────────────────────────
pipe_img = StableDiffusionImg2ImgPipeline(**pipe_txt.components)
pipe_img.scheduler = DPMSolverMultistepScheduler.from_config(pipe_img.scheduler.config)
pipe_img = pipe_img.to(DEVICE)
pipe_img.unet.eval()
pipe_img.vae.eval()

# ─── NO GRADIENTS ────────────────────────────────────────────────────────────
torch.set_grad_enabled(False)

# ─── JOB & RESULT QUEUES ─────────────────────────────────────────────────────
# job_q: tuples (session_id, mode, prompt, prev_pil_image, steps, strength)
# res_q: tuples (session_id, result_pil_image)
job_q = queue.Queue()
res_q = queue.Queue()

def render_loop():
    """Continuously take jobs from job_q, render, and put into res_q."""
    while True:
        sid, mode, prompt, pil_prev, steps, strength = job_q.get()
        if mode == "txt":
            with torch.autocast(DEVICE):
                out = pipe_txt(prompt, num_inference_steps=steps).images[0]
        else:
            with torch.autocast(DEVICE):
                out = pipe_img(
                    prompt=prompt,
                    image=pil_prev,
                    strength=strength,
                    num_inference_steps=steps
                ).images[0]
        res_q.put((sid, out.copy()))
        job_q.task_done()

# ─── START RENDER THREAD ──────────────────────────────────────────────────────
t = threading.Thread(target=render_loop)
t.start()

# ─── KEEP PROCESS ALIVE WHEN RUN DIRECTLY ────────────────────────────────────
if __name__ == "__main__":
    print(f"[gpu_worker] started on {DEVICE}, waiting for jobs…")
    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print("[gpu_worker] stopped by user")
