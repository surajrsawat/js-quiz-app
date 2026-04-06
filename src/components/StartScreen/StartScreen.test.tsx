import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartScreen from './StartScreen';
import { resetQuizStore } from '@test/test-utils';

describe('StartScreen', () => {
  it('requires username and starts a 60-question quiz', async () => {
    const user = userEvent.setup();
    const store = resetQuizStore();

    render(<StartScreen />);

    const startButton = screen.getByRole('button', { name: 'Start Quiz' });
    expect(startButton).toBeDisabled();

    await user.type(screen.getByLabelText('Your Name'), 'Suraj');
    expect(startButton).toBeEnabled();

    await user.click(startButton);

    expect(store.getState().phase).toBe('quiz');
    expect(store.getState().userName).toBe('Suraj');
    expect(store.getState().questions).toHaveLength(60);
  });

  it('uses selected level when starting the quiz', async () => {
    const user = userEvent.setup();
    const store = resetQuizStore();

    render(<StartScreen />);

    await user.type(screen.getByLabelText('Your Name'), 'Asha');
    await user.click(screen.getByRole('button', { name: 'Expert' }));
    await user.click(screen.getByRole('button', { name: 'Start Quiz' }));

    expect(store.getState().phase).toBe('quiz');
    expect(store.getState().experienceLevel).toBe('Expert');
  });

  it('shows resume controls when a saved session exists and resumes on click', async () => {
    const user = userEvent.setup();
    const store = resetQuizStore();
    const first = store.getState().questionBank[0];
    const second = store.getState().questionBank[1];

    store.setState({
      ...store.getState(),
      resumeSessionSnapshot: {
        version: 1,
        savedAtIso: new Date().toISOString(),
        userName: 'Suraj',
        experienceLevel: 'Intermediate',
        selectedTopics: ['JavaScript Basics', 'Language Mechanics'],
        questionOrder: [first.id, second.id],
        currentIndex: 1,
        selectedAnswer: null,
        userCode: '',
        codeSubmitted: false,
        selfMarked: null,
        answers: [],
        timeRemainingSec: 55,
        questionTimeLimitSec: 90,
        currentStreak: 1,
        bestStreak: 2,
        sessionXp: 34,
        totalXp: 120,
        adaptiveProfile: 'steady',
        currentSessionMode: 'standard',
        dailyChallengeDate: null,
        dailyChallengeCompleted: false,
        dailyChallengeScorePct: null,
      },
    });

    render(<StartScreen />);

    expect(screen.getByText('Resume saved quiz?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Resume' }));

    expect(store.getState().phase).toBe('quiz');
    expect(store.getState().currentIndex).toBe(1);
  });

  it('discards saved session from the start screen', async () => {
    const user = userEvent.setup();
    const store = resetQuizStore();

    store.setState({
      ...store.getState(),
      resumeSessionSnapshot: {
        version: 1,
        savedAtIso: new Date().toISOString(),
        userName: 'Asha',
        experienceLevel: 'Beginner',
        selectedTopics: ['JavaScript Basics'],
        questionOrder: [store.getState().questionBank[0].id],
        currentIndex: 0,
        selectedAnswer: null,
        userCode: '',
        codeSubmitted: false,
        selfMarked: null,
        answers: [],
        timeRemainingSec: 40,
        questionTimeLimitSec: 90,
        currentStreak: 0,
        bestStreak: 0,
        sessionXp: 0,
        totalXp: 10,
        adaptiveProfile: 'steady',
        currentSessionMode: 'standard',
        dailyChallengeDate: null,
        dailyChallengeCompleted: false,
        dailyChallengeScorePct: null,
      },
    });

    render(<StartScreen />);
    await user.click(screen.getByRole('button', { name: 'Start Fresh' }));

    expect(store.getState().resumeSessionSnapshot).toBeNull();
  });

  it('lets user pick topics before starting the quiz', async () => {
    const user = userEvent.setup();
    const customQuestions = [
      {
        ...storeQuestion('mcq', 1, 'JavaScript Basics'),
      },
      {
        ...storeQuestion('mcq', 2, 'Algorithms'),
      },
    ];
    const store = resetQuizStore(customQuestions);

    render(<StartScreen />);

    await user.type(screen.getByLabelText('Your Name'), 'Riya');
    await user.click(screen.getByRole('button', { name: 'JavaScript Basics' }));
    await user.click(screen.getByRole('button', { name: 'Start Quiz' }));

    expect(store.getState().phase).toBe('quiz');
    expect(store.getState().selectedTopics).toEqual(['Algorithms']);
    expect(store.getState().questions.every((question) => question.topic === 'Algorithms')).toBe(true);
  });

  it('starts daily challenge mode and shows completion status', async () => {
    const user = userEvent.setup();
    const store = resetQuizStore();
    const today = new Date().toISOString().slice(0, 10);

    store.setState({
      ...store.getState(),
      dailyChallengeDate: today,
      dailyChallengeCompleted: true,
      dailyChallengeScorePct: 80,
    });

    render(<StartScreen />);

    expect(screen.getByText('Completed Today')).toBeInTheDocument();
    expect(screen.getByText(/Last score: 80%/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Your Name'), 'Daily User');
    await user.click(screen.getByRole('button', { name: 'Start Daily Challenge' }));

    expect(store.getState().phase).toBe('quiz');
    expect(store.getState().currentSessionMode).toBe('daily');
    expect(store.getState().questions).toHaveLength(10);
  });
});

const storeQuestion = (type: 'mcq' | 'coding', id: number, topic: 'JavaScript Basics' | 'Algorithms') => {
  if (type === 'coding') {
    return {
      id,
      type: 'coding' as const,
      difficulty: 'Medium' as const,
      topic,
      question: `Coding question ${id}`,
      starterCode: 'function x() {}',
      expectedAnswer: 'function x() {}',
      explanation: '',
    };
  }

  return {
    id,
    type: 'mcq' as const,
    difficulty: 'Easy' as const,
    topic,
    question: `MCQ question ${id}`,
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    explanation: '',
  };
};
