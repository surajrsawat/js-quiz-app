import { create } from 'zustand';
import defaultQuestions from '@data/questions/questions';
import type {
  AdaptiveProfile,
  Difficulty,
  ExperienceLevel,
  QuestionKind,
  QuizAnswerRecord,
  QuizPhase,
  QuizQuestion,
  QuizTopic,
  WeakAreaEntry,
  WeakAreasSummary,
} from '@quiz-types/quiz';
import {
  clearQuizSession,
  readQuizProfile,
  readQuizSession,
  saveQuizProfile,
  saveQuizSession,
  type PersistedQuizSession,
} from './persistence';
import { evaluateCodingSubmission } from './codingEvaluation';

const SESSION_SIZE = 60;
const DAILY_CHALLENGE_SIZE = 10;
const DEFAULT_QUESTION_TIME_LIMIT_SEC = 90;
const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  Easy: 10,
  Medium: 20,
  High: 30,
};

const LEVEL_TARGETS: Record<ExperienceLevel, Record<'Easy' | 'Medium' | 'High', number>> = {
  Beginner: { Easy: 30, Medium: 18, High: 12 },
  Intermediate: { Easy: 24, Medium: 18, High: 18 },
  // User-provided expert mix sums to 90%; remaining 10% is assigned to High.
  Expert: { Easy: 12, Medium: 18, High: 30 },
};

const getTopicsFromQuestionBank = (questionBank: QuizQuestion[]): QuizTopic[] =>
  Array.from(new Set(questionBank.map((question) => question.topic)));

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

const hashSeed = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + (value.codePointAt(index) ?? 0)) >>> 0;
  }

  return hash;
};

const seededShuffle = <T>(items: T[], seed: string): T[] => {
  const output = [...items];
  let state = hashSeed(seed) || 1;

  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(next() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }

  return output;
};

