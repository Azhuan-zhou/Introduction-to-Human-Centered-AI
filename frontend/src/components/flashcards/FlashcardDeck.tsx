import { useState, useMemo } from "react";
import type { VocabWord } from "../../types";
import { speakText } from "../../services/api";
import "./FlashcardDeck.css";

interface Props {
  words: VocabWord[];
}

function sortByReviewPriority(words: VocabWord[]): VocabWord[] {
  const now = new Date();
  return [...words].sort((a, b) => {
    const aOverdue = a.reviewStats ? new Date(a.reviewStats.nextReviewDate) <= now : true;
    const bOverdue = b.reviewStats ? new Date(b.reviewStats.nextReviewDate) <= now : true;
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
    return 0;
  });
}

export function FlashcardDeck({ words }: Props) {
  const sorted = useMemo(() => sortByReviewPriority(words), [words]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const current = sorted[index];

  const prev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + sorted.length) % sorted.length);
  };

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % sorted.length);
  };

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) return;
    setSpeaking(true);
    try {
      await speakText(current.word);
    } finally {
      setSpeaking(false);
    }
  };

  const isDue = current.reviewStats
    ? new Date(current.reviewStats.nextReviewDate) <= new Date()
    : true;

  return (
    <div className="flashcard-deck">
      <div className="card-counter">
        {index + 1} / {sorted.length}
        {isDue && <span className="due-badge">Due</span>}
      </div>

      <div
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      >
        <div className="card-inner">
          <div className="card-front">
            <span className="card-word">{current.word}</span>
            <span className="card-ipa">{current.ipa}</span>
            <button
              className={`card-tts-btn ${speaking ? "speaking" : ""}`}
              onClick={handleSpeak}
              disabled={speaking}
              type="button"
              title="Hear pronunciation"
            >
              {speaking ? "▶" : "🔊"}
            </button>
            <span className="card-hint">Tap to reveal definition</span>
          </div>
          <div className="card-back">
            <p className="card-definition">{current.definition}</p>
            <p className="card-example">"{current.example_sentence}"</p>
          </div>
        </div>
      </div>

      <div className="card-nav">
        <button className="nav-btn" onClick={prev} type="button">
          ← Previous
        </button>
        <button className="nav-btn" onClick={next} type="button">
          Next →
        </button>
      </div>
    </div>
  );
}