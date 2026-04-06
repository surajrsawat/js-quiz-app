interface AutoEvaluationPass {
  status: 'pass';
  feedback: string;
}

interface AutoEvaluationFallback {
  status: 'manual';
  feedback: string;
}

export type CodingAutoEvaluationResult = AutoEvaluationPass | AutoEvaluationFallback;

const normalizeWhitespace = (value: string): string =>
  value
    .replaceAll(/\/\*[\s\S]*?\*\//g, '')
    .replaceAll(/\/\/.*$/gm, '')
    .replaceAll(/\s+/g, '')
    .replaceAll(/;+/g, ';')
    .trim();

const stripTypeAnnotations = (code: string): string =>
  code
    .replaceAll(/\b(?:interface|type)\b[\s\S]*?(?:\n\}|;)/g, '')
    .replaceAll(/\s+as\s+[A-Za-z_$][A-Za-z0-9_$<>\s[\]|&?]*/g, '')
    .replaceAll(/<\s*[A-Za-z_$][A-Za-z0-9_$,\s]*\s*>\s*(?=\()/g, '')
    .replaceAll(/:\s*[A-Za-z_$][A-Za-z0-9_$<>\s[\]|&?]*/g, '');

const hasTypeScriptSyntax = (code: string): boolean => {
  const tsMarkers = [
    /:\s*[A-Za-z_$][A-Za-z0-9_$<>\s[\]|&?]*/,
    /\b(?:interface|type|enum)\b/,
    /\b(?:public|private|protected|readonly)\b/,
    /\sas\s+[A-Za-z_$]/,
  ];

  return tsMarkers.some((pattern) => pattern.test(code));
};

export const evaluateCodingSubmission = (
  userCode: string,
  expectedAnswer: string,
): CodingAutoEvaluationResult => {
  const normalizedUser = normalizeWhitespace(userCode);
  const normalizedExpected = normalizeWhitespace(expectedAnswer);

  if (!normalizedUser) {
    return {
      status: 'manual',
      feedback: 'No code detected. Review manually after checking the expected answer.',
    };
  }

  if (normalizedUser === normalizedExpected) {
    return {
      status: 'pass',
      feedback: 'Auto-evaluated: exact match with reference solution.',
    };
  }

  const strippedUser = normalizeWhitespace(stripTypeAnnotations(userCode));
  const strippedExpected = normalizeWhitespace(stripTypeAnnotations(expectedAnswer));

  if (strippedUser === strippedExpected) {
    return {
      status: 'pass',
      feedback: 'Auto-evaluated: matched after TypeScript syntax normalization.',
    };
  }

  if (hasTypeScriptSyntax(userCode)) {
    return {
      status: 'manual',
      feedback: 'TypeScript syntax detected but no confident match. Please self-check.',
    };
  }

  return {
    status: 'manual',
    feedback: 'No confident auto-match found. Please self-check against the reference answer.',
  };
};
