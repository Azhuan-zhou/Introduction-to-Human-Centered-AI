import { useState } from "react";
import type { VocabWord, QuizResult, ReviewStats } from "../types";

const STORAGE_KEY = "vocab_words";
const QUIZ_KEY = "quiz_results";
const STREAK_KEY = "streak_data";

interface StreakData {
  lastActiveDate: string; // ISO date string (date only)
  currentStreak: number;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function loadFromStorage(): VocabWord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as VocabWord[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(words: VocabWord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function loadQuizResults(): QuizResult[] {
  try {
    const stored = localStorage.getItem(QUIZ_KEY);
    return stored ? (JSON.parse(stored) as QuizResult[]) : [];
  } catch {
    return [];
  }
}

function loadStreak(): StreakData {
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    return stored ? (JSON.parse(stored) as StreakData) : { lastActiveDate: "", currentStreak: 0 };
  } catch {
    return { lastActiveDate: "", currentStreak: 0 };
  }
}

function updateStreak(current: StreakData): StreakData {
  const today = todayStr();
  if (current.lastActiveDate === today) return current;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak =
    current.lastActiveDate === yesterdayStr ? current.currentStreak + 1 : 1;

  const updated = { lastActiveDate: today, currentStreak: newStreak };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
}

// SM-2 simplified: calculate next review date and ease factor
function calcNextReview(stats: ReviewStats | undefined, correct: boolean): ReviewStats {
  const ef = stats ? stats.easeFactor : 2.5;
  const correctCount = stats ? stats.correctCount : 0;
  const incorrectCount = stats ? stats.incorrectCount : 0;

  const newEf = correct
    ? Math.min(ef + 0.1, 3.0)
    : Math.max(ef - 0.2, 1.3);

  const newCorrect = correct ? correctCount + 1 : correctCount;
  const newIncorrect = correct ? incorrectCount : incorrectCount + 1;

  let intervalDays: number;
  if (!correct) {
    intervalDays = 1;
  } else if (correctCount === 0) {
    intervalDays = 1;
  } else if (correctCount === 1) {
    intervalDays = 3;
  } else {
    const prevInterval = stats?.nextReviewDate
      ? Math.max(1, Math.round((new Date(stats.nextReviewDate).getTime() - Date.now()) / 86400000))
      : 1;
    intervalDays = Math.max(1, Math.round(prevInterval * newEf));
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    correctCount: newCorrect,
    incorrectCount: newIncorrect,
    nextReviewDate: nextDate.toISOString(),
    easeFactor: newEf,
  };
}

export function useVocabularyStore() {
  const [words, setWords] = useState<VocabWord[]>(loadFromStorage);
  const [quizResults, setQuizResults] = useState<QuizResult[]>(loadQuizResults);
  const [streak, setStreak] = useState<StreakData>(loadStreak);

  const approveWord = (word: VocabWord) => {
    setWords((prev) => {
      if (prev.find((w) => w.word === word.word)) return prev;
      const updated = [...prev, word];
      saveToStorage(updated);
      return updated;
    });
  };

  const removeWord = (id: string) => {
    setWords((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setWords([]);
  };

  const saveQuizResult = (score: number, total: number) => {
    const result: QuizResult = {
      date: new Date().toISOString(),
      score,
      total,
      percentage: Math.round((score / total) * 100),
    };
    setQuizResults((prev) => {
      const updated = [result, ...prev].slice(0, 20); // keep last 20
      localStorage.setItem(QUIZ_KEY, JSON.stringify(updated));
      return updated;
    });
    setStreak((prev) => updateStreak(prev));
  };

  const updateWordReview = (wordId: string, correct: boolean) => {
    setWords((prev) => {
      const updated = prev.map((w) =>
        w.id === wordId
          ? { ...w, reviewStats: calcNextReview(w.reviewStats, correct) }
          : w
      );
      saveToStorage(updated);
      return updated;
    });
  };

  const getWordsDueForReview = (): VocabWord[] => {
    const now = new Date();
    return words.filter(
      (w) => !w.reviewStats || new Date(w.reviewStats.nextReviewDate) <= now
    );
  };

  return {
    words,
    quizResults,
    streak: streak.currentStreak,
    approveWord,
    removeWord,
    clearAll,
    saveQuizResult,
    updateWordReview,
    getWordsDueForReview,
  };
}
