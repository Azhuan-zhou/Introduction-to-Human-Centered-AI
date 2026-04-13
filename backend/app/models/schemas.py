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

class ImageDescribeRequest(BaseModel):
    """
    Optional schema for JSON-based requests.
    Useful if you later support base64-encoded images.
    """
    tone: Literal["formal", "casual", "academic"]
    language: str = "English"
    user_prompt: Optional[str] = None
    detail: Literal["low", "high", "original", "auto"] = "auto"


class ImageDescribeResponse(BaseModel):
    """
    Response schema for the /describe-image endpoint.
    """
    description: str
    tone: Literal["formal", "casual", "academic"]
    language: str
    detail: Literal["low", "high", "original", "auto"]
