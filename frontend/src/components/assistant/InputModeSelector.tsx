import "./InputModeSelector.css";

export type InputMode = "text" | "image" | "speech";

interface Props {
  value: InputMode;
  onChange: (mode: InputMode) => void;
}

const options: { value: InputMode; title: string; subtitle: string }[] = [
  {
    value: "text",
    title: "Text",
    subtitle: "Type rough notes",
  },
  {
    value: "image",
    title: "Image",
    subtitle: "Upload and describe",
  },
  {
    value: "speech",
    title: "Speech",
    subtitle: "Record and refine",
  },
];

export function InputModeSelector({ value, onChange }: Props) {
  return (
    <div className="input-mode-selector">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`input-mode-card ${value === option.value ? "active" : ""}`}
          onClick={() => onChange(option.value)}
        >
          <span className="input-mode-title">{option.title}</span>
          <span className="input-mode-subtitle">{option.subtitle}</span>
        </button>
      ))}
    </div>
  );
}