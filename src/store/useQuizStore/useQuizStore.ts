import { create } from 'zustand';
import defaultQuestions from '@data/questions/questions';
import type {
  ExperienceLevel,
  QuizAnswerRecord,
  QuizPhase,
  QuizQuestion,
} from '@quiz-types/quiz';

const SESSION_SIZE = 60;

const LEVEL_TARGETS: Record<ExperienceLevel, Record<'Easy' | 'Medium' | 'High', number>> = {
  Beginner: { Easy: 30, Medium: 18, High: 12 },
  Intermediate: { Easy: 24, Medium: 18, High: 18 },
  // User-provided expert mix sums to 90%; remaining 10% is assigned to High.
  Expert: { Easy: 12, Medium: 18, High: 30 },
};

const fisherYatesShuffle = <T>(items: T[]): T[] => {
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }

  return output;
};

const sampleWithoutReplacement = <T>(items: T[], count: number): T[] =>
  fisherYatesShuffle(items).slice(0, Math.max(0, count));

const areOrdersSame = (left: number[], right: number[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((id, index) => id === right[index]);
};

const buildSessionQuestions = (
  questionBank: QuizQuestion[],
  level: ExperienceLevel,
  previousOrder: number[],
): QuizQuestion[] => {
  const targetSize = Math.min(SESSION_SIZE, questionBank.length);
  const targets = LEVEL_TARGETS[level];
  const buckets: Record<'Easy' | 'Medium' | 'High', QuizQuestion[]> = {
    Easy: questionBank.filter((question) => question.difficulty === 'Easy'),
    Medium: questionBank.filter((question) => question.difficulty === 'Medium'),
    High: questionBank.filter((question) => question.difficulty === 'High'),
  };

  const pickedIds = new Set<number>();
  const selected: QuizQuestion[] = [];

  (['Easy', 'Medium', 'High'] as const).forEach((difficulty) => {
    const sampled = sampleWithoutReplacement(buckets[difficulty], targets[difficulty]);
    sampled.forEach((question) => {
      if (!pickedIds.has(question.id)) {
        pickedIds.add(question.id);
        selected.push(question);
      }
    });
  });

  if (selected.length < targetSize) {
    const remaining = questionBank.filter((question) => !pickedIds.has(question.id));
    const fallback = sampleWithoutReplacement(remaining, targetSize - selected.length);
    fallback.forEach((question) => {
      pickedIds.add(question.id);
      selected.push(question);
    });
  }

  if (selected.length < targetSize) {
    throw new Error('Not enough questions to build a quiz session.');
  }

  let shuffled = fisherYatesShuffle(selected);

  if (previousOrder.length > 0 && shuffled.length > 1) {
    let attempts = 0;
    while (areOrdersSame(shuffled.map((question) => question.id), previousOrder) && attempts < 5) {
      shuffled = fisherYatesShuffle(selected);
      attempts += 1;
    }

    if (areOrdersSame(shuffled.map((question) => question.id), previousOrder)) {
      shuffled = [...shuffled.slice(1), shuffled[0]];
    }
  }

  return shuffled;
};

export interface QuizStoreState {
  questionBank: QuizQuestion[];
  questions: QuizQuestion[];
  currentIndex: number;
  phase: QuizPhase;
  userName: string;
  experienceLevel: ExperienceLevel;
  lastSessionOrder: number[];
  selectedAnswer: string | null;
  userCode: string;
  codeSubmitted: boolean;
  selfMarked: boolean | null;
  answers: QuizAnswerRecord[];
}

export interface QuizStoreActions {
  hydrateQuestions: (questions: QuizQuestion[]) => void;
  setUserName: (userName: string) => void;
  setExperienceLevel: (experienceLevel: ExperienceLevel) => void;
  startQuiz: (options?: {
    userName?: string;
    experienceLevel?: ExperienceLevel;
  }) => void;
  selectAnswer: (option: string) => void;
  setUserCode: (code: string) => void;
  submitCode: () => void;
  markSelf: (correct: boolean) => void;
  nextQuestion: () => void;
  restartQuiz: () => void;
  getScore: () => number;
}

export type QuizStore = QuizStoreState & QuizStoreActions;

const getCodingDraft = (question: QuizQuestion | undefined): string =>
  question?.type === 'coding' ? question.starterCode ?? '' : '';

export const createQuizStore = (
  questionBank: QuizQuestion[] = defaultQuestions,
) =>
  create<QuizStore>((set, get) => ({
    questionBank,
    questions: questionBank,
    currentIndex: 0,
    phase: 'start',
    userName: '',
    experienceLevel: 'Beginner',
    lastSessionOrder: [],
    selectedAnswer: null,
    userCode: getCodingDraft(questionBank[0]),
    codeSubmitted: false,
    selfMarked: null,
    answers: [],

    hydrateQuestions: (nextQuestions) =>
      set({
        questionBank: nextQuestions,
        questions: nextQuestions,
        currentIndex: 0,
        phase: 'start',
        userName: '',
        experienceLevel: 'Beginner',
        lastSessionOrder: [],
        selectedAnswer: null,
        userCode: getCodingDraft(nextQuestions[0]),
        codeSubmitted: false,
        selfMarked: null,
        answers: [],
      }),

    setUserName: (userName) => set({ userName }),

    setExperienceLevel: (experienceLevel) => set({ experienceLevel }),

    startQuiz: (options) => {
      const state = get();
      const nextUserName = options?.userName ?? state.userName;
      const nextLevel = options?.experienceLevel ?? state.experienceLevel;
      const sessionQuestions = buildSessionQuestions(
        state.questionBank,
        nextLevel,
        state.lastSessionOrder,
      );

      set({
        questions: sessionQuestions,
        userName: nextUserName,
        experienceLevel: nextLevel,
        lastSessionOrder: sessionQuestions.map((question) => question.id),
        currentIndex: 0,
        phase: 'quiz',
        selectedAnswer: null,
        userCode: getCodingDraft(sessionQuestions[0]),
        codeSubmitted: false,
        selfMarked: null,
        answers: [],
      });
    },

    selectAnswer: (option) => {
      const { currentIndex, questions, answers, selectedAnswer } = get();
      const currentQuestion = questions[currentIndex];

      if (currentQuestion?.type !== 'mcq' || selectedAnswer !== null) {
        return;
      }

      set({
        selectedAnswer: option,
        answers: [
          ...answers,
          {
            questionId: currentQuestion.id,
            type: 'mcq',
            selected: option,
            correct: option === currentQuestion.answer,
          },
        ],
      });
    },

    setUserCode: (code) => set({ userCode: code }),

    submitCode: () => {
      const currentQuestion = get().questions[get().currentIndex];

      if (currentQuestion?.type !== 'coding') {
        return;
      }

      set({ codeSubmitted: true });
    },

    markSelf: (correct) => {
      const { currentIndex, questions, answers, userCode } = get();
      const currentQuestion = questions[currentIndex];

      if (currentQuestion?.type !== 'coding') {
        return;
      }

      set({
        selfMarked: correct,
        answers: [
          ...answers,
          {
            questionId: currentQuestion.id,
            type: 'coding',
            userCode,
            correct,
          },
        ],
      });
    },

    nextQuestion: () => {
      const { currentIndex, questions } = get();
      const nextIndex = currentIndex + 1;

      if (nextIndex < questions.length) {
        const nextQuestion = questions[nextIndex];

        set({
          currentIndex: nextIndex,
          selectedAnswer: null,
          userCode: getCodingDraft(nextQuestion),
          codeSubmitted: false,
          selfMarked: null,
        });

        return;
      }

      set({ phase: 'result' });
    },

    restartQuiz: () =>
      set((state) => ({
        questions: state.questionBank,
        currentIndex: 0,
        phase: 'start',
        selectedAnswer: null,
        userCode: getCodingDraft(state.questionBank[0]),
        codeSubmitted: false,
        selfMarked: null,
        answers: [],
      })),

    getScore: () => get().answers.filter((answer) => answer.correct).length,
  }));

const useQuizStore = createQuizStore();

export default useQuizStore;
