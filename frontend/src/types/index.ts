export type Tone = "formal" | "casual" | "academic";

export interface RewriteRequest {
  text: string;
  tone: Tone;
  topic_context?: string;
}

export interface RewriteResponse {
  rewritten: string;
  tone: Tone;
}

export interface ReviewStats {
  correctCount: number;
  incorrectCount: number;
  nextReviewDate: string; // ISO date string
  easeFactor: number; // SM-2 ease factor (default 2.5)
}

export interface VocabWord {
  id: string;
  word: string;
  definition: string;
  example_sentence: string;
  ipa: string;
  reviewStats?: ReviewStats;
}

export interface QuizResult {
  date: string; // ISO date string
  score: number;
  total: number;
  percentage: number;
}

export interface VocabSuggestRequest {
  original_text: string;
  rewritten_text: string;
  topic_context?: string;
}

export interface VocabSuggestResponse {
  words: Omit<VocabWord, "id">[];
}

export interface QuizQuestion {
  wordId: string;
  word: string;
  correct_definition: string;
  choices: string[];
}
