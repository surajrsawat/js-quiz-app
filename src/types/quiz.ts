export type QuizPhase = 'start' | 'quiz' | 'result' | 'review';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Expert';
export type Difficulty = 'Easy' | 'Medium' | 'High';
export type AdaptiveProfile = 'steady' | 'challenge' | 'support';
export type QuizTopic =
  | 'JavaScript Basics'
  | 'Language Mechanics'
  | 'Advanced JavaScript'
  | 'Data Structures'
  | 'Algorithms';

export interface BaseQuestion {
  id: number;
  question: string;
  difficulty: Difficulty;
  topic: QuizTopic;
  explanation?: string;
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  answer: string;
}

export interface CodingQuestion extends BaseQuestion {
  type: 'coding';
  starterCode?: string;
  expectedAnswer: string;
}

export type QuizQuestion = McqQuestion | CodingQuestion;
export type QuestionKind = QuizQuestion['type'];

export interface McqAnswerRecord {
  questionId: number;
  type: 'mcq';
  selected: string | null;
  correct: boolean;
  timedOut?: boolean;
}

export interface CodingAnswerRecord {
  questionId: number;
  type: 'coding';
  userCode: string;
  correct: boolean;
  evaluationMode?: 'auto' | 'manual';
  timedOut?: boolean;
}

export type QuizAnswerRecord = McqAnswerRecord | CodingAnswerRecord;

export interface WeakAreaEntry<T extends string> {
  key: T;
  wrongCount: number;
  totalCount: number;
  accuracyPct: number;
}

export interface WeakAreasSummary {
  byTopic: WeakAreaEntry<QuizTopic>[];
  byType: WeakAreaEntry<QuestionKind>[];
  byDifficulty: WeakAreaEntry<Difficulty>[];
  recommendation: string;
}
