import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultScreen from './ResultScreen';
import { buildCodingQuestion, buildMcqQuestion, resetQuizStore } from '@test/test-utils';

const mcq = buildMcqQuestion();
const coding = buildCodingQuestion();

describe('ResultScreen', () => {
  it('renders a perfect score and restarts the quiz', async () => {
    const user = userEvent.setup();
    const store = resetQuizStore([mcq]);
    store.setState({
      ...store.getState(),
      phase: 'result',
      userName: 'Suraj',
      experienceLevel: 'Intermediate',
      answers: [{ questionId: mcq.id, type: 'mcq', selected: mcq.answer, correct: true }],
    });

    render(<ResultScreen />);

    expect(screen.getByText('Perfect!')).toBeInTheDocument();
    expect(screen.getByText('Suraj • Intermediate')).toBeInTheDocument();
    expect(
      screen.getByText('Great coverage this run. Keep momentum by trying a higher difficulty mix next.'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(store.getState().phase).toBe('start');
  });

  it('renders the great job branch', () => {
    const q2 = buildMcqQuestion({ id: 102, answer: 'Alpha' });
    const q3 = buildMcqQuestion({ id: 103, answer: 'Alpha' });
    const q4 = buildMcqQuestion({ id: 104, answer: 'Alpha' });
    const q5 = buildMcqQuestion({ id: 105, answer: 'Alpha' });
    const store = resetQuizStore([mcq, q2, q3, q4, q5]);
    store.setState({
      ...store.getState(),
      phase: 'result',
      answers: [
        { questionId: mcq.id, type: 'mcq', selected: mcq.answer, correct: true },
        { questionId: q2.id, type: 'mcq', selected: q2.answer, correct: true },
        { questionId: q3.id, type: 'mcq', selected: q3.answer, correct: true },
        { questionId: q4.id, type: 'mcq', selected: q4.answer, correct: true },
        { questionId: q5.id, type: 'mcq', selected: 'wrong', correct: false },
      ],
    });

    render(<ResultScreen />);

    expect(screen.getByText('Great job!')).toBeInTheDocument();
  });

  it('renders the not bad branch', () => {
    const q2 = buildMcqQuestion({ id: 106, answer: 'Alpha' });
    const q3 = buildMcqQuestion({ id: 107, answer: 'Alpha' });
    const q4 = buildMcqQuestion({ id: 108, answer: 'Alpha' });
    const q5 = buildMcqQuestion({ id: 109, answer: 'Alpha' });
    const store = resetQuizStore([mcq, q2, q3, q4, q5]);
    store.setState({
      ...store.getState(),
      phase: 'result',
      answers: [
        { questionId: mcq.id, type: 'mcq', selected: mcq.answer, correct: true },
        { questionId: q2.id, type: 'mcq', selected: q2.answer, correct: true },
        { questionId: q3.id, type: 'mcq', selected: q3.answer, correct: true },
        { questionId: q4.id, type: 'mcq', selected: 'wrong', correct: false },
        { questionId: q5.id, type: 'mcq', selected: 'wrong', correct: false },
      ],
    });

    render(<ResultScreen />);

    expect(screen.getByText('Not bad!')).toBeInTheDocument();
  });

  it('renders the keep practising branch', () => {
    const store = resetQuizStore([mcq, coding]);
    store.setState({
      ...store.getState(),
      phase: 'result',
      answers: [
        { questionId: mcq.id, type: 'mcq', selected: 'Alpha', correct: false },
        { questionId: coding.id, type: 'coding', userCode: 'function nope() {}', correct: false },
      ],
    });

    render(<ResultScreen />);

    expect(screen.getByText('Keep practising!')).toBeInTheDocument();
    expect(screen.getByText('Weak Areas Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Next focus:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Review Answers' })).toBeInTheDocument();
  });

  it('opens review mode from result screen', async () => {
    const user = userEvent.setup();
    const store = resetQuizStore([coding]);
    store.setState({
      ...store.getState(),
      phase: 'result',
      answers: [
        {
          questionId: coding.id,
          type: 'coding',
          userCode: 'function sum(a, b) { return a + b; }',
          correct: true,
        },
      ],
    });

    render(<ResultScreen />);

    await user.click(screen.getByRole('button', { name: 'Review Answers' }));

    expect(store.getState().phase).toBe('review');
  });
});
