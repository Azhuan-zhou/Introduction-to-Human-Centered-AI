from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import assistant, vocabulary

app = FastAPI(title="HCA Language Learning API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assistant.router, prefix="/api/assistant", tags=["assistant"])
app.include_router(vocabulary.router, prefix="/api/vocabulary", tags=["vocabulary"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
