import { useState } from "react";
import { InputPanel } from "./InputPanel";
import { ToneSelector } from "./ToneSelector";
import { OutputPanel } from "./OutputPanel";
import { InputModeSelector, type InputMode } from "./InputModeSelector";
import { rewriteText, describeImage } from "../../services/api";
import type { Tone } from "../../types";
import "./AssistantPage.css";

export function AssistantPage() {
  const [mode, setMode] = useState<InputMode>("text");

  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [language, setLanguage] = useState("English");
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [rewrittenText, setRewrittenText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const hasText = inputText.trim().length > 0;
    const hasImage = !!selectedImage;
    const hasSpeechText = inputText.trim().length > 0;

    if (
      (mode === "text" && !hasText) ||
      (mode === "image" && !hasImage) ||
      (mode === "speech" && !hasSpeechText)
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === "image" && selectedImage) {
        const result = await describeImage({
          image: selectedImage,
          tone,
          language,
          user_prompt: imagePrompt || undefined,
          detail: "auto",
        });
        setRewrittenText(result.description);
      } else {
        const result = await rewriteText({ text: inputText, tone });
        setRewrittenText(result.rewritten);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonLabel = () => {
    if (isLoading) {
      if (mode === "image") return "Describing...";
      if (mode === "speech") return "Refining speech...";
      return "Polishing...";
    }

    if (mode === "image") return "Describe my image";
    if (mode === "speech") return "Refine my speech";
    return "Polish my writing";
  };

  const isDisabled =
    isLoading ||
    (mode === "text" && !inputText.trim()) ||
    (mode === "image" && !selectedImage) ||
    (mode === "speech" && !inputText.trim());

  return (
    <div className="assistant-page">
      <div className="assistant-header">
        <h1>Writing Assistant</h1>
        <p>
          Choose how you want to start - type, upload an image, or speak - and
          get a polished result in your chosen tone.
        </p>
      </div>

      <div className="assistant-body">
        <div className="assistant-input-section">
          <InputModeSelector value={mode} onChange={setMode} />

          <InputPanel
            mode={mode}
            value={inputText}
            onChange={setInputText}
            onError={setError}
            language={language}
            onLanguageChange={setLanguage}
            imagePrompt={imagePrompt}
            onImagePromptChange={setImagePrompt}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          <ToneSelector value={tone} onChange={setTone} />

          {error && <div className="error-banner">{error}</div>}

          <button className="btn-primary" onClick={handleSubmit} disabled={isDisabled}>
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner" /> {getButtonLabel()}
              </span>
            ) : (
              getButtonLabel()
            )}
          </button>
        </div>

        {rewrittenText && (
          <OutputPanel
            rewrittenText={rewrittenText}
            originalText={
              mode === "image"
                ? imagePrompt || "Image description request"
                : inputText
            }
            tone={tone}
          />
        )}
      </div>
    </div>
  );
}