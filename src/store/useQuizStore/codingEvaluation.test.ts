import { evaluateCodingSubmission } from './codingEvaluation';

describe('codingEvaluation', () => {
  it('passes when user code exactly matches expected solution', () => {
    const result = evaluateCodingSubmission(
      'function sum(a, b) {\n  return a + b;\n}',
      'function sum(a, b) {\n  return a + b;\n}',
    );

    expect(result).toEqual({
      status: 'pass',
      feedback: 'Auto-evaluated: exact match with reference solution.',
    });
  });

  it('passes when TypeScript type annotations are the only difference', () => {
    const result = evaluateCodingSubmission(
      'function sum(a: number, b: number): number {\n  return a + b;\n}',
      'function sum(a, b) {\n  return a + b;\n}',
    );

    expect(result).toEqual({
      status: 'pass',
      feedback: 'Auto-evaluated: matched after TypeScript syntax normalization.',
    });
  });

  it('falls back to manual review when no confident match exists', () => {
    const result = evaluateCodingSubmission(
      'function sum(a, b) {\n  return a - b;\n}',
      'function sum(a, b) {\n  return a + b;\n}',
    );

    expect(result.status).toBe('manual');
  });
});
