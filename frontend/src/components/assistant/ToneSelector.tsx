import type { Tone } from "../../types";
import "./ToneSelector.css";

interface Props {
  value: Tone;
  onChange: (tone: Tone) => void;
}

const TONES: { value: Tone; label: string; description: string }[] = [
  { value: "formal", label: "Formal", description: "Professor email, admin request" },
  { value: "casual", label: "Casual", description: "Group chat, classmate message" },
  { value: "academic", label: "Academic", description: "Class presentation, seminar" },
];

export function ToneSelector({ value, onChange }: Props) {
  return (
    <div className="tone-selector">
      <label className="tone-label">Tone</label>
      <div className="tone-options">
        {TONES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`tone-btn ${value === t.value ? "active" : ""}`}
            onClick={() => onChange(t.value)}
          >
            <span className="tone-name">{t.label}</span>
            <span className="tone-desc">{t.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
