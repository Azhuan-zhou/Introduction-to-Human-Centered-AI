import { useState, useRef } from "react";

export function useVoiceRecorder(onTranscript: (text: string) => void, onError: (msg: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setIsTranscribing(true);
        try {
          const { transcribeAudio } = await import("../services/api");
          const transcript = await transcribeAudio(blob);
          onTranscript(transcript);
        } catch (err) {
          onError(err instanceof Error ? err.message : "Transcription failed");
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      onError("Microphone access denied. Please allow microphone permissions and try again.");
    }
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return { isRecording, isTranscribing, start, stop };
}
