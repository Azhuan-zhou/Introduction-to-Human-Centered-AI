import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { speakText, suggestVocabulary } from "../../services/api";
import type { Tone, VocabWord } from "../../types";
import "./OutputPanel.css";

interface Props {
  rewrittenText: string;
  originalText: string;
  tone: Tone;
}

export function OutputPanel({ rewrittenText, originalText, tone }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingVocab, setIsLoadingVocab] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSpeak = async () => {
    setIsSpeaking(true);
    setError(null);
    try {
      await speakText(rewrittenText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio playback failed");
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleVocabulary = async () => {
    setIsLoadingVocab(true);
    setError(null);
    try {
      const words: VocabWord[] = await suggestVocabulary({
        original_text: originalText,
        rewritten_text: rewrittenText,
        topic_context: tone,
      });
      navigate("/vocabulary", { state: { suggestions: words } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate vocabulary");
      setIsLoadingVocab(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrittenText);
  };

  return (
    <div className="output-panel">
      <div className="output-header">
        <span className="output-label">Polished version</span>
        <div className="output-actions">
          <button
            className="icon-btn"
            onClick={handleCopy}
            title="Copy to clipboard"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          <button
            className={`icon-btn ${isSpeaking ? "active" : ""}`}
            onClick={handleSpeak}
            disabled={isSpeaking}
            title="Listen to pronunciation"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            {isSpeaking ? "Playing..." : "Listen"}
          </button>
        </div>
      </div>

      <div className="output-text">{rewrittenText}</div>

      {error && <div className="error-banner">{error}</div>}

      <button
        className="btn-secondary"
        onClick={handleVocabulary}
        disabled={isLoadingVocab}
        type="button"
      >
        {isLoadingVocab ? (
          <span className="btn-loading">
            <span className="spinner" /> Finding vocabulary words...
          </span>
        ) : (
          "Build vocabulary list from this"
        )}
      </button>
    </div>
  );
}
