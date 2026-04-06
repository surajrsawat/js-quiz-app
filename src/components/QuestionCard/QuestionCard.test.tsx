import { render, screen } from '@testing-library/react';
import QuestionCard from './QuestionCard';
import { buildCodingQuestion, buildMcqQuestion, resetQuizStore } from '@test/test-utils';

describe('QuestionCard', () => {
  it('renders the mcq variant with an MCQ badge', () => {
    const store = resetQuizStore([buildMcqQuestion()]);
    store.setState({
      ...store.getState(),
      phase: 'quiz',
      timeRemainingSec: 90,
      currentStreak: 2,
      sessionXp: 42,
    });

    render(<QuestionCard />);

    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Type: MCQ')).toBeInTheDocument();
    expect(screen.getByText('1:30')).toBeInTheDocument();
    expect(screen.getByText('Streak: 2')).toBeInTheDocument();
    expect(screen.getByText('XP: 42')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument();
  });

  it('renders the coding variant with a Coding badge', () => {
    const store = resetQuizStore([buildCodingQuestion({ difficulty: 'High' })]);
    store.setState({ ...store.getState(), phase: 'quiz', userCode: 'function sum() {}' });

    render(<QuestionCard />);

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Type: Coding')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit and See Answer' })).toBeInTheDocument();
  });
});
