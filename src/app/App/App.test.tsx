import { render, screen } from '@testing-library/react';
import App from './App';
import { resetQuizStore } from '@test/test-utils';

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

    expect(screen.getByRole('heading', { name: /review/i })).toBeInTheDocument();
  });
});
