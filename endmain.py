import asyncio
import logging
import os
from pathlib import Path
from typing import List, Optional

import numpy as np
import torch
import torchvision.transforms as T
from PIL import Image
from diffusers import (
    StableDiffusionXLPipeline,
    StableDiffusionXLImg2ImgPipeline,
    StableDiffusionUpscalePipeline,
)

# ────────────────────────────────────
# Константы и утилиты
# ────────────────────────────────────
_DEFAULT_MODEL = "stabilityai/stable-diffusion-xl-base-1.0"
_UPSCALE_MODEL = "stabilityai/stable-diffusion-x4-upscaler"
_DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
_LATENT_SCALE = 0.13025            # нормализация latent'ов SD-XL
_TO_TENSOR = T.Compose([T.ToTensor(), T.Lambda(lambda x: x * 2.0 - 1.0)])

# ────────────────────────────────────
# ЛОГГЕР
# ────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("server")

# ────────────────────────────────────
# Чтение промптов из файла
# ────────────────────────────────────
def _read_prompts(filepath: str | os.PathLike) -> List[str]:
    path = Path(filepath)
    if not path.exists():
        logger.warning("prompts file %s not found", path)
        return []
    return [
        line.strip() for line in path.read_text("utf-8").splitlines() if line.strip()
    ]


# ────────────────────────────────────
# PipelineManager
# ────────────────────────────────────
class PipelineManager:
    """
    Обёртка вокруг SD-XL:
    - txt2img (base)
    - img2img
    - upscale x4
    - VAE ↔ latent
    """

    def __init__(
        self,
        model_id: str = _DEFAULT_MODEL,
        upscale_id: str = _UPSCALE_MODEL,
        device: str = _DEVICE,
        fp16: bool = True,
    ) -> None:
        self.device = device
        dtype = torch.float16 if (fp16 and device.startswith("cuda")) else torch.float32

        # txt2img
        self.txt2img_pipe: StableDiffusionXLPipeline = (
            StableDiffusionXLPipeline.from_pretrained(
                model_id, torch_dtype=dtype, use_safetensors=True
            )
            .to(device)
            .enable_model_cpu_offload()        # экономия VRAM
        )

        # img2img
        self.img2img_pipe: StableDiffusionXLImg2ImgPipeline = (
            StableDiffusionXLImg2ImgPipeline.from_pretrained(
                model_id, torch_dtype=dtype, use_safetensors=True
            )
            .to(device)
            .enable_model_cpu_offload()
        )

        # x4-Upscaler
        self.upscale_pipe: StableDiffusionUpscalePipeline = (
            StableDiffusionUpscalePipeline.from_pretrained(
                upscale_id, torch_dtype=dtype, use_safetensors=True
            )
            .to(device)
            .enable_model_cpu_offload()
        )

    # ---------------- helper: run sync in thread -----------------
    @staticmethod
    def _async_sync(fn, *args, **kwargs):
        loop = asyncio.get_running_loop()
        return loop.run_in_executor(None, lambda: fn(*args, **kwargs))

    # ---------------- базовый txt2img ----------------------------
    async def txt2img(
        self,
        prompt: str,
        width: int = 1024,
        height: int = 1024,
        guidance_scale: float = 7.5,
        steps: int = 30,
        seed: Optional[int] = None,
    ) -> Image.Image:
        gen = torch.Generator(self.device)
        if seed is not None:
            gen.manual_seed(seed)

        def _sync():
            res = self.txt2img_pipe(
                prompt=prompt,
                width=width,
                height=height,
                guidance_scale=guidance_scale,
                num_inference_steps=steps,
                generator=gen,
            )
            return res.images[0]

        return await self._async_sync(_sync)

    # ---------------- txt2img high-res (512→upscale→denoise) -----
    async def txt2img_hr(
        self,
        prompt: str,
        seed: Optional[int] = None,
        base_steps: int = 25,
        upscale_steps: int = 50,
        final_denoise_steps: int = 25,
    ) -> Image.Image:
        # 1) базовый 512×512
        low = await self.txt2img(
            prompt,
            width=512,
            height=512,
            steps=base_steps,
            guidance_scale=7.0,
            seed=seed,
        )

        # 2) x4 upscale (≈2048×2048)
        def _upscale():
            res = self.upscale_pipe(
                image=low, prompt=prompt, num_inference_steps=upscale_steps
            )
            return res.images[0]

        up = await self._async_sync(_upscale)

        # 3) лёгкий denoise для подчистки артефактов
        hi = await self.img2img(
            init_img=up,
            prompt=prompt,
            strength=0.25,
            steps=final_denoise_steps,
            guidance_scale=7.0,
            seed=seed,
        )
        return hi

    # ---------------- img2img ------------------------------------
    async def img2img(
        self,
        init_img: Image.Image,
        prompt: str,
        guidance_scale: float = 7.5,
        steps: int = 30,
        strength: float = 0.6,
        seed: Optional[int] = None,
    ) -> Image.Image:
        gen = torch.Generator(self.device)
        if seed is not None:
            gen.manual_seed(seed)

        def _sync():
            res = self.img2img_pipe(
                prompt=prompt,
                image=init_img,
                guidance_scale=guidance_scale,
                strength=strength,
                num_inference_steps=steps,
                generator=gen,
            )
            return res.images[0]

        return await self._async_sync(_sync)

    # ---------------- img → latent -------------------------------
    async def img2lat(self, img: Image.Image) -> torch.Tensor:
        img_tensor = (
            _TO_TENSOR(img)
            .unsqueeze(0)
            .to(self.device, dtype=self.txt2img_pipe.vae.dtype)
        )

        def _sync():
            with torch.no_grad():
                lat = self.txt2img_pipe.vae.encode(img_tensor).latent_dist.sample()
                return lat * _LATENT_SCALE

        return await self._async_sync(_sync)

    # ---------------- latent → BGR numpy -------------------------
    async def lat2bgr(self, lat: torch.Tensor) -> np.ndarray:
        def _sync():
            with torch.no_grad():
                img = self.txt2img_pipe.vae.decode(lat / _LATENT_SCALE).sample
                img = (img / 2 + 0.5).clamp(0, 1)
                img = img.cpu().permute(0, 2, 3, 1).numpy()[0]
                img = (img * 255).round().astype(np.uint8)
                bgr = img[:, :, ::-1]
                return np.ascontiguousarray(bgr)

        return await self._async_sync(_sync)

    # ---------------- prompt expander (заглушка) -----------------
    async def generate_prompt(self, short_prompt: str) -> str:
        return short_prompt  # замените на LLM при желании


