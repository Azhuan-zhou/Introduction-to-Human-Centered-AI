from pydantic import BaseModel
from typing import Literal, Optional, List


class RewriteRequest(BaseModel):
    text: str
    tone: Literal["formal", "casual", "academic"]
    topic_context: Optional[str] = None


class RewriteResponse(BaseModel):
    rewritten: str
    tone: str


class TTSRequest(BaseModel):
    text: str
    voice: str = "nova"


class VocabSuggestRequest(BaseModel):
    original_text: str
    rewritten_text: str
    topic_context: Optional[str] = None


class VocabWord(BaseModel):
    word: str
    definition: str
    example_sentence: str
    ipa: str


class VocabSuggestResponse(BaseModel):
    words: List[VocabWord]
