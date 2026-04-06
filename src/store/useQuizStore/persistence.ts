import type {
  AdaptiveProfile,
  ExperienceLevel,
  QuizAnswerRecord,
  QuizTopic,
} from '@quiz-types/quiz';

export const QUIZ_SESSION_STORAGE_KEY = 'script-sprint:resume-session:v1';
export const QUIZ_PROFILE_STORAGE_KEY = 'script-sprint:profile:v1';

export interface PersistedQuizSession {
  version: 1;
  savedAtIso: string;
  userName: string;
  experienceLevel: ExperienceLevel;
  selectedTopics: QuizTopic[];
  questionOrder: number[];
  currentIndex: number;
  selectedAnswer: string | null;
  userCode: string;
  codeSubmitted: boolean;
  selfMarked: boolean | null;
  codingEvaluationFeedback: string | null;
  answers: QuizAnswerRecord[];
  timeRemainingSec: number;
  questionTimeLimitSec: number;
  currentStreak: number;
  bestStreak: number;
  sessionXp: number;
  totalXp: number;
  adaptiveProfile: AdaptiveProfile;
  currentSessionMode: 'standard' | 'daily';
  dailyChallengeDate: string | null;
  dailyChallengeCompleted: boolean;
  dailyChallengeScorePct: number | null;
}

export interface PersistedQuizProfile {
  version: 1;
  totalXp: number;
  dailyChallengeDate: string | null;
  dailyChallengeCompleted: boolean;
  dailyChallengeScorePct: number | null;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isExperienceLevel = (value: unknown): value is ExperienceLevel =>
  value === 'Beginner' || value === 'Intermediate' || value === 'Expert';

const isQuizTopic = (value: unknown): value is QuizTopic =>
  value === 'JavaScript Basics'
  || value === 'Language Mechanics'
  || value === 'Advanced JavaScript'
  || value === 'Data Structures'
  || value === 'Algorithms';

const isAdaptiveProfile = (value: unknown): value is AdaptiveProfile =>
  value === 'steady' || value === 'challenge' || value === 'support';

type SessionCoreFields = {
  savedAtIso: string;
  userName: string;
  experienceLevel: ExperienceLevel;
  questionOrder: unknown[];
  currentIndex: number;
  userCode: string;
  codeSubmitted: boolean;
  selfMarked: boolean | null;
  codingEvaluationFeedback: string | null;
  timeRemainingSec: number;
  questionTimeLimitSec: number;
};

const hasValidSessionCoreFields = (
  parsed: Record<string, unknown>,
): parsed is Record<string, unknown> & SessionCoreFields => {
  if (!Array.isArray(parsed.questionOrder)) {
    return false;
  }

  return (
    typeof parsed.savedAtIso === 'string'
    && typeof parsed.userName === 'string'
    && isExperienceLevel(parsed.experienceLevel)
    && typeof parsed.currentIndex === 'number'
    && typeof parsed.userCode === 'string'
    && typeof parsed.codeSubmitted === 'boolean'
    && (parsed.selfMarked === null || typeof parsed.selfMarked === 'boolean')
    && (parsed.codingEvaluationFeedback === null || typeof parsed.codingEvaluationFeedback === 'string')
    && typeof parsed.timeRemainingSec === 'number'
    && typeof parsed.questionTimeLimitSec === 'number'
  );
};

export const readQuizSession = (): PersistedQuizSession | null => {
  const raw = globalThis.localStorage.getItem(QUIZ_SESSION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isObject(parsed) || parsed.version !== 1 || !hasValidSessionCoreFields(parsed)) {
      return null;
    }

    return {
      version: 1,
      savedAtIso: parsed.savedAtIso,
      userName: parsed.userName,
      experienceLevel: parsed.experienceLevel,
      questionOrder: parsed.questionOrder
        .filter((id): id is number => typeof id === 'number')
        .map((id) => Math.trunc(id)),
      currentIndex: Math.max(0, Math.trunc(parsed.currentIndex)),
      selectedTopics: Array.isArray(parsed.selectedTopics)
        ? parsed.selectedTopics.filter((topic): topic is QuizTopic => isQuizTopic(topic))
        : [],
      selectedAnswer: typeof parsed.selectedAnswer === 'string' ? parsed.selectedAnswer : null,
      userCode: parsed.userCode,
      codeSubmitted: parsed.codeSubmitted,
      selfMarked: parsed.selfMarked,
      codingEvaluationFeedback: parsed.codingEvaluationFeedback,
      answers: Array.isArray(parsed.answers) ? (parsed.answers as QuizAnswerRecord[]) : [],
      timeRemainingSec: Math.max(1, Math.trunc(parsed.timeRemainingSec)),
      questionTimeLimitSec: Math.max(1, Math.trunc(parsed.questionTimeLimitSec)),
      currentStreak:
        typeof parsed.currentStreak === 'number' ? Math.max(0, Math.trunc(parsed.currentStreak)) : 0,
      bestStreak:
        typeof parsed.bestStreak === 'number' ? Math.max(0, Math.trunc(parsed.bestStreak)) : 0,
      sessionXp: typeof parsed.sessionXp === 'number' ? Math.max(0, Math.trunc(parsed.sessionXp)) : 0,
      totalXp: typeof parsed.totalXp === 'number' ? Math.max(0, Math.trunc(parsed.totalXp)) : 0,
      adaptiveProfile: isAdaptiveProfile(parsed.adaptiveProfile) ? parsed.adaptiveProfile : 'steady',
      currentSessionMode: parsed.currentSessionMode === 'daily' ? 'daily' : 'standard',
      dailyChallengeDate:
        typeof parsed.dailyChallengeDate === 'string' ? parsed.dailyChallengeDate : null,
      dailyChallengeCompleted: parsed.dailyChallengeCompleted === true,
      dailyChallengeScorePct:
        typeof parsed.dailyChallengeScorePct === 'number'
          ? Math.max(0, Math.min(100, Math.round(parsed.dailyChallengeScorePct)))
          : null,
    };
  } catch {
    return null;
  }
};

export const saveQuizSession = (session: PersistedQuizSession): void => {
  globalThis.localStorage.setItem(QUIZ_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearQuizSession = (): void => {
  globalThis.localStorage.removeItem(QUIZ_SESSION_STORAGE_KEY);
};

export const readQuizProfile = (): PersistedQuizProfile | null => {
  const raw = globalThis.localStorage.getItem(QUIZ_PROFILE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isObject(parsed) || parsed.version !== 1 || typeof parsed.totalXp !== 'number') {
      return null;
    }

    return {
      version: 1,
      totalXp: Math.max(0, parsed.totalXp),
      dailyChallengeDate:
        typeof parsed.dailyChallengeDate === 'string' ? parsed.dailyChallengeDate : null,
      dailyChallengeCompleted: parsed.dailyChallengeCompleted === true,
      dailyChallengeScorePct:
        typeof parsed.dailyChallengeScorePct === 'number'
          ? Math.max(0, Math.min(100, Math.round(parsed.dailyChallengeScorePct)))
          : null,
    };
  } catch {
    return null;
  }
};

export const saveQuizProfile = (profile: PersistedQuizProfile): void => {
  globalThis.localStorage.setItem(QUIZ_PROFILE_STORAGE_KEY, JSON.stringify(profile));
};
