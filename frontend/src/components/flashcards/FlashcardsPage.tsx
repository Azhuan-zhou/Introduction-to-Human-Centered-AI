import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVocabularyStore } from "../../hooks/useVocabularyStore";
import { FlashcardDeck } from "./FlashcardDeck";
import { QuizMode } from "./QuizMode";
import "./FlashcardsPage.css";

type Mode = "deck" | "quiz";

export function FlashcardsPage() {
  const { words, clearAll, saveQuizResult, updateWordReview } = useVocabularyStore();
  const [mode, setMode] = useState<Mode>("deck");
  const navigate = useNavigate();

  if (words.length === 0) {
    return (
      <div className="flashcards-page">
        <div className="empty-state">
          <h2>No flashcards yet</h2>
          <p>Approve vocabulary words from the Vocabulary page to start practicing.</p>
          <button className="btn-primary" onClick={() => navigate("/vocabulary")} type="button">
            Go to Vocabulary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcards-page">
      <div className="flashcards-header">
        <h1>Flashcards</h1>
        <div className="mode-toggle">
          <button
            className={`toggle-btn ${mode === "deck" ? "active" : ""}`}
            onClick={() => setMode("deck")}
            type="button"
          >
            Cards
          </button>
          <button
            className={`toggle-btn ${mode === "quiz" ? "active" : ""}`}
            onClick={() => setMode("quiz")}
            disabled={words.length < 4}
            title={words.length < 4 ? "Need at least 4 words for quiz" : undefined}
            type="button"
          >
            Quiz
          </button>
        </div>
      </div>

      {mode === "deck" ? (
        <FlashcardDeck words={words} />
      ) : (
        <QuizMode
          words={words}
          onQuizComplete={saveQuizResult}
          onWordAnswered={updateWordReview}
        />
      )}

      <div className="flashcards-footer">
        <button
          className="btn-danger"
          onClick={() => {
            if (confirm("Clear all saved words? This cannot be undone.")) clearAll();
          }}
          type="button"
        >
          Clear all words
        </button>
      </div>
    </div>
  );
}