# ────────────────────────────────────
# SessionState
# ────────────────────────────────────
class SessionState:
    """
    Хранит последовательность промптов и кадров внутри одной сессии.
    """

    def __init__(self, prompts: List[str]) -> None:
        self.prompts: List[str] = prompts
        self.user_indices: set[int] = set()
        self.imgs: List[Image.Image] = []
        self.lats: List[torch.Tensor] = []
        self.current_idx: int = 0
        self.next_lat: Optional[torch.Tensor] = None

    async def build_initial(self):
        img0 = await pipeline.txt2img_hr(self.prompts[0])
        lat0 = await pipeline.img2lat(img0)
        self.imgs.append(img0)
        self.lats.append(lat0)

    async def insert_user_prompt(self, prompt: str):
        """
        Вставляем пользовательский промпт после текущего кадра,
        добавляя контекст предыдущего.
        """
        prev_prompt = self.prompts[self.current_idx]
        combined = f"{prev_prompt}, {prompt}"
        insert_at = self.current_idx + 1
        self.prompts.insert(insert_at, combined)

        # сдвигаем все user-индексы, которые были правее
        self.user_indices = {
            idx + 1 if idx >= insert_at else idx for idx in self.user_indices
        }
        self.user_indices.add(insert_at)


# ────────────────────────────────────
# Экспорт единственного экземпляра
# ────────────────────────────────────
pipeline = PipelineManager()
