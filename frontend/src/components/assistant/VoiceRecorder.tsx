import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import "./VoiceRecorder.css";

interface Props {
  onTranscript: (text: string) => void;
  onError: (msg: string) => void;
}

export function VoiceRecorder({ onTranscript, onError }: Props) {
  const { isRecording, isTranscribing, start, stop } = useVoiceRecorder(onTranscript, onError);

  if (isTranscribing) {
    return (
      <div className="voice-recorder transcribing">
        <span className="spinner-sm" /> Transcribing...
      </div>
    );
  }

  return (
    <button
      className={`voice-btn ${isRecording ? "recording" : ""}`}
      onClick={isRecording ? stop : start}
      title={isRecording ? "Stop recording" : "Start voice input"}
      type="button"
    >
      {isRecording ? (
        <>
          <span className="record-dot" /> Stop
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
          </svg>
          Speak
        </>
      )}
    </button>
  );
}
