import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodingEditor from './CodingEditor';
import { buildCodingQuestion, resetQuizStore } from '@test/test-utils';

describe('CodingEditor', () => {
  it('submits code, reveals the answer, and advances after a correct self-check', async () => {
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

    await user.click(screen.getByRole('button', { name: 'Got it' }));

    expect(store.getState().selfMarked).toBe(true);
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(store.getState().currentIndex).toBe(1);
  });

  it('shows the results CTA after an incorrect self-check on the last question', async () => {
    const user = userEvent.setup();
    const question = buildCodingQuestion({ starterCode: undefined });
    const store = resetQuizStore([question]);
    store.setState({ ...store.getState(), phase: 'quiz', userCode: 'const x = 1;' });

    render(<CodingEditor question={question} />);

    await user.click(screen.getByRole('button', { name: 'Submit and See Answer' }));
    await user.click(screen.getByRole('button', { name: 'Missed it' }));

    expect(store.getState().answers[0]).toMatchObject({ correct: false, type: 'coding' });
    expect(screen.getByRole('button', { name: 'See Results' })).toBeInTheDocument();
  });
});
