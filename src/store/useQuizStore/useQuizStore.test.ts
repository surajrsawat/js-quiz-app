import { createQuizStore } from './useQuizStore';
import { buildCodingQuestion, buildMcqQuestion } from '@test/test-utils';
import { QUIZ_SESSION_STORAGE_KEY } from './persistence';

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

  it('submits coding answers with auto-evaluation when code matches expected solution', () => {
    const codingQuestion = buildCodingQuestion();
    const store = createQuizStore([codingQuestion]);

    store.getState().startQuiz();
    store.getState().setUserCode('function sum(a, b) { return a + b; }');
    store.getState().submitCode();

    expect(store.getState().codeSubmitted).toBe(true);
    expect(store.getState().selfMarked).toBe(true);
    expect(store.getState().answers[0]).toMatchObject({
      type: 'coding',
      correct: true,
      evaluationMode: 'auto',
    });
    expect(store.getState().getScore()).toBe(1);
  });

  it('falls back to manual coding self-evaluation when auto-match is not confident', () => {
    const codingQuestion = buildCodingQuestion();
    const store = createQuizStore([codingQuestion]);

    store.getState().startQuiz();
    store.getState().setUserCode('function sum(a, b) { return a - b; }');
    store.getState().submitCode();

    expect(store.getState().codeSubmitted).toBe(true);
    expect(store.getState().selfMarked).toBeNull();
    expect(store.getState().answers).toHaveLength(0);

    store.getState().markSelf(false);

    expect(store.getState().answers[0]).toMatchObject({
      type: 'coding',
      correct: false,
      evaluationMode: 'manual',
    });
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

  it('expires unanswered mcq questions and auto-advances', () => {
    const firstQuestion = buildMcqQuestion({ id: 101 });
    const secondQuestion = buildMcqQuestion({ id: 102 });
    const store = createQuizStore([firstQuestion, secondQuestion]);

    store.getState().startQuiz();
    store.setState({ ...store.getState(), questions: [firstQuestion, secondQuestion] });
    store.getState().expireCurrentQuestion();

    expect(store.getState().currentIndex).toBe(1);
    expect(store.getState().answers).toContainEqual({
      questionId: 101,
      type: 'mcq',
      selected: null,
      correct: false,
      timedOut: true,
    });
  });

  it('ticks timer down and expires unanswered coding questions at zero', () => {
    const codingQuestion = buildCodingQuestion({ id: 201 });
    const store = createQuizStore([codingQuestion]);

    store.getState().startQuiz();
    store.setState({ ...store.getState(), questions: [codingQuestion], timeRemainingSec: 1 });
    store.getState().tickTimer();

    expect(store.getState().phase).toBe('result');
    expect(store.getState().answers).toContainEqual({
      questionId: 201,
      type: 'coding',
      userCode: codingQuestion.starterCode ?? '',
      correct: false,
      timedOut: true,
    });
  });

  it('does not expire an already answered question when timer ticks', () => {
    const store = createQuizStore([buildMcqQuestion()]);

    store.getState().startQuiz();
    store.getState().selectAnswer('Beta');
    store.setState({ ...store.getState(), timeRemainingSec: 1 });
    store.getState().tickTimer();

    expect(store.getState().phase).toBe('quiz');
    expect(store.getState().answers).toHaveLength(1);
    expect(store.getState().timeRemainingSec).toBe(1);
  });

  it('hydrates resumable session metadata from localStorage', () => {
    const store = createQuizStore([buildMcqQuestion({ id: 101 })]);

    globalThis.localStorage.setItem(
      QUIZ_SESSION_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        savedAtIso: new Date().toISOString(),
        userName: 'Suraj',
        experienceLevel: 'Intermediate',
        selectedTopics: ['JavaScript Basics'],
        questionOrder: [101],
        currentIndex: 0,
        selectedAnswer: null,
        userCode: '',
        codeSubmitted: false,
        selfMarked: null,
        codingEvaluationFeedback: null,
        answers: [],
        timeRemainingSec: 80,
        questionTimeLimitSec: 90,
        currentStreak: 0,
        bestStreak: 0,
        sessionXp: 0,
        totalXp: 0,
        adaptiveProfile: 'steady',
        currentSessionMode: 'standard',
        dailyChallengeDate: null,
        dailyChallengeCompleted: false,
        dailyChallengeScorePct: null,
      }),
    );

    store.getState().initializeSession();

    expect(store.getState().resumeSessionSnapshot?.userName).toBe('Suraj');
    expect(store.getState().experienceLevel).toBe('Intermediate');
  });

  it('resumes a saved session into quiz phase', () => {
    const first = buildMcqQuestion({ id: 101 });
    const second = buildCodingQuestion({ id: 201 });
    const store = createQuizStore([first, second]);

    store.setState({
      ...store.getState(),
      resumeSessionSnapshot: {
        version: 1,
        savedAtIso: new Date().toISOString(),
        userName: 'Asha',
        experienceLevel: 'Expert',
        selectedTopics: ['JavaScript Basics', 'Algorithms'],
        questionOrder: [101, 201],
        currentIndex: 1,
        selectedAnswer: null,
        userCode: 'function sum(a, b) { return a + b; }',
        codeSubmitted: true,
        selfMarked: true,
        codingEvaluationFeedback: 'Auto-evaluated: exact match with reference solution.',
        answers: [
          {
            questionId: 101,
            type: 'mcq',
            selected: 'Beta',
            correct: true,
          },
        ],
        timeRemainingSec: 35,
        questionTimeLimitSec: 90,
        currentStreak: 2,
        bestStreak: 3,
        sessionXp: 72,
        totalXp: 220,
        adaptiveProfile: 'challenge',
        currentSessionMode: 'standard',
        dailyChallengeDate: null,
        dailyChallengeCompleted: false,
        dailyChallengeScorePct: null,
      },
    });

    store.getState().resumeSavedSession();

    expect(store.getState().phase).toBe('quiz');
    expect(store.getState().questions.map((question) => question.id)).toEqual([101, 201]);
    expect(store.getState().currentIndex).toBe(1);
    expect(store.getState().timeRemainingSec).toBe(90);
    expect(store.getState().sessionXp).toBe(72);
    expect(store.getState().totalXp).toBe(220);
    expect(store.getState().resumeSessionSnapshot).toBeNull();
  });

  it('awards xp with streak multiplier for correct answers', () => {
    const first = buildMcqQuestion({ id: 101, difficulty: 'Easy' });
    const second = buildMcqQuestion({ id: 102, difficulty: 'Medium' });
    const store = createQuizStore([first, second]);

    store.setState({
      ...store.getState(),
      phase: 'quiz',
      questions: [first, second],
      currentIndex: 0,
    });

    store.getState().selectAnswer('Beta');
    store.getState().nextQuestion();
    store.getState().markSelf(false);

    // Wrong markSelf on MCQ should be ignored.
    expect(store.getState().sessionXp).toBe(10);

    store.setState({ ...store.getState(), currentIndex: 1, selectedAnswer: null, selfMarked: null });
    store.getState().selectAnswer('Beta');

    // Streak 2 on Medium => round(20 * 1.2) = 24, cumulative 34.
    expect(store.getState().currentStreak).toBe(2);
    expect(store.getState().bestStreak).toBe(2);
    expect(store.getState().sessionXp).toBe(34);
  });

  it('resets streak and does not award xp on timeout', () => {
    const first = buildMcqQuestion({ id: 101 });
    const second = buildMcqQuestion({ id: 102 });
    const store = createQuizStore([first, second]);

    store.setState({
      ...store.getState(),
      phase: 'quiz',
      questions: [first, second],
      currentIndex: 0,
      currentStreak: 3,
      sessionXp: 50,
      totalXp: 150,
      timeRemainingSec: 1,
    });

    store.getState().tickTimer();

    expect(store.getState().currentStreak).toBe(0);
    expect(store.getState().sessionXp).toBe(50);
    expect(store.getState().totalXp).toBe(150);
  });

  it('switches to challenge profile and prioritizes higher difficulty when user performs strongly', () => {
    const questions = [
      buildMcqQuestion({ id: 101, difficulty: 'Easy' }),
      buildMcqQuestion({ id: 102, difficulty: 'Easy' }),
      buildMcqQuestion({ id: 103, difficulty: 'Medium' }),
      buildMcqQuestion({ id: 104, difficulty: 'Medium' }),
      buildMcqQuestion({ id: 105, difficulty: 'Medium' }),
      buildMcqQuestion({ id: 106, difficulty: 'Easy' }),
      buildMcqQuestion({ id: 107, difficulty: 'High' }),
      buildMcqQuestion({ id: 108, difficulty: 'High' }),
    ];
    const store = createQuizStore(questions);

    store.setState({
      ...store.getState(),
      phase: 'quiz',
      questions,
      currentIndex: 4,
      answers: [
        { questionId: 101, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 102, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 103, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 104, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 105, type: 'mcq', selected: 'Beta', correct: true },
      ],
    });

    store.getState().nextQuestion();

    expect(store.getState().adaptiveProfile).toBe('challenge');
    expect(store.getState().questions[store.getState().currentIndex].difficulty).toBe('High');
  });

  it('switches to support profile and prioritizes easier questions when user struggles', () => {
    const questions = [
      buildMcqQuestion({ id: 101, difficulty: 'High' }),
      buildMcqQuestion({ id: 102, difficulty: 'High' }),
      buildMcqQuestion({ id: 103, difficulty: 'Medium' }),
      buildMcqQuestion({ id: 104, difficulty: 'Medium' }),
      buildMcqQuestion({ id: 105, difficulty: 'Medium' }),
      buildMcqQuestion({ id: 106, difficulty: 'High' }),
      buildMcqQuestion({ id: 107, difficulty: 'Easy' }),
      buildMcqQuestion({ id: 108, difficulty: 'Easy' }),
    ];
    const store = createQuizStore(questions);

    store.setState({
      ...store.getState(),
      phase: 'quiz',
      questions,
      currentIndex: 4,
      answers: [
        { questionId: 101, type: 'mcq', selected: 'Alpha', correct: false },
        { questionId: 102, type: 'mcq', selected: 'Alpha', correct: false },
        { questionId: 103, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 104, type: 'mcq', selected: 'Alpha', correct: false },
        { questionId: 105, type: 'mcq', selected: 'Alpha', correct: false },
      ],
    });

    store.getState().nextQuestion();

    expect(store.getState().adaptiveProfile).toBe('support');
    expect(store.getState().questions[store.getState().currentIndex].difficulty).toBe('Easy');
  });

  it('builds deterministic daily challenge questions for the same date and topic scope', () => {
    const questions = [
      buildMcqQuestion({ id: 101, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 102, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 103, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 104, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 105, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 106, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 107, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 108, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 109, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 110, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 111, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 112, topic: 'JavaScript Basics' }),
    ];
    const store = createQuizStore(questions);

    store.getState().startDailyChallenge({
      userName: 'DailyUser',
      selectedTopics: ['JavaScript Basics'],
      dateKey: '2026-04-06',
    });
    const firstOrder = store.getState().questions.map((question) => question.id);

    store.getState().restartQuiz();
    store.getState().startDailyChallenge({
      userName: 'DailyUser',
      selectedTopics: ['JavaScript Basics'],
      dateKey: '2026-04-06',
    });
    const secondOrder = store.getState().questions.map((question) => question.id);

    expect(store.getState().currentSessionMode).toBe('daily');
    expect(firstOrder).toEqual(secondOrder);
    expect(firstOrder).toHaveLength(10);
  });

  it('marks daily challenge complete only when score is at least 70 percent', () => {
    const questions = Array.from({ length: 10 }, (_, offset) =>
      buildMcqQuestion({ id: 200 + offset, topic: 'JavaScript Basics', answer: 'Beta' }),
    );
    const store = createQuizStore(questions);

    store.getState().startDailyChallenge({
      userName: 'DailyUser',
      selectedTopics: ['JavaScript Basics'],
      dateKey: '2026-04-06',
    });

    store.setState({
      ...store.getState(),
      phase: 'quiz',
      currentSessionMode: 'daily',
      currentIndex: 9,
      answers: [
        { questionId: 200, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 201, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 202, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 203, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 204, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 205, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 206, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 207, type: 'mcq', selected: 'Alpha', correct: false },
        { questionId: 208, type: 'mcq', selected: 'Alpha', correct: false },
        { questionId: 209, type: 'mcq', selected: 'Alpha', correct: false },
      ],
      dailyChallengeDate: '2026-04-06',
    });

    store.getState().nextQuestion();

    expect(store.getState().phase).toBe('result');
    expect(store.getState().dailyChallengeCompleted).toBe(true);
    expect(store.getState().dailyChallengeScorePct).toBe(70);
  });

  it('builds weak area summary grouped by topic, type, and difficulty', () => {
    const questions = [
      buildMcqQuestion({ id: 101, topic: 'JavaScript Basics', difficulty: 'Easy' }),
      buildMcqQuestion({ id: 102, topic: 'JavaScript Basics', difficulty: 'Medium' }),
      buildCodingQuestion({ id: 201, topic: 'Algorithms', difficulty: 'High' }),
    ];
    const store = createQuizStore(questions);

    store.setState({
      ...store.getState(),
      questions,
      answers: [
        { questionId: 101, type: 'mcq', selected: 'Beta', correct: true },
        { questionId: 102, type: 'mcq', selected: 'Alpha', correct: false },
        { questionId: 201, type: 'coding', userCode: 'function nope() {}', correct: false },
      ],
    });

    const summary = store.getState().getWeakAreasSummary();

    expect(summary.byTopic[0]).toMatchObject({
      key: 'Algorithms',
      wrongCount: 1,
      totalCount: 1,
      accuracyPct: 0,
    });
    expect(summary.byType.find((entry) => entry.key === 'coding')).toMatchObject({
      wrongCount: 1,
      totalCount: 1,
    });
    expect(summary.byDifficulty.find((entry) => entry.key === 'High')).toMatchObject({
      wrongCount: 1,
      totalCount: 1,
    });
    expect(summary.recommendation).toContain('Next focus:');
  });

  it('returns positive recommendation when there are no misses', () => {
    const question = buildMcqQuestion({ id: 101, topic: 'JavaScript Basics' });
    const store = createQuizStore([question]);

    store.setState({
      ...store.getState(),
      questions: [question],
      answers: [{ questionId: 101, type: 'mcq', selected: 'Beta', correct: true }],
    });

    const summary = store.getState().getWeakAreasSummary();

    expect(summary.recommendation).toBe(
      'Great coverage this run. Keep momentum by trying a higher difficulty mix next.',
    );
  });

  it('restarts the quiz to the initial state', () => {
    const codingQuestion = buildCodingQuestion({ starterCode: undefined });
    const store = createQuizStore([codingQuestion]);

    store.getState().startQuiz();
    store.getState().setUserCode('let x = 1;');
    store.getState().submitCode();
    store.getState().markSelf(true);
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

  it('builds a topic-filtered session when selected topics are provided', () => {
    const topicQuestions = [
      buildMcqQuestion({ id: 101, topic: 'JavaScript Basics' }),
      buildMcqQuestion({ id: 102, topic: 'JavaScript Basics' }),
      buildCodingQuestion({ id: 201, topic: 'Algorithms' }),
    ];
    const store = createQuizStore(topicQuestions);

    store.getState().startQuiz({
      userName: 'Ira',
      experienceLevel: 'Beginner',
      selectedTopics: ['Algorithms'],
    });

    expect(store.getState().selectedTopics).toEqual(['Algorithms']);
    expect(store.getState().questions).toHaveLength(1);
    expect(store.getState().questions[0].topic).toBe('Algorithms');
  });

  it('defaults selected topics to all available topics when cleared', () => {
    const topicQuestions = [
      buildMcqQuestion({ id: 101, topic: 'JavaScript Basics' }),
      buildCodingQuestion({ id: 201, topic: 'Algorithms' }),
    ];
    const store = createQuizStore(topicQuestions);

    store.getState().setSelectedTopics([]);

    expect(store.getState().selectedTopics).toEqual(['JavaScript Basics', 'Algorithms']);
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
