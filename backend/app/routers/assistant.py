import io
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import RewriteRequest, RewriteResponse, TTSRequest
from app.services import openai_service, tts_service

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite(req: RewriteRequest):
    if len(req.text) > 2000:
        raise HTTPException(status_code=400, detail="Input too long (max 2000 chars)")
    rewritten = await openai_service.rewrite_text(req.text, req.tone)
    return RewriteResponse(rewritten=rewritten, tone=req.tone)


@router.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    contents = await audio.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file")
    transcript = await openai_service.transcribe_audio(contents, audio.content_type or "audio/webm")
    return {"transcript": transcript}


@router.post("/speak")
async def speak(req: TTSRequest):
    if len(req.text) > 2000:
        raise HTTPException(status_code=400, detail="Text too long (max 2000 chars)")
    audio_bytes = await tts_service.synthesize(req.text, req.voice)
    return StreamingResponse(io.BytesIO(audio_bytes), media_type="audio/mpeg")
