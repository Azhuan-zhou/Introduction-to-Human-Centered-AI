import { useState } from "react";
import type { VocabWord } from "../../types";
import { speakText } from "../../services/api";
import "./WordCard.css";

interface SuggestProps {
  word: VocabWord;
  mode: "suggest";
  onApprove: () => void;
  onDismiss: () => void;
}

interface SavedProps {
  word: VocabWord;
  mode: "saved";
  onRemove: () => void;
}

type Props = SuggestProps | SavedProps;

export function WordCard(props: Props) {
  const { word } = props;
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = async () => {
    if (speaking) return;
    setSpeaking(true);
    try {
      await speakText(word.word);
    } finally {
      setSpeaking(false);
    }
  };

  return (
    <div className={`word-card ${props.mode}`}>
      <div className="word-top">
        <span className="word-text">{word.word}</span>
        <span className="word-ipa">{word.ipa}</span>
        <button
          className={`btn-tts ${speaking ? "speaking" : ""}`}
          onClick={handleSpeak}
          disabled={speaking}
          type="button"
          title="Hear pronunciation"
        >
          {speaking ? "▶" : "🔊"}
        </button>
      </div>
      <p className="word-definition">{word.definition}</p>
      <p className="word-example">"{word.example_sentence}"</p>

      {props.mode === "suggest" && (
        <div className="word-actions">
          <button className="btn-approve" onClick={props.onApprove} type="button">
            + Add
          </button>
          <button className="btn-dismiss" onClick={props.onDismiss} type="button">
            Skip
          </button>
        </div>
      )}

      {props.mode === "saved" && (
        <div className="word-actions">
          <button className="btn-dismiss" onClick={props.onRemove} type="button">
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
