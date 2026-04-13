import { ChangeEvent } from "react";
import { VoiceRecorder } from "./VoiceRecorder";
import type { InputMode } from "./InputModeSelector";
import "./InputPanel.css";

interface Props {
  mode: InputMode;
  value: string;
  onChange: (text: string) => void;
  onError: (msg: string) => void;

  language: string;
  onLanguageChange: (language: string) => void;

  imagePrompt: string;
  onImagePromptChange: (prompt: string) => void;

  selectedImage: File | null;
  onImageSelect: (file: File | null) => void;
}

const MAX_CHARS = 2000;

export function InputPanel({
  mode,
  value,
  onChange,
  onError,
  language,
  onLanguageChange,
  imagePrompt,
  onImagePromptChange,
  selectedImage,
  onImageSelect,
}: Props) {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      onImageSelect(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      onError("Please upload a valid image file.");
      return;
    }

    onImageSelect(file);
  };

  const clearImage = () => {
    onImageSelect(null);
  };

  if (mode === "text") {
    return (
      <div className="input-panel">
        <div className="input-panel-header">
          <label className="input-label">Your rough idea</label>
        </div>

        <textarea
          className="input-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your idea here - in any language, broken English, or rough notes..."
          maxLength={MAX_CHARS}
          rows={6}
        />

        <div
          className="char-count"
          style={{ color: value.length > MAX_CHARS * 0.9 ? "#dc2626" : "#999" }}
        >
          {value.length} / {MAX_CHARS}
        </div>
      </div>
    );
  }

  if (mode === "image") {
    return (
      <div className="input-panel">
        <div className="input-extra-group">
          <label className="input-label">Output language</label>
          <input
            className="text-input"
            type="text"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            placeholder="English"
          />
        </div>

        <div className="input-extra-group">
          <label className="input-label">Upload an image</label>
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {selectedImage && (
            <div className="selected-file-row">
              <span className="selected-file-name">{selectedImage.name}</span>
              <button type="button" className="clear-file-btn" onClick={clearImage}>
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="input-extra-group">
          <label className="input-label">Image instruction (optional)</label>
          <textarea
            className="input-textarea"
            value={imagePrompt}
            onChange={(e) => onImagePromptChange(e.target.value)}
            placeholder="Example: Focus on the setting, people, objects, and what is happening."
            rows={4}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="input-panel">
      <div className="input-panel-header">
        <label className="input-label">Record your speech</label>
        <VoiceRecorder onTranscript={onChange} onError={onError} />
      </div>

      <textarea
        className="input-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your transcript will appear here after recording..."
        maxLength={MAX_CHARS}
        rows={6}
      />

      <div
        className="char-count"
        style={{ color: value.length > MAX_CHARS * 0.9 ? "#dc2626" : "#999" }}
      >
        {value.length} / {MAX_CHARS}
      </div>
    </div>
  );
}