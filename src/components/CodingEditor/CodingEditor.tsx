import useQuizStore from '@store/useQuizStore/useQuizStore';
import type { CodingQuestion as CodingQuestionType } from '@quiz-types/quiz';

interface CodingEditorProps {
  question: CodingQuestionType;
}

function CodingEditor({ question }: Readonly<CodingEditorProps>) {
  const userCode = useQuizStore((state) => state.userCode);
  const codeSubmitted = useQuizStore((state) => state.codeSubmitted);
  const selfMarked = useQuizStore((state) => state.selfMarked);
  const codingEvaluationFeedback = useQuizStore((state) => state.codingEvaluationFeedback);
  const answers = useQuizStore((state) => state.answers);
  const setUserCode = useQuizStore((state) => state.setUserCode);
  const submitCode = useQuizStore((state) => state.submitCode);
  const markSelf = useQuizStore((state) => state.markSelf);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);
  const currentIndex = useQuizStore((state) => state.currentIndex);
  const questionCount = useQuizStore((state) => state.questions.length);
  const isLast = currentIndex === questionCount - 1;
  const currentCodingAnswer = answers.find(
    (answer) => answer.questionId === question.id && answer.type === 'coding',
  );
  const isAutoEvaluated = currentCodingAnswer?.evaluationMode === 'auto';
  let resultLabel = 'Marked as incorrect';
  if (isAutoEvaluated) {
    resultLabel = 'Auto-evaluated as correct';
  } else if (selfMarked) {
    resultLabel = 'Marked as correct';
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="code-editor-wrap">
        <div className="code-editor-header">
          <span className="dot bg-red-400" />
          <span className="dot bg-yellow-400" />
          <span className="dot bg-green-400" />
          <span className="code-editor-label">TypeScript</span>
        </div>
        <textarea
          className="code-editor"
          value={userCode}
          onChange={(event) => setUserCode(event.target.value)}
          disabled={codeSubmitted}
          placeholder={question.starterCode ?? '// write your solution here'}
          spellCheck={false}
          rows={8}
        />
      </div>

      {!codeSubmitted && (
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={submitCode}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors border border-gray-300 text-sm"
          >
            See Solution
          </button>
          <button
            type="button"
            onClick={submitCode}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Submit and See Answer
          </button>
        </div>
      )}

      {codeSubmitted && (
        <div className="flex flex-col gap-4">
          <div className="code-editor-wrap">
            <div className="code-editor-header">
              <span className="code-editor-label text-green-600 font-semibold">
                Expected Answer
              </span>
            </div>
            <pre className="code-editor code-editor--readonly">{question.expectedAnswer}</pre>
          </div>

          {question.explanation && (
            <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              Hint: {question.explanation}
            </p>
          )}

          {codingEvaluationFeedback && (
            <p className="text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
              {codingEvaluationFeedback}
            </p>
          )}

          {selfMarked === null ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">How did you do?</span>
              <button
                type="button"
                onClick={() => markSelf(true)}
                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-xl text-sm transition-colors border border-green-300"
              >
                Got it
              </button>
              <button
                type="button"
                onClick={() => markSelf(false)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl text-sm transition-colors border border-red-300"
              >
                Missed it
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  selfMarked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}
              >
                {resultLabel}
              </span>
              <button
                type="button"
                onClick={nextQuestion}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                {isLast ? 'See Results' : 'Next'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CodingEditor;
