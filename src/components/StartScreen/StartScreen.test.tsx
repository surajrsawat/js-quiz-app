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
});
