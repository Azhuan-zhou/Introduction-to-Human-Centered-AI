# SpeakEasy — English Practice for International Students

An AI-powered web app that helps international students communicate more naturally in English.

## Features
- **Writing Assistant**: Rewrite rough ideas into natural English (formal / casual / academic tone)
- **Voice Input**: Speak your idea, get it transcribed via Whisper
- **TTS Playback**: Hear the polished version read aloud
- **Vocabulary Builder**: Get 10-15 contextually relevant vocabulary words
- **Flashcards**: Flip cards with word, IPA, definition, example
- **Quiz**: Multiple-choice quiz on your saved words

## Setup

### 1. Backend (Python + FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Add your OpenAI API key to `backend/.env`:
```
OPENAI_API_KEY=sk-...
```

Start the backend:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Architecture

```
HCA/
├── backend/          # FastAPI — GPT-4o, Whisper, TTS
│   └── app/
│       ├── routers/  # assistant.py, vocabulary.py
│       ├── services/ # openai_service.py, tts_service.py
│       └── models/   # schemas.py (Pydantic)
└── frontend/         # React + Vite + TypeScript
    └── src/
        ├── components/
        │   ├── assistant/   # Writing assistant UI
        │   ├── vocabulary/  # Word cards
        │   └── flashcards/  # Deck + quiz
        ├── hooks/           # useVoiceRecorder, useVocabularyStore
        ├── services/        # api.ts
        └── types/           # index.ts
```