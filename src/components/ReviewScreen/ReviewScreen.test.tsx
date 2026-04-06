import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewScreen from './ReviewScreen';
import { buildCodingQuestion, buildMcqQuestion, resetQuizStore } from '@test/test-utils';

describe('ReviewScreen', () => {
  it('renders coding details including expected answer and user code', () => {
    const coding = buildCodingQuestion({ id: 301 });
    const store = resetQuizStore([coding]);
    store.setState({
      ...store.getState(),
      phase: 'review',
      answers: [
        {
          questionId: coding.id,
          type: 'coding',
          userCode: 'function sum() { return 0; }',
          correct: false,
        },
      ],
    });

    render(<ReviewScreen />);

    expect(screen.getByRole('heading', { name: 'Detailed Review' })).toBeInTheDocument();
    expect(screen.getByText('Expected answer')).toBeInTheDocument();
    expect(screen.getByText('Your code')).toBeInTheDocument();
  });

  it('shows timed out label for timed out answers', () => {
    const timedOut = buildMcqQuestion({ id: 110, question: 'Timeout question?' });
    const store = resetQuizStore([timedOut]);
    store.setState({
      ...store.getState(),
      phase: 'review',
      questions: [timedOut],
      answers: [
        {
          questionId: timedOut.id,
          type: 'mcq',
          selected: null,
          correct: false,
          timedOut: true,
        },
      ],
    });

    render(<ReviewScreen />);

    expect(screen.getByText('Timed out')).toBeInTheDocument();
  });

  it('returns to result summary from review mode', async () => {
    const user = userEvent.setup();
    const store = resetQuizStore([buildMcqQuestion()]);
    store.setState({ ...store.getState(), phase: 'review' });

    render(<ReviewScreen />);

    await user.click(screen.getByRole('button', { name: 'Back to Summary' }));

    expect(store.getState().phase).toBe('result');
  });
});
