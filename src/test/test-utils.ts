import questions from '@data/questions/questions';
import useQuizStore from '@store/useQuizStore/useQuizStore';
import type { CodingQuestion, McqQuestion, QuizQuestion } from '@quiz-types/quiz';

export const buildMcqQuestion = (
  overrides: Partial<McqQuestion> = {},
): McqQuestion => ({
  id: 101,
  type: 'mcq',
  difficulty: 'Easy',
  topic: 'JavaScript Basics',
  question: 'Which option is correct?',
  options: ['Alpha', 'Beta', 'Gamma', 'Delta'],
  answer: 'Beta',
  explanation: 'Beta is the correct option.',
  ...overrides,
});

export const buildCodingQuestion = (
  overrides: Partial<CodingQuestion> = {},
): CodingQuestion => ({
  id: 201,
  type: 'coding',
  difficulty: 'Medium',
  topic: 'Algorithms',
  question: 'Implement sum(a, b).',
  starterCode: 'function sum(a, b) {\n  return a + b;\n}',
  expectedAnswer: 'function sum(a, b) {\n  return a + b;\n}',
  explanation: 'Return the sum of both arguments.',
  ...overrides,
});

export const resetQuizStore = (
  questionBank: QuizQuestion[] = questions,
) => {
  useQuizStore.getState().hydrateQuestions(questionBank);
  return useQuizStore;
};
