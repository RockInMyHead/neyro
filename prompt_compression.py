# prompt_compression.py

import logging
import torch
import tiktoken
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

logger = logging.getLogger(__name__)

# 1) Параметры LLM
LLM_MODEL = "google/flan-t5-small"

# 2) Загружаем модель и токенизатор один раз при импорте
logger.info(f"[prompt_compression] Loading LLM '{LLM_MODEL}' for prompt compression…")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
_llm_tokenizer = AutoTokenizer.from_pretrained(LLM_MODEL)
_llm_model     = AutoModelForSeq2SeqLM.from_pretrained(LLM_MODEL).to(device)
_llm_model.eval()

# 3) BPE‑токенизатор GPT‑2 для подсчёта/усечения
_ENC = tiktoken.get_encoding("gpt2")

def count_tokens(text: str) -> int:
    return len(_ENC.encode(text))

def compress_prompt_with_llm(prompt: str, max_tokens: int = 77) -> str:
    """
    Сжимает промт до <= max_tokens токенов CLIP (GPT‑2 BPE),
    сохраняя ключевые детали, при помощи локального LLM.
    """
    orig_len = count_tokens(prompt)
    logger.info(f"[prompt_compression] in: '{prompt}' ({orig_len} tokens)")

    instruction = (
        f"Compress this Stable Diffusion prompt to no more than "
        f"{max_tokens} tokens, preserving the key imagery and style:\n\n\"{prompt}\""
    )
    inputs = _llm_tokenizer(
        instruction, return_tensors="pt", truncation=True, max_length=512
    ).to(device)

    with torch.no_grad():
        outs = _llm_model.generate(
            **inputs,
            max_new_tokens=max_tokens * 2,
            num_beams=4,
            early_stopping=True
        )

    compressed = _llm_tokenizer.decode(outs[0], skip_special_tokens=True).strip()
    tok_count  = count_tokens(compressed)

    if tok_count > max_tokens:
        logger.warning(
            f"[prompt_compression] trimming from {tok_count} to {max_tokens} via BPE"
        )
        ids = _ENC.encode(compressed)[:max_tokens]
        compressed = _ENC.decode(ids)
        tok_count = count_tokens(compressed)

    logger.info(f"[prompt_compression] out: '{compressed}' ({tok_count} tokens)")
    return compressed
