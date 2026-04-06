import { render, screen } from '@testing-library/react';
import App from './App';
import { resetQuizStore } from '@test/test-utils';
import { QUIZ_SESSION_STORAGE_KEY } from '@store/useQuizStore/persistence';

describe('App', () => {
  it('renders the start screen when the phase is start', () => {
    resetQuizStore();

    render(<App />);

    expect(screen.getByRole('heading', { name: 'ScriptSprint' })).toBeInTheDocument();
  });

  it('renders the quiz screen when the phase is quiz', () => {
    const store = resetQuizStore();
    store.setState({ ...store.getState(), phase: 'quiz' });

    render(<App />);

    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });

  it('renders the result screen when the phase is result', () => {
    const store = resetQuizStore();
    store.setState({ ...store.getState(), phase: 'result' });

    render(<App />);

    expect(screen.getByRole('button', { name: 'Review Answers' })).toBeInTheDocument();
  });

  it('renders the review screen when the phase is review', () => {
    const store = resetQuizStore();
    store.setState({ ...store.getState(), phase: 'review' });

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Detailed Review' })).toBeInTheDocument();
  });

  it('loads a resumable session snapshot on app boot', () => {
    const store = resetQuizStore();
    const first = store.getState().questionBank[0];

    globalThis.localStorage.setItem(
      QUIZ_SESSION_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        savedAtIso: new Date().toISOString(),
        userName: 'Neha',
        experienceLevel: 'Expert',
        selectedTopics: ['Advanced JavaScript'],
        questionOrder: [first.id],
        currentIndex: 0,
        selectedAnswer: null,
        userCode: '',
        codeSubmitted: false,
        selfMarked: null,
        codingEvaluationFeedback: null,
        answers: [],
        timeRemainingSec: 75,
        questionTimeLimitSec: 90,
        currentStreak: 0,
        bestStreak: 1,
        sessionXp: 20,
        totalXp: 200,
        adaptiveProfile: 'steady',
        currentSessionMode: 'standard',
        dailyChallengeDate: null,
        dailyChallengeCompleted: false,
        dailyChallengeScorePct: null,
      }),
    );

    render(<App />);

    expect(screen.getByText('Resume saved quiz?')).toBeInTheDocument();
  });
});
