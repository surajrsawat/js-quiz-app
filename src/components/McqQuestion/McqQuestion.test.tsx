import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import McqQuestion from './McqQuestion';
import { buildMcqQuestion, resetQuizStore } from '@test/test-utils';

describe('McqQuestion', () => {
  it('lets the user answer and move to the next question', async () => {
    const user = userEvent.setup();
    const question = buildMcqQuestion();
    const store = resetQuizStore([question, buildMcqQuestion({ id: 102 })]);
    store.setState({ ...store.getState(), phase: 'quiz' });

    render(<McqQuestion question={question} />);

    await user.click(screen.getByRole('button', { name: 'Beta' }));

    expect(store.getState().selectedAnswer).toBe('Beta');
    expect(screen.getByText(/Hint:/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(store.getState().currentIndex).toBe(1);
  });

  it('shows the results CTA on the last question and marks incorrect answers', async () => {
    const user = userEvent.setup();
    const question = buildMcqQuestion();
    const store = resetQuizStore([question]);
    store.setState({ ...store.getState(), phase: 'quiz' });

    render(<McqQuestion question={question} />);

    await user.click(screen.getByRole('button', { name: 'Alpha' }));

    expect(store.getState().answers[0]).toMatchObject({ correct: false, selected: 'Alpha' });
    expect(screen.getByRole('button', { name: 'See Results' })).toBeInTheDocument();
  });
});
