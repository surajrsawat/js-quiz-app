import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodingEditor from './CodingEditor';
import { buildCodingQuestion, resetQuizStore } from '@test/test-utils';

describe('CodingEditor', () => {
  it('auto-evaluates matching code and advances without manual self-check', async () => {
    const user = userEvent.setup();
    const question = buildCodingQuestion();
    const store = resetQuizStore([question, buildCodingQuestion({ id: 202 })]);
    store.setState({ ...store.getState(), phase: 'quiz', userCode: question.starterCode ?? '' });

    render(<CodingEditor question={question} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'function sum(a, b) { return a + b; }' },
    });
    await user.click(screen.getByRole('button', { name: 'Submit and See Answer' }));

    expect(screen.getByText('Expected Answer')).toBeInTheDocument();
    expect(screen.getByText(/Auto-evaluated: exact match/i)).toBeInTheDocument();
    expect(store.getState().selfMarked).toBe(true);
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(store.getState().currentIndex).toBe(1);
  });

  it('falls back to manual self-check when auto-evaluation is inconclusive', async () => {
    const user = userEvent.setup();
    const question = buildCodingQuestion({ starterCode: undefined });
    const store = resetQuizStore([question]);
    store.setState({ ...store.getState(), phase: 'quiz', userCode: 'const x = 1;' });

    render(<CodingEditor question={question} />);

    await user.click(screen.getByRole('button', { name: 'Submit and See Answer' }));
    expect(screen.getByText(/No confident auto-match found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Missed it' }));

    expect(store.getState().answers[0]).toMatchObject({ correct: false, type: 'coding' });
    expect(screen.getByRole('button', { name: 'See Results' })).toBeInTheDocument();
  });
});
