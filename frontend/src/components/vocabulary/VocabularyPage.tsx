import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVocabularyStore } from "../../hooks/useVocabularyStore";
import { WordCard } from "./WordCard";
import type { VocabWord } from "../../types";
import "./VocabularyPage.css";

export function VocabularyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { words: savedWords, approveWord, removeWord } = useVocabularyStore();

  const suggestions: VocabWord[] = location.state?.suggestions ?? [];
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const savedWordSet = new Set(savedWords.map((w) => w.word));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [suggestions.length]);

  const handleApprove = (word: VocabWord) => {
    approveWord(word);
  };

  const handleDismiss = (wordId: string) => {
    setDismissed((prev) => new Set([...prev, wordId]));
  };

  const handleRemoveSaved = (id: string) => {
    removeWord(id);
  };

  const visibleSuggestions = suggestions.filter(
    (w) => !dismissed.has(w.id) && !savedWordSet.has(w.word)
  );

  return (
    <div className="vocabulary-page">
      <div className="vocab-header">
        <h1>Vocabulary</h1>
        <p>Approve words to add them to your flashcard deck.</p>
      </div>

      {suggestions.length > 0 && (
        <section className="vocab-section">
          <h2 className="section-title">Suggested words</h2>
          {visibleSuggestions.length === 0 ? (
            <p className="empty-hint">All suggestions have been handled.</p>
          ) : (
            <div className="word-grid">
              {visibleSuggestions.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  mode="suggest"
                  onApprove={() => handleApprove(word)}
                  onDismiss={() => handleDismiss(word.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="vocab-section">
        <div className="section-header-row">
          <h2 className="section-title">
            My word list <span className="word-count">({savedWords.length})</span>
          </h2>
          {savedWords.length >= 4 && (
            <button
              className="btn-primary"
              onClick={() => navigate("/flashcards")}
              type="button"
            >
              Practice flashcards
            </button>
          )}
        </div>

        {savedWords.length === 0 ? (
          <div className="empty-state">
            <p>No words saved yet.</p>
            <p className="empty-hint">
              Polish your writing on the{" "}
              <button className="link-btn" onClick={() => navigate("/")} type="button">
                Assistant page
              </button>{" "}
              to get word suggestions.
            </p>
          </div>
        ) : (
          <>
            <div className="word-grid">
              {savedWords.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  mode="saved"
                  onRemove={() => handleRemoveSaved(word.id)}
                />
              ))}
            </div>
            {savedWords.length < 4 && (
              <p className="empty-hint" style={{ marginTop: "1rem" }}>
                Add {4 - savedWords.length} more word
                {4 - savedWords.length > 1 ? "s" : ""} to unlock flashcard practice.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}