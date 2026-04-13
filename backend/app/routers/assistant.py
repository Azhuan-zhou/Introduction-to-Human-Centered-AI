import io
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from app.models.schemas import RewriteRequest, RewriteResponse, TTSRequest
from app.services import openai_service, tts_service

router = APIRouter()

ALLOWED_TONES = {"formal", "casual", "academic"}
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_DETAIL_LEVELS = {"low", "high", "original", "auto"}


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite(req: RewriteRequest):
    if len(req.text) > 2000:
        raise HTTPException(status_code=400, detail="Input too long (max 2000 chars)")

    if req.tone not in ALLOWED_TONES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid tone. Must be one of: {', '.join(sorted(ALLOWED_TONES))}",
        )

    rewritten = await openai_service.rewrite_text(req.text, req.tone)
    return RewriteResponse(rewritten=rewritten, tone=req.tone)


@router.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    contents = await audio.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file")

    transcript = await openai_service.transcribe_audio(
        contents,
        audio.content_type or "audio/webm",
    )
    return {"transcript": transcript}


@router.post("/describe-image")
async def describe_image(
    image: UploadFile = File(...),
    tone: str = Form(...),
    language: str = Form("English"),
    user_prompt: str | None = Form(None),
    detail: str = Form("auto"),
):
    if tone not in ALLOWED_TONES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid tone. Must be one of: {', '.join(sorted(ALLOWED_TONES))}",
        )

    if detail not in ALLOWED_DETAIL_LEVELS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid detail level. Must be one of: {', '.join(sorted(ALLOWED_DETAIL_LEVELS))}",
        )

    content_type = image.content_type or "image/jpeg"
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image type. Use JPEG, PNG, WEBP, or GIF.",
        )

    contents = await image.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")

    # Optional size guard
    max_size_mb = 10
    if len(contents) > max_size_mb * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"Image too large (max {max_size_mb} MB)",
        )

    description = await openai_service.describe_image(
        image_bytes=contents,
        content_type=content_type,
        tone=tone,
        language=language,
        user_prompt=user_prompt,
        detail=detail,
    )

    return {
        "description": description,
        "tone": tone,
        "language": language,
        "detail": detail,
    }


@router.post("/speak")
async def speak(req: TTSRequest):
    if len(req.text) > 2000:
        raise HTTPException(status_code=400, detail="Text too long (max 2000 chars)")

    audio_bytes = await tts_service.synthesize(req.text, req.voice)
    return StreamingResponse(io.BytesIO(audio_bytes), media_type="audio/mpeg")
