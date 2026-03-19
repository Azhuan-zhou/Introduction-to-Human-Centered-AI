import { useState } from "react";
import { InputPanel } from "./InputPanel";
import { ToneSelector } from "./ToneSelector";
import { OutputPanel } from "./OutputPanel";
import { rewriteText } from "../../services/api";
import type { Tone } from "../../types";
import "./AssistantPage.css";

export function AssistantPage() {
  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [rewrittenText, setRewrittenText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePolish = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await rewriteText({ text: inputText, tone });
      setRewrittenText(result.rewritten);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="assistant-page">
      <div className="assistant-header">
        <h1>Writing Assistant</h1>
        <p>Type your rough idea in any language or broken English — we'll make it sound natural.</p>
      </div>

      <div className="assistant-body">
        <div className="assistant-input-section">
          <InputPanel
            value={inputText}
            onChange={setInputText}
            onError={setError}
          />
          <ToneSelector value={tone} onChange={setTone} />

          {error && <div className="error-banner">{error}</div>}

          <button
            className="btn-primary"
            onClick={handlePolish}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner" /> Polishing...
              </span>
            ) : (
              "Polish my writing"
            )}
          </button>
        </div>

        {rewrittenText && (
          <OutputPanel
            rewrittenText={rewrittenText}
            originalText={inputText}
            tone={tone}
          />
        )}
      </div>
    </div>
  );
}
