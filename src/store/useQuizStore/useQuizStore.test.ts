import { createQuizStore } from './useQuizStore';
import { buildCodingQuestion, buildMcqQuestion } from '@test/test-utils';

describe('useQuizStore', () => {
  it('starts the quiz and resets state', () => {
    const questionBank = [buildMcqQuestion(), buildCodingQuestion()];
    const store = createQuizStore(questionBank);

    store.getState().startQuiz();

    expect(store.getState().phase).toBe('quiz');
    expect(store.getState().currentIndex).toBe(0);
    expect(store.getState().answers).toHaveLength(0);
  });

  it('handles mcq selection and ignores duplicate selections', () => {
    const questionBank = [buildMcqQuestion()];
    const store = createQuizStore(questionBank);

    store.getState().startQuiz();
    store.getState().selectAnswer('Beta');
    store.getState().selectAnswer('Alpha');

    expect(store.getState().selectedAnswer).toBe('Beta');
    expect(store.getState().answers).toEqual([
      { questionId: 101, type: 'mcq', selected: 'Beta', correct: true },
    ]);
  });

  it('ignores mcq selection on coding questions', () => {
    const store = createQuizStore([buildCodingQuestion()]);

    store.getState().startQuiz();
    store.getState().selectAnswer('Beta');

    expect(store.getState().answers).toHaveLength(0);
  });

  it('submits coding answers and marks self evaluation', () => {
    const codingQuestion = buildCodingQuestion();
    const store = createQuizStore([codingQuestion]);

    store.getState().startQuiz();
    store.getState().setUserCode('function sum(a, b) { return a + b; }');
    store.getState().submitCode();
    store.getState().markSelf(true);

    expect(store.getState().codeSubmitted).toBe(true);
    expect(store.getState().selfMarked).toBe(true);
    expect(store.getState().getScore()).toBe(1);
  });

  it('ignores coding actions on mcq questions', () => {
    const store = createQuizStore([buildMcqQuestion()]);

    store.getState().startQuiz();
    store.getState().submitCode();
    store.getState().markSelf(true);

    expect(store.getState().codeSubmitted).toBe(false);
    expect(store.getState().selfMarked).toBeNull();
  });

  it('moves to the next question and seeds coding starter code', () => {
    const mcqQuestion = buildMcqQuestion();
    const codingQuestion = buildCodingQuestion({ starterCode: 'const seeded = true;' });
    const store = createQuizStore([mcqQuestion, codingQuestion]);

    store.setState({
      ...store.getState(),
      phase: 'quiz',
      questions: [mcqQuestion, codingQuestion],
      currentIndex: 0,
      selectedAnswer: null,
      userCode: '',
      codeSubmitted: false,
      selfMarked: null,
      answers: [],
    });
    store.getState().selectAnswer('Beta');
    store.getState().nextQuestion();

    expect(store.getState().currentIndex).toBe(1);
    expect(store.getState().userCode).toBe('const seeded = true;');
  });

  it('moves to the result phase after the last question', () => {
    const store = createQuizStore([buildMcqQuestion()]);

    store.getState().startQuiz();
    store.getState().selectAnswer('Beta');
    store.getState().nextQuestion();

    expect(store.getState().phase).toBe('result');
  });

  it('restarts the quiz to the initial state', () => {
    const codingQuestion = buildCodingQuestion({ starterCode: undefined });
    const store = createQuizStore([codingQuestion]);

    store.getState().startQuiz();
    store.getState().setUserCode('let x = 1;');
    store.getState().submitCode();
    store.getState().markSelf(false);
    store.getState().restartQuiz();

    expect(store.getState().phase).toBe('start');
    expect(store.getState().userCode).toBe('');
    expect(store.getState().answers).toHaveLength(0);
  });

  it('initializes coding starter code only for coding first questions', () => {
    const mcqStore = createQuizStore([buildMcqQuestion()]);
    const codingStore = createQuizStore([buildCodingQuestion({ starterCode: undefined })]);

    expect(mcqStore.getState().userCode).toBe('');
    expect(codingStore.getState().userCode).toBe('');
  });

  it('builds a 60-question beginner session with expected difficulty ratios', () => {
    const store = createQuizStore();

    store.getState().startQuiz({ userName: 'Suraj', experienceLevel: 'Beginner' });

    const currentQuestions = store.getState().questions;
    const easyCount = currentQuestions.filter((question) => question.difficulty === 'Easy').length;
    const mediumCount = currentQuestions.filter(
      (question) => question.difficulty === 'Medium',
    ).length;
    const highCount = currentQuestions.filter((question) => question.difficulty === 'High').length;

    expect(currentQuestions).toHaveLength(60);
    expect(easyCount).toBe(30);
    expect(mediumCount).toBe(18);
    expect(highCount).toBe(12);
    expect(store.getState().userName).toBe('Suraj');
    expect(store.getState().experienceLevel).toBe('Beginner');
  });

  it('builds a 60-question expert session with expected difficulty ratios', () => {
    const store = createQuizStore();

    store.getState().startQuiz({ userName: 'Nila', experienceLevel: 'Expert' });

    const currentQuestions = store.getState().questions;
    const easyCount = currentQuestions.filter((question) => question.difficulty === 'Easy').length;
    const mediumCount = currentQuestions.filter(
      (question) => question.difficulty === 'Medium',
    ).length;
    const highCount = currentQuestions.filter((question) => question.difficulty === 'High').length;

    expect(currentQuestions).toHaveLength(60);
    expect(easyCount).toBe(12);
    expect(mediumCount).toBe(18);
    expect(highCount).toBe(30);
  });

  it('ensures a session has no repeated questions', () => {
    const store = createQuizStore();

    store.getState().startQuiz({ userName: 'Neo', experienceLevel: 'Intermediate' });

    const ids = store.getState().questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ensures consecutive starts create a new order', () => {
    const store = createQuizStore();

    store.getState().startQuiz({ userName: 'Maya', experienceLevel: 'Intermediate' });
    const firstOrder = store.getState().questions.map((question) => question.id);

    store.getState().restartQuiz();
    store.getState().startQuiz({ userName: 'Maya', experienceLevel: 'Intermediate' });
    const secondOrder = store.getState().questions.map((question) => question.id);

    expect(secondOrder).not.toEqual(firstOrder);
  });
});
