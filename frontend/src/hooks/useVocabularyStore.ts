import { useSyncExternalStore } from "react";
import type { VocabWord, QuizResult, ReviewStats } from "../types";

const STORAGE_KEY = "vocab_words";
const QUIZ_KEY = "quiz_results";
const STREAK_KEY = "streak_data";

interface StreakData {
  lastActiveDate: string;
  currentStreak: number;
}

interface VocabularyState {
  words: VocabWord[];
  quizResults: QuizResult[];
  streak: StreakData;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function loadWords(): VocabWord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as VocabWord[]) : [];
  } catch {
    return [];
  }
}

function saveWords(words: VocabWord[]) {
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

function saveQuizResults(results: QuizResult[]) {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(results));
}

function loadStreak(): StreakData {
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    return stored
      ? (JSON.parse(stored) as StreakData)
      : { lastActiveDate: "", currentStreak: 0 };
  } catch {
    return { lastActiveDate: "", currentStreak: 0 };
  }
}

function saveStreak(streak: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

function updateStreak(current: StreakData): StreakData {
  const today = todayStr();
  if (current.lastActiveDate === today) return current;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak =
    current.lastActiveDate === yesterdayStr ? current.currentStreak + 1 : 1;

  return {
    lastActiveDate: today,
    currentStreak: newStreak,
  };
}

function calcNextReview(
  stats: ReviewStats | undefined,
  correct: boolean
): ReviewStats {
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
      ? Math.max(
          1,
          Math.round(
            (new Date(stats.nextReviewDate).getTime() - Date.now()) / 86400000
          )
        )
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

let state: VocabularyState = {
  words: loadWords(),
  quizResults: loadQuizResults(),
  streak: loadStreak(),
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(updater: (prev: VocabularyState) => VocabularyState) {
  state = updater(state);
  saveWords(state.words);
  saveQuizResults(state.quizResults);
  saveStreak(state.streak);
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function approveWord(word: VocabWord) {
  setState((prev) => {
    const exists = prev.words.some(
      (w) => w.word.toLowerCase() === word.word.toLowerCase()
    );
    if (exists) return prev;

    return {
      ...prev,
      words: [...prev.words, word],
    };
  });
}

function addWords(wordsToAdd: VocabWord[]) {
  setState((prev) => {
    const existing = new Set(prev.words.map((w) => w.word.toLowerCase()));
    const uniqueNewWords = wordsToAdd.filter(
      (word) => !existing.has(word.word.toLowerCase())
    );

    if (uniqueNewWords.length === 0) return prev;

    return {
      ...prev,
      words: [...prev.words, ...uniqueNewWords],
    };
  });
}

function removeWord(id: string) {
  setState((prev) => ({
    ...prev,
    words: prev.words.filter((w) => w.id !== id),
  }));
}

function clearAll() {
  setState((prev) => ({
    ...prev,
    words: [],
  }));
}

function saveQuizResult(score: number, total: number) {
  const result: QuizResult = {
    date: new Date().toISOString(),
    score,
    total,
    percentage: Math.round((score / total) * 100),
  };

  setState((prev) => ({
    ...prev,
    quizResults: [result, ...prev.quizResults].slice(0, 20),
    streak: updateStreak(prev.streak),
  }));
}

function updateWordReview(wordId: string, correct: boolean) {
  setState((prev) => ({
    ...prev,
    words: prev.words.map((w) =>
      w.id === wordId
        ? { ...w, reviewStats: calcNextReview(w.reviewStats, correct) }
        : w
    ),
  }));
}

function getWordsDueForReview(words: VocabWord[]): VocabWord[] {
  const now = new Date();
  return words.filter(
    (w) => !w.reviewStats || new Date(w.reviewStats.nextReviewDate) <= now
  );
}

export function useVocabularyStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    words: snapshot.words,
    quizResults: snapshot.quizResults,
    streak: snapshot.streak.currentStreak,
    approveWord,
    addWords,
    removeWord,
    clearAll,
    saveQuizResult,
    updateWordReview,
    getWordsDueForReview: () => getWordsDueForReview(snapshot.words),
  };
}