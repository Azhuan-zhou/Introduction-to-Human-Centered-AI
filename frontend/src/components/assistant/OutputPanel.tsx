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
    } finally {
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
            Copy
          </button>
          <button
            className={`icon-btn ${isSpeaking ? "active" : ""}`}
            onClick={handleSpeak}
            disabled={isSpeaking}
            title="Listen to pronunciation"
            type="button"
          >
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