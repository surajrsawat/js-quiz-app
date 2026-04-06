export type QuizPhase = 'start' | 'quiz' | 'result';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Expert';

export interface BaseQuestion {
  id: number;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'High';
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

export interface McqAnswerRecord {
  questionId: number;
  type: 'mcq';
  selected: string;
  correct: boolean;
}

export interface CodingAnswerRecord {
  questionId: number;
  type: 'coding';
  userCode: string;
  correct: boolean;
}

export type QuizAnswerRecord = McqAnswerRecord | CodingAnswerRecord;
