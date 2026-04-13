import openai
import json
import os
import base64
from typing import Optional

client = openai.AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])

TONE_INSTRUCTIONS = {
    "formal": (
        "You are helping an international student write a formal email to a professor or academic administrator. "
        "Rewrite their message to sound polite, professional, and natural - like a fluent English-speaking graduate student. "
        "Preserve every piece of information and intent they expressed. Do not add new content they did not mention. "
        "Do not make it overly stiff or robotic."
    ),
    "casual": (
        "You are helping an international student send a message in a group chat or casual conversation. "
        "Rewrite their message to sound friendly, natural, and relaxed - like a fluent English speaker texting a classmate. "
        "Keep contractions and casual phrasing where appropriate. "
        "Preserve all their intended meaning exactly."
    ),
    "academic": (
        "You are helping an international student prepare spoken or written content for a class presentation or academic discussion. "
        "Rewrite their message to sound clear, structured, and confident - like a fluent English-speaking student presenting to peers. "
        "Use precise vocabulary but avoid unnecessarily complex jargon. "
        "Preserve all their intended points without adding new arguments."
    ),
}

IMAGE_TONE_INSTRUCTIONS = {
    "formal": (
        "Describe the image in a polite, professional, and natural style. "
        "Write like a fluent graduate student communicating clearly and respectfully."
    ),
    "casual": (
        "Describe the image in a friendly, natural, relaxed style. "
        "Write like a fluent English speaker texting or chatting casually."
    ),
    "academic": (
        "Describe the image in a clear, structured, and confident academic style. "
        "Use precise wording without unnecessary jargon."
    ),
}


def _image_bytes_to_data_url(image_bytes: bytes, content_type: str) -> str:
    """
    Convert uploaded image bytes into a base64 data URL suitable for OpenAI image input.
    """
    supported_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    }

    mime_type = content_type if content_type in supported_types else "image/jpeg"
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


async def rewrite_text(text: str, tone: str) -> str:
    system = TONE_INSTRUCTIONS[tone]
    messages = [
        {"role": "system", "content": system},
        {
            "role": "user",
            "content": (
                f"Here is what I want to say (my rough idea):\n\n{text}\n\n"
                "Please rewrite this for me. Return only the rewritten text, no explanations."
            ),
        },
    ]
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0.4,
        max_tokens=600,
    )
    return response.choices[0].message.content.strip()


async def transcribe_audio(audio_bytes: bytes, content_type: str) -> str:
    import io

    ext_map = {
        "audio/webm": "webm",
        "audio/mp4": "mp4",
        "audio/mpeg": "mp3",
        "audio/ogg": "ogg",
        "audio/wav": "wav",
    }
    ext = ext_map.get(content_type, "webm")
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = f"recording.{ext}"

    transcript = await client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
    )
    return transcript.text


async def suggest_vocabulary(
    original: str, rewritten: str, topic_context: Optional[str]
) -> list[dict]:
    context_line = f"Topic context: {topic_context}\n" if topic_context else ""
    system = (
        "You are a vocabulary coach for international students learning academic and everyday English. "
        "Given a student's original rough text and a polished rewrite, identify 10 to 15 vocabulary words "
        "that would be most useful for this student to learn. "
        "Prioritize words that appear in the rewritten version but not the original, "
        "and words that are common in academic or professional English. "
        "Avoid extremely advanced or obscure words. "
        "Respond ONLY with a valid JSON object containing a key 'words' with an array value. "
        "No markdown, no code fences, no explanation. "
        'Each element must have exactly these keys: "word", "definition", "example_sentence", "ipa".'
    )
    user = (
        f"{context_line}"
        f"Student's original text:\n{original}\n\n"
        f"Polished rewrite:\n{rewritten}\n\n"
        'Return the JSON object with a "words" array now.'
    )
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.3,
        max_tokens=2000,
        response_format={"type": "json_object"},
    )
    raw = response.choices[0].message.content
    parsed = json.loads(raw)

    if isinstance(parsed, list):
        return parsed
    if "words" in parsed:
        return parsed["words"]
    return next((v for v in parsed.values() if isinstance(v, list)), [])


async def describe_image(
    image_bytes: bytes,
    content_type: str,
    tone: str,
    language: str = "English",
    user_prompt: Optional[str] = None,
    detail: str = "auto",
) -> str:
    """
    Describe an uploaded image in the requested tone and language.

    Args:
        image_bytes: Raw uploaded image bytes
        content_type: MIME type like image/jpeg or image/png
        tone: One of 'formal', 'casual', 'academic'
        language: Output language, e.g. 'English', 'Spanish', 'Hindi'
        user_prompt: Optional extra instruction, e.g. 'focus on clothing'
        detail: 'low', 'high', 'original', or 'auto'
    """
    if tone not in IMAGE_TONE_INSTRUCTIONS:
        raise ValueError(f"Unsupported tone: {tone}")

    if detail not in {"low", "high", "original", "auto"}:
        raise ValueError(f"Unsupported detail level: {detail}")

    image_data_url = _image_bytes_to_data_url(image_bytes, content_type)

    extra = f"\nAdditional instruction: {user_prompt}" if user_prompt else ""

    instructions = (
        f"{IMAGE_TONE_INSTRUCTIONS[tone]} "
        f"Write the response in {language}. "
        "Be accurate, natural, and concise. "
        "Do not invent details that are not visible in the image."
        f"{extra}"
    )

    response = await client.responses.create(
        model="gpt-4.1-mini",
        instructions=instructions,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Please describe this image.",
                    },
                    {
                        "type": "input_image",
                        "image_url": image_data_url,
                        "detail": detail,
                    },
                ],
            }
        ],
        max_output_tokens=500,
    )

    return response.output_text.strip()