const areOrdersSame = (left: number[], right: number[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((id, index) => id === right[index]);
};

const buildSessionQuestions = (
  questionBank: QuizQuestion[],
  level: ExperienceLevel,
  selectedTopics: QuizTopic[],
  previousOrder: number[],
): QuizQuestion[] => {
  const scopedBank =
    selectedTopics.length > 0
      ? questionBank.filter((question) => selectedTopics.includes(question.topic))
      : questionBank;
  const targetSize = Math.min(SESSION_SIZE, scopedBank.length);
  const targets = LEVEL_TARGETS[level];
  const buckets: Record<'Easy' | 'Medium' | 'High', QuizQuestion[]> = {
    Easy: scopedBank.filter((question) => question.difficulty === 'Easy'),
    Medium: scopedBank.filter((question) => question.difficulty === 'Medium'),
    High: scopedBank.filter((question) => question.difficulty === 'High'),
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
    const remaining = scopedBank.filter((question) => !pickedIds.has(question.id));
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

const buildDailyChallengeQuestions = (
  questionBank: QuizQuestion[],
  selectedTopics: QuizTopic[],
  dateKey: string,
): QuizQuestion[] => {
  const scopedBank =
    selectedTopics.length > 0
      ? questionBank.filter((question) => selectedTopics.includes(question.topic))
      : questionBank;
  const targetSize = Math.min(DAILY_CHALLENGE_SIZE, scopedBank.length);

  return seededShuffle(scopedBank, `daily:${dateKey}:${selectedTopics.join('|')}`).slice(0, targetSize);
};

export interface QuizStoreState {
  questionBank: QuizQuestion[];
  questions: QuizQuestion[];
  currentIndex: number;
  phase: QuizPhase;
  questionTimeLimitSec: number;
  timeRemainingSec: number;
  userName: string;
  experienceLevel: ExperienceLevel;
  selectedTopics: QuizTopic[];
  lastSessionOrder: number[];
  selectedAnswer: string | null;
  userCode: string;
  codeSubmitted: boolean;
  selfMarked: boolean | null;
  codingEvaluationFeedback: string | null;
  answers: QuizAnswerRecord[];
  currentStreak: number;
  bestStreak: number;
  sessionXp: number;
  totalXp: number;
  adaptiveProfile: AdaptiveProfile;
  currentSessionMode: 'standard' | 'daily';
  dailyChallengeDate: string | null;
  dailyChallengeCompleted: boolean;
  dailyChallengeScorePct: number | null;
  resumeSessionSnapshot: PersistedQuizSession | null;
}

export interface QuizStoreActions {
  hydrateQuestions: (questions: QuizQuestion[]) => void;
  setUserName: (userName: string) => void;
  setExperienceLevel: (experienceLevel: ExperienceLevel) => void;
  setSelectedTopics: (selectedTopics: QuizTopic[]) => void;
  startQuiz: (options?: {
    userName?: string;
    experienceLevel?: ExperienceLevel;
    selectedTopics?: QuizTopic[];
  }) => void;
  selectAnswer: (option: string) => void;
  setUserCode: (code: string) => void;
  submitCode: () => void;
  markSelf: (correct: boolean) => void;
  nextQuestion: () => void;
  tickTimer: () => void;
  expireCurrentQuestion: () => void;
  initializeSession: () => void;
  resumeSavedSession: () => void;
  discardSavedSession: () => void;
  openReview: () => void;
  closeReview: () => void;
  getWeakAreasSummary: () => WeakAreasSummary;
  startDailyChallenge: (options?: {
    userName?: string;
    experienceLevel?: ExperienceLevel;
    selectedTopics?: QuizTopic[];
    dateKey?: string;
  }) => void;
  restartQuiz: () => void;
  getScore: () => number;
}

export type QuizStore = QuizStoreState & QuizStoreActions;

const getCodingDraft = (question: QuizQuestion | undefined): string =>
  question?.type === 'coding' ? question.starterCode ?? '' : '';

const hasRecordedAnswer = (
  answers: QuizAnswerRecord[],
  questionId: number,
): boolean => answers.some((answer) => answer.questionId === questionId);

const getStreakMultiplier = (streak: number): number => {
  const bounded = Math.min(Math.max(streak, 1), 6);
  return 1 + (bounded - 1) * 0.2;
};

const getXpAward = (difficulty: Difficulty, streak: number): number =>
  Math.round(XP_BY_DIFFICULTY[difficulty] * getStreakMultiplier(streak));

const getAdaptiveProfileFromRecentAnswers = (
  answers: QuizAnswerRecord[],
): AdaptiveProfile => {
  if (answers.length < 5) {
    return 'steady';
  }

  const recent = answers.slice(-5);
  const correctCount = recent.filter((answer) => answer.correct).length;
  const accuracy = correctCount / recent.length;

  if (accuracy >= 0.8) {
    return 'challenge';
  }

  if (accuracy <= 0.4) {
    return 'support';
  }

  return 'steady';
};

const rebalanceRemainingQuestions = (
  questionBank: QuizQuestion[],
  selectedTopics: QuizTopic[],
  answeredQuestionIds: number[],
  remainingCount: number,
  profile: AdaptiveProfile,
): QuizQuestion[] => {
  const scopedBank =
    selectedTopics.length > 0
      ? questionBank.filter((question) => selectedTopics.includes(question.topic))
      : questionBank;
  const unseen = scopedBank.filter((question) => !answeredQuestionIds.includes(question.id));

  const byDifficulty: Record<Difficulty, QuizQuestion[]> = {
    Easy: unseen.filter((question) => question.difficulty === 'Easy'),
    Medium: unseen.filter((question) => question.difficulty === 'Medium'),
    High: unseen.filter((question) => question.difficulty === 'High'),
  };

  let orderByProfile: Difficulty[] = ['Medium', 'Easy', 'High'];
  if (profile === 'challenge') {
    orderByProfile = ['High', 'Medium', 'Easy'];
  } else if (profile === 'support') {
    orderByProfile = ['Easy', 'Medium', 'High'];
  }

  const selected: QuizQuestion[] = [];
  let cursor = 0;

  while (selected.length < remainingCount) {
    const difficulty = orderByProfile[cursor % orderByProfile.length];
    const bucket = byDifficulty[difficulty];

    if (bucket.length > 0) {
      const [nextQuestion] = bucket.splice(0, 1);
      selected.push(nextQuestion);
    }

    const hasRemaining = orderByProfile.some((key) => byDifficulty[key].length > 0);
    if (!hasRemaining) {
      break;
    }

    cursor += 1;
  }

  return selected;
};

const buildWeakAreaEntries = <T extends string>(
  keys: T[],
  keySelector: (question: QuizQuestion) => T,
  questions: QuizQuestion[],
  answers: QuizAnswerRecord[],
): WeakAreaEntry<T>[] => {
  const byQuestionId = new Map(answers.map((answer) => [answer.questionId, answer]));

  return keys
    .map((key) => {
      const scopedQuestions = questions.filter((question) => keySelector(question) === key);
      const totalCount = scopedQuestions.length;
      const wrongCount = scopedQuestions.filter((question) => {
        const answer = byQuestionId.get(question.id);
        return !answer?.correct;
      }).length;
      const accuracyPct =
        totalCount === 0 ? 100 : Math.round(((totalCount - wrongCount) / totalCount) * 100);

      return {
        key,
        wrongCount,
        totalCount,
        accuracyPct,
      };
    })
    .filter((entry) => entry.totalCount > 0)
    .sort((left, right) => {
      if (left.wrongCount !== right.wrongCount) {
        return right.wrongCount - left.wrongCount;
      }

      return left.accuracyPct - right.accuracyPct;
    });
};

const getWeakAreaRecommendation = (summary: WeakAreasSummary): string => {
  const topTopic = summary.byTopic.find((entry) => entry.wrongCount > 0);
  const topDifficulty = summary.byDifficulty.find((entry) => entry.wrongCount > 0);
  const topType = summary.byType.find((entry) => entry.wrongCount > 0);

  if (!topTopic && !topDifficulty && !topType) {
    return 'Great coverage this run. Keep momentum by trying a higher difficulty mix next.';
  }

  const topicText = topTopic
    ? `${topTopic.key} (${topTopic.wrongCount}/${topTopic.totalCount} missed)`
    : 'your weakest topic';
  const difficultyText = topDifficulty ? topDifficulty.key : 'mixed';
  const typeText = topType ? topType.key.toUpperCase() : 'all';

  return `Next focus: ${topicText}. Prioritize ${difficultyText} ${typeText} questions in your next run.`;
};

const toPersistedSession = (state: QuizStoreState): PersistedQuizSession => ({
  version: 1,
  savedAtIso: new Date().toISOString(),
  userName: state.userName,
  experienceLevel: state.experienceLevel,
  selectedTopics: state.selectedTopics,
  questionOrder: state.questions.map((question) => question.id),
  currentIndex: state.currentIndex,
  selectedAnswer: state.selectedAnswer,
  userCode: state.userCode,
  codeSubmitted: state.codeSubmitted,
  selfMarked: state.selfMarked,
  codingEvaluationFeedback: state.codingEvaluationFeedback,
  answers: state.answers,
  timeRemainingSec: state.timeRemainingSec,
  questionTimeLimitSec: state.questionTimeLimitSec,
  currentStreak: state.currentStreak,
  bestStreak: state.bestStreak,
  sessionXp: state.sessionXp,
  totalXp: state.totalXp,
  adaptiveProfile: state.adaptiveProfile,
  currentSessionMode: state.currentSessionMode,
  dailyChallengeDate: state.dailyChallengeDate,
  dailyChallengeCompleted: state.dailyChallengeCompleted,
  dailyChallengeScorePct: state.dailyChallengeScorePct,
});

const saveProfileSnapshot = (state: QuizStoreState): void => {
  saveQuizProfile({
    version: 1,
    totalXp: state.totalXp,
    dailyChallengeDate: state.dailyChallengeDate,
    dailyChallengeCompleted: state.dailyChallengeCompleted,
    dailyChallengeScorePct: state.dailyChallengeScorePct,
  });
};

const hydrateQuestionsFromOrder = (
  questionBank: QuizQuestion[],
  order: number[],
): QuizQuestion[] | null => {
  const byId = new Map(questionBank.map((question) => [question.id, question]));
  const restored = order
    .map((id) => byId.get(id))
    .filter((question): question is QuizQuestion => Boolean(question));

  if (restored.length !== order.length) {
    return null;
  }

  return restored;
};

export const createQuizStore = (
  questionBank: QuizQuestion[] = defaultQuestions,
) =>
  create<QuizStore>((set, get) => {
    const initialTopics = getTopicsFromQuestionBank(questionBank);

    return {
    questionBank,
    questions: questionBank,
    currentIndex: 0,
    phase: 'start',
    questionTimeLimitSec: DEFAULT_QUESTION_TIME_LIMIT_SEC,
    timeRemainingSec: DEFAULT_QUESTION_TIME_LIMIT_SEC,
    userName: '',
    experienceLevel: 'Beginner',
    selectedTopics: initialTopics,
    lastSessionOrder: [],
    selectedAnswer: null,
    userCode: getCodingDraft(questionBank[0]),
    codeSubmitted: false,
    selfMarked: null,
    codingEvaluationFeedback: null,
    answers: [],
    currentStreak: 0,
    bestStreak: 0,
    sessionXp: 0,
    totalXp: 0,
    adaptiveProfile: 'steady',
    currentSessionMode: 'standard',
    dailyChallengeDate: null,
    dailyChallengeCompleted: false,
    dailyChallengeScorePct: null,
    resumeSessionSnapshot: null,

    hydrateQuestions: (nextQuestions) =>
      set((state) => ({
        ...state,
        questionBank: nextQuestions,
        questions: nextQuestions,
        currentIndex: 0,
        phase: 'start',
        questionTimeLimitSec: DEFAULT_QUESTION_TIME_LIMIT_SEC,
        timeRemainingSec: DEFAULT_QUESTION_TIME_LIMIT_SEC,
        userName: '',
        experienceLevel: 'Beginner',
        selectedTopics: getTopicsFromQuestionBank(nextQuestions),
        lastSessionOrder: [],
        selectedAnswer: null,
        userCode: getCodingDraft(nextQuestions[0]),
        codeSubmitted: false,
        selfMarked: null,
        codingEvaluationFeedback: null,
        answers: [],
        currentStreak: 0,
        bestStreak: 0,
        sessionXp: 0,
        totalXp: state.totalXp,
        adaptiveProfile: 'steady',
        currentSessionMode: 'standard',
        dailyChallengeDate: state.dailyChallengeDate,
        dailyChallengeCompleted: state.dailyChallengeCompleted,
        dailyChallengeScorePct: state.dailyChallengeScorePct,
        resumeSessionSnapshot: null,
      })),

    setUserName: (userName) => set({ userName }),

    setExperienceLevel: (experienceLevel) => set({ experienceLevel }),

    setSelectedTopics: (selectedTopics) => {
      const availableTopics = getTopicsFromQuestionBank(get().questionBank);
      const nextTopics = selectedTopics.filter((topic) => availableTopics.includes(topic));

      set({ selectedTopics: nextTopics.length > 0 ? nextTopics : availableTopics });
    },

    startQuiz: (options) => {
      const state = get();
      const nextUserName = options?.userName ?? state.userName;
      const nextLevel = options?.experienceLevel ?? state.experienceLevel;
      const nextTopics = options?.selectedTopics ?? state.selectedTopics;
      const sessionQuestions = buildSessionQuestions(
        state.questionBank,
        nextLevel,
        nextTopics,
        state.lastSessionOrder,
      );

      set({
        questions: sessionQuestions,
        userName: nextUserName,
        experienceLevel: nextLevel,
        selectedTopics: nextTopics,
        lastSessionOrder: sessionQuestions.map((question) => question.id),
        currentIndex: 0,
        phase: 'quiz',
        currentSessionMode: 'standard',
        timeRemainingSec: state.questionTimeLimitSec,
        selectedAnswer: null,
        userCode: getCodingDraft(sessionQuestions[0]),
        codeSubmitted: false,
        selfMarked: null,
        codingEvaluationFeedback: null,
        answers: [],
        currentStreak: 0,
        bestStreak: 0,
        sessionXp: 0,
        adaptiveProfile: 'steady',
        resumeSessionSnapshot: null,
      });

      saveQuizSession(toPersistedSession(get()));
    },

    startDailyChallenge: (options) => {
      const state = get();
      const nextUserName = options?.userName ?? state.userName;
      const nextLevel = options?.experienceLevel ?? state.experienceLevel;
      const nextTopics = options?.selectedTopics ?? state.selectedTopics;
      const today = options?.dateKey ?? new Date().toISOString().slice(0, 10);
      const dailyQuestions = buildDailyChallengeQuestions(
        state.questionBank,
        nextTopics,
        today,
      );

      set({
        questions: dailyQuestions,
        userName: nextUserName,
        experienceLevel: nextLevel,
        selectedTopics: nextTopics,
        lastSessionOrder: dailyQuestions.map((question) => question.id),
        currentIndex: 0,
        phase: 'quiz',
        currentSessionMode: 'daily',
        timeRemainingSec: state.questionTimeLimitSec,
        selectedAnswer: null,
        userCode: getCodingDraft(dailyQuestions[0]),
        codeSubmitted: false,
        selfMarked: null,
        codingEvaluationFeedback: null,
        answers: [],
        currentStreak: 0,
        bestStreak: 0,
        sessionXp: 0,
        adaptiveProfile: 'steady',
        dailyChallengeDate: today,
      });

      saveQuizSession(toPersistedSession(get()));
    },

    selectAnswer: (option) => {
      const {
        currentIndex,
        questions,
        answers,
        selectedAnswer,
        currentStreak,
        bestStreak,
        sessionXp,
        totalXp,
      } = get();
      const currentQuestion = questions[currentIndex];

      if (currentQuestion?.type !== 'mcq' || selectedAnswer !== null) {
        return;
      }

      const isCorrect = option === currentQuestion.answer;
      const nextStreak = isCorrect ? currentStreak + 1 : 0;
      const nextBestStreak = isCorrect ? Math.max(bestStreak, nextStreak) : bestStreak;
      const xpAward = isCorrect ? getXpAward(currentQuestion.difficulty, nextStreak) : 0;

      set({
        selectedAnswer: option,
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        sessionXp: sessionXp + xpAward,
        totalXp: totalXp + xpAward,
        answers: [
          ...answers,
          {
            questionId: currentQuestion.id,
            type: 'mcq',
            selected: option,
            correct: isCorrect,
          },
        ],
      });

      if (xpAward > 0) {
        saveProfileSnapshot(get());
      }

      saveQuizSession(toPersistedSession(get()));
    },

    setUserCode: (code) => {
      set({ userCode: code });

      if (get().phase === 'quiz') {
        saveQuizSession(toPersistedSession(get()));
      }
    },

    submitCode: () => {
      const {
        currentIndex,
        questions,
        answers,
        userCode,
        currentStreak,
        bestStreak,
        sessionXp,
        totalXp,
      } = get();
      const currentQuestion = questions[currentIndex];

      if (currentQuestion?.type !== 'coding') {
        return;
      }

      const existing = answers.find((answer) => answer.questionId === currentQuestion.id);
      if (existing) {
        set({ codeSubmitted: true });
        saveQuizSession(toPersistedSession(get()));
        return;
      }

      const evaluation = evaluateCodingSubmission(userCode, currentQuestion.expectedAnswer);

      if (evaluation.status === 'pass') {
        const nextStreak = currentStreak + 1;
        const nextBestStreak = Math.max(bestStreak, nextStreak);
        const xpAward = getXpAward(currentQuestion.difficulty, nextStreak);

        set({
          codeSubmitted: true,
          selfMarked: true,
          codingEvaluationFeedback: evaluation.feedback,
          currentStreak: nextStreak,
          bestStreak: nextBestStreak,
          sessionXp: sessionXp + xpAward,
          totalXp: totalXp + xpAward,
          answers: [
            ...answers,
            {
              questionId: currentQuestion.id,
              type: 'coding',
              userCode,
              correct: true,
              evaluationMode: 'auto',
            },
          ],
        });

        saveProfileSnapshot(get());
        saveQuizSession(toPersistedSession(get()));

        return;
      }

      set({
        codeSubmitted: true,
        selfMarked: null,
        codingEvaluationFeedback: evaluation.feedback,
      });
      saveQuizSession(toPersistedSession(get()));
    },

    markSelf: (correct) => {
      const {
        currentIndex,
        questions,
        answers,
        userCode,
        currentStreak,
        bestStreak,
        sessionXp,
        totalXp,
      } = get();
      const currentQuestion = questions[currentIndex];

      if (currentQuestion?.type !== 'coding') {
        return;
      }

      if (hasRecordedAnswer(answers, currentQuestion.id)) {
        return;
      }

      const nextStreak = correct ? currentStreak + 1 : 0;
      const nextBestStreak = correct ? Math.max(bestStreak, nextStreak) : bestStreak;
      const xpAward = correct ? getXpAward(currentQuestion.difficulty, nextStreak) : 0;

      set({
        selfMarked: correct,
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        sessionXp: sessionXp + xpAward,
        totalXp: totalXp + xpAward,
        answers: [
          ...answers,
          {
            questionId: currentQuestion.id,
            type: 'coding',
            userCode,
            correct,
            evaluationMode: 'manual',
          },
        ],
      });

      if (xpAward > 0) {
        saveProfileSnapshot(get());
      }

      saveQuizSession(toPersistedSession(get()));
    },

    nextQuestion: () => {
      const {
        answers,
        currentIndex,
        questionBank,
        questions,
        questionTimeLimitSec,
        selectedTopics,
      } = get();
      const nextIndex = currentIndex + 1;

      if (nextIndex < questions.length) {
        const profile = getAdaptiveProfileFromRecentAnswers(answers);
        let nextQuestions = questions;
        if (profile !== 'steady') {
          const answeredIds = answers.map((answer) => answer.questionId);
          const remainingCount = questions.length - nextIndex;
          const rebalanced = rebalanceRemainingQuestions(
            questionBank,
            selectedTopics,
            answeredIds,
            remainingCount,
            profile,
          );

          if (rebalanced.length === remainingCount) {
            nextQuestions = [...questions.slice(0, nextIndex), ...rebalanced];
          }
        }

        const nextQuestion = nextQuestions[nextIndex];

        set({
          adaptiveProfile: profile,
          currentIndex: nextIndex,
          questions: nextQuestions,
          timeRemainingSec: questionTimeLimitSec,
          selectedAnswer: null,
          userCode: getCodingDraft(nextQuestion),
          codeSubmitted: false,
          selfMarked: null,
          codingEvaluationFeedback: null,
        });

        saveQuizSession(toPersistedSession(get()));

        return;
      }

      const {
        currentSessionMode,
        dailyChallengeDate,
        questions: finalQuestions,
        answers: finalAnswers,
      } = get();

      if (currentSessionMode === 'daily') {
        const totalQuestions = finalQuestions.length;
        const correctCount = finalAnswers.filter((answer) => answer.correct).length;
        const scorePct = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);
        const completed = scorePct >= 70;

        set({
          phase: 'result',
          dailyChallengeDate,
          dailyChallengeCompleted: completed,
          dailyChallengeScorePct: scorePct,
        });
        saveProfileSnapshot(get());
      } else {
        set({ phase: 'result' });
      }

      clearQuizSession();
    },

    tickTimer: () => {
      const {
        phase,
        questions,
        currentIndex,
        answers,
        timeRemainingSec,
      } = get();

      if (phase !== 'quiz') {
        return;
      }

      const currentQuestion = questions[currentIndex];
      if (!currentQuestion) {
        return;
      }

      if (hasRecordedAnswer(answers, currentQuestion.id)) {
        return;
      }

      if (timeRemainingSec <= 1) {
        get().expireCurrentQuestion();
        return;
      }

      set({ timeRemainingSec: timeRemainingSec - 1 });
      saveQuizSession(toPersistedSession(get()));
    },

    expireCurrentQuestion: () => {
      const { phase, questions, currentIndex, answers, userCode } = get();

      if (phase !== 'quiz') {
        return;
      }

      const currentQuestion = questions[currentIndex];
      if (!currentQuestion || hasRecordedAnswer(answers, currentQuestion.id)) {
        return;
      }

      const timeoutAnswer: QuizAnswerRecord =
        currentQuestion.type === 'mcq'
          ? {
              questionId: currentQuestion.id,
              type: 'mcq',
              selected: null,
              correct: false,
              timedOut: true,
            }
          : {
              questionId: currentQuestion.id,
              type: 'coding',
              userCode,
              correct: false,
              timedOut: true,
            };

      set({ answers: [...answers, timeoutAnswer], currentStreak: 0 });
      get().nextQuestion();
    },

    initializeSession: () => {
      const profile = readQuizProfile();
      const snapshot = readQuizSession();

      const profileXp = profile?.totalXp ?? 0;
      const profileDailyDate = profile?.dailyChallengeDate ?? null;
      const profileDailyCompleted = profile?.dailyChallengeCompleted ?? false;
      const profileDailyScore = profile?.dailyChallengeScorePct ?? null;

      if (!snapshot) {
        set({
          resumeSessionSnapshot: null,
          totalXp: profileXp,
          dailyChallengeDate: profileDailyDate,
          dailyChallengeCompleted: profileDailyCompleted,
          dailyChallengeScorePct: profileDailyScore,
        });
        return;
      }

      set({
        userName: snapshot.userName,
        experienceLevel: snapshot.experienceLevel,
        selectedTopics:
          snapshot.selectedTopics.length > 0
            ? snapshot.selectedTopics
            : getTopicsFromQuestionBank(get().questionBank),
        totalXp: Math.max(profileXp, snapshot.totalXp),
        dailyChallengeDate: profileDailyDate,
        dailyChallengeCompleted: profileDailyCompleted,
        dailyChallengeScorePct: profileDailyScore,
        resumeSessionSnapshot: snapshot,
      });
    },

    resumeSavedSession: () => {
      const { questionBank, resumeSessionSnapshot } = get();

      if (!resumeSessionSnapshot) {
        return;
      }

      const restoredQuestions = hydrateQuestionsFromOrder(
        questionBank,
        resumeSessionSnapshot.questionOrder,
      );

      if (!restoredQuestions || restoredQuestions.length === 0) {
        clearQuizSession();
        set({ resumeSessionSnapshot: null });
        return;
      }

      const boundedIndex = Math.min(
        Math.max(resumeSessionSnapshot.currentIndex, 0),
        restoredQuestions.length - 1,
      );

      set({
        phase: 'quiz',
        userName: resumeSessionSnapshot.userName,
        experienceLevel: resumeSessionSnapshot.experienceLevel,
        selectedTopics:
          resumeSessionSnapshot.selectedTopics.length > 0
            ? resumeSessionSnapshot.selectedTopics
            : getTopicsFromQuestionBank(questionBank),
        questions: restoredQuestions,
        lastSessionOrder: restoredQuestions.map((question) => question.id),
        currentIndex: boundedIndex,
        questionTimeLimitSec: resumeSessionSnapshot.questionTimeLimitSec,
        timeRemainingSec: resumeSessionSnapshot.questionTimeLimitSec,
        selectedAnswer: resumeSessionSnapshot.selectedAnswer,
        userCode: resumeSessionSnapshot.userCode,
        codeSubmitted: resumeSessionSnapshot.codeSubmitted,
        selfMarked: resumeSessionSnapshot.selfMarked,
        codingEvaluationFeedback: resumeSessionSnapshot.codingEvaluationFeedback,
        answers: resumeSessionSnapshot.answers,
        currentStreak: resumeSessionSnapshot.currentStreak,
        bestStreak: resumeSessionSnapshot.bestStreak,
        sessionXp: resumeSessionSnapshot.sessionXp,
        totalXp: resumeSessionSnapshot.totalXp,
        adaptiveProfile: resumeSessionSnapshot.adaptiveProfile,
        currentSessionMode: resumeSessionSnapshot.currentSessionMode,
        dailyChallengeDate: resumeSessionSnapshot.dailyChallengeDate,
        dailyChallengeCompleted: resumeSessionSnapshot.dailyChallengeCompleted,
        dailyChallengeScorePct: resumeSessionSnapshot.dailyChallengeScorePct,
        resumeSessionSnapshot: null,
      });

      saveQuizSession(toPersistedSession(get()));
    },

    discardSavedSession: () => {
      clearQuizSession();
      set({ resumeSessionSnapshot: null });
    },

    openReview: () => {
      if (get().phase === 'result') {
        set({ phase: 'review' });
      }
    },

    closeReview: () => {
      if (get().phase === 'review') {
        set({ phase: 'result' });
      }
    },

    getWeakAreasSummary: () => {
      const { questions, answers } = get();
      const topics = Array.from(new Set(questions.map((question) => question.topic)));
      const types = Array.from(new Set(questions.map((question) => question.type))) as QuestionKind[];
      const difficulties = Array.from(new Set(questions.map((question) => question.difficulty)));

      const summary: WeakAreasSummary = {
        byTopic: buildWeakAreaEntries(topics, (question) => question.topic, questions, answers),
        byType: buildWeakAreaEntries(types, (question) => question.type, questions, answers),
        byDifficulty: buildWeakAreaEntries(
          difficulties,
          (question) => question.difficulty,
          questions,
          answers,
        ),
        recommendation: '',
      };

      return {
        ...summary,
        recommendation: getWeakAreaRecommendation(summary),
      };
    },

    restartQuiz: () => {
      clearQuizSession();

      set((state) => ({
        questions: state.questionBank,
        currentIndex: 0,
        phase: 'start',
        timeRemainingSec: state.questionTimeLimitSec,
        selectedTopics: getTopicsFromQuestionBank(state.questionBank),
        selectedAnswer: null,
        userCode: getCodingDraft(state.questionBank[0]),
        codeSubmitted: false,
        selfMarked: null,
        codingEvaluationFeedback: null,
        answers: [],
        currentStreak: 0,
        bestStreak: 0,
        sessionXp: 0,
        adaptiveProfile: 'steady',
        currentSessionMode: 'standard',
        resumeSessionSnapshot: null,
      }));
    },

    getScore: () => get().answers.filter((answer) => answer.correct).length,
  };
  });

const useQuizStore = createQuizStore();

export default useQuizStore;
