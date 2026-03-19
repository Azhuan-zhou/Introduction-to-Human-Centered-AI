import { useState, useMemo } from "react";
import type { VocabWord, QuizQuestion } from "../../types";
import "./QuizMode.css";

interface Props {
  words: VocabWord[];
  onQuizComplete: (score: number, total: number) => void;
  onWordAnswered: (wordId: string, correct: boolean) => void;
}

function generateQuiz(words: VocabWord[]): QuizQuestion[] {
  // Weight words due for review higher by duplicating them in the pool
  const now = new Date();
  const sorted = [...words].sort((a, b) => {
    const aDue = !a.reviewStats || new Date(a.reviewStats.nextReviewDate) <= now;
    const bDue = !b.reviewStats || new Date(b.reviewStats.nextReviewDate) <= now;
    return aDue === bDue ? 0 : aDue ? -1 : 1;
  });

  return sorted.map((word) => {
    const others = words
      .filter((w) => w.word !== word.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.definition);
    const choices = [...others, word.definition].sort(() => Math.random() - 0.5);
    return {
      wordId: word.id,
      word: word.word,
      correct_definition: word.definition,
      choices,
    };
  });
}

export function QuizMode({ words, onQuizComplete, onWordAnswered }: Props) {
  const questions = useMemo(() => generateQuiz(words), [words]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = questions[index];

  const handleAnswer = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    const correct = choice === current.correct_definition;
    if (correct) setScore((s) => s + 1);
    onWordAnswered(current.wordId, correct);
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      const finalScore = score + (selected === current.correct_definition ? 0 : 0); // score already updated
      onQuizComplete(score, questions.length);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-complete">
        <div className="quiz-score-circle" style={{ "--pct": pct } as React.CSSProperties}>
          <span className="quiz-score-num">{pct}%</span>
        </div>
        <h2>Quiz complete!</h2>
        <p>
          You got <strong>{score}</strong> out of <strong>{questions.length}</strong> correct.
        </p>
        <button className="btn-primary" onClick={restart} type="button">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-mode">
      <div className="quiz-progress">
        <div
          className="quiz-progress-bar"
          style={{ width: `${((index) / questions.length) * 100}%` }}
        />
      </div>
      <div className="quiz-counter">
        Question {index + 1} of {questions.length}
      </div>

      <div className="quiz-question">
        What does "<strong>{current.word}</strong>" mean?
      </div>

      <div className="quiz-choices">
        {current.choices.map((choice) => {
          let state: "default" | "correct" | "wrong" | "missed" = "default";
          if (selected) {
            if (choice === current.correct_definition) state = "correct";
            else if (choice === selected) state = "wrong";
          }
          return (
            <button
              key={choice}
              className={`choice-btn ${state}`}
              onClick={() => handleAnswer(choice)}
              disabled={!!selected}
              type="button"
            >
              {choice}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="quiz-feedback">
          {selected === current.correct_definition ? (
            <span className="feedback-correct">Correct!</span>
          ) : (
            <span className="feedback-wrong">
              Not quite — the correct answer is: <em>{current.correct_definition}</em>
            </span>
          )}
          <button className="btn-next" onClick={handleNext} type="button">
            {index + 1 >= questions.length ? "See results" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
