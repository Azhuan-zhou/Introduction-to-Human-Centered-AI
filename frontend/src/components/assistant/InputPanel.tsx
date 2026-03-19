import { VoiceRecorder } from "./VoiceRecorder";
import "./InputPanel.css";

interface Props {
  value: string;
  onChange: (text: string) => void;
  onError: (msg: string) => void;
}

const MAX_CHARS = 2000;

export function InputPanel({ value, onChange, onError }: Props) {
  return (
    <div className="input-panel">
      <div className="input-panel-header">
        <label className="input-label">Your rough idea</label>
        <VoiceRecorder onTranscript={onChange} onError={onError} />
      </div>
      <textarea
        className="input-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or speak your idea here — in any language, broken English, or rough notes..."
        maxLength={MAX_CHARS}
        rows={5}
      />
      <div className="char-count" style={{ color: value.length > MAX_CHARS * 0.9 ? "#dc2626" : "#999" }}>
        {value.length} / {MAX_CHARS}
      </div>
    </div>
  );
}
