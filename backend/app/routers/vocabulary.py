from fastapi import APIRouter, HTTPException
from app.models.schemas import VocabSuggestRequest, VocabSuggestResponse, VocabWord
from app.services import openai_service

router = APIRouter()


@router.post("/suggest", response_model=VocabSuggestResponse)
async def suggest(req: VocabSuggestRequest):
    if len(req.original_text) > 2000 or len(req.rewritten_text) > 2000:
        raise HTTPException(status_code=400, detail="Input too long (max 2000 chars)")
    words_data = await openai_service.suggest_vocabulary(
        req.original_text, req.rewritten_text, req.topic_context
    )
    words = [VocabWord(**w) for w in words_data]
    return VocabSuggestResponse(words=words)
