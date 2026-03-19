import openai
import os

client = openai.AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])


async def synthesize(text: str, voice: str = "nova") -> bytes:
    response = await client.audio.speech.create(
        model="tts-1",
        voice=voice,
        input=text,
    )
    return response.content
