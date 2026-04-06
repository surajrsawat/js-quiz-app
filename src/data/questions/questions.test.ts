import questions from './questions';

describe('questions data', () => {
  it('contains both MCQ and coding questions with unique ids', () => {
    const ids = new Set(questions.map((question) => question.id));

    expect(ids.size).toBe(questions.length);
    expect(questions.some((question) => question.type === 'mcq')).toBe(true);
    expect(questions.some((question) => question.type === 'coding')).toBe(true);
  });

  it('ensures mcq answers match one of the options and coding questions contain expected answers', () => {
    questions.forEach((question) => {
      if (question.type === 'mcq') {
        expect(question.options).toContain(question.answer);
      } else {
        expect(question.expectedAnswer.length).toBeGreaterThan(0);
      }
    });
  });
});
