import useQuizStore from '@store/useQuizStore/useQuizStore';

function ReviewScreen() {
  const questions = useQuizStore((state) => state.questions);
  const answers = useQuizStore((state) => state.answers);
  const closeReview = useQuizStore((state) => state.closeReview);
  const restartQuiz = useQuizStore((state) => state.restartQuiz);

  return (
    <div className="quiz-card bg-white flex flex-col gap-6 p-8 w-full">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800">Detailed Review</h2>
        <button
          type="button"
          onClick={closeReview}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors"
        >
          Back to Summary
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {questions.map((question, index) => {
          const answer = answers.find((entry) => entry.questionId === question.id);
          const isCorrect = answer?.correct ?? false;
          const timedOut = answer?.timedOut ?? false;
          const isCoding = question.type === 'coding';
          let mcqAnswerLabel = 'No answer';

          if (timedOut) {
            mcqAnswerLabel = 'Timed out';
          } else if (answer?.type === 'mcq' && answer.selected) {
            mcqAnswerLabel = answer.selected;
          }

          let codingStatusLabel = 'Missed it';
          if (timedOut) {
            codingStatusLabel = 'Timed out';
          } else if (isCorrect) {
            codingStatusLabel = 'Got it';
          }

          return (
            <div
              key={question.id}
              className={`rounded-xl border px-4 py-3 flex flex-col gap-2 ${
                isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-700">
                  {index + 1}. {question.question}
                </p>
                <span
                  className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isCoding ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {isCoding ? 'Coding' : 'MCQ'}
                </span>
              </div>

              {question.type === 'mcq' && (
                <div className="flex flex-wrap gap-4 text-xs">
                  <span className="text-gray-500">
                    Your answer:{' '}
                    <span
                      className={
                        isCorrect ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'
                      }
                    >
                      {mcqAnswerLabel}
                    </span>
                  </span>
                  {!isCorrect && (
                    <span className="text-gray-500">
                      Correct: <span className="text-green-700 font-semibold">{question.answer}</span>
                    </span>
                  )}
                </div>
              )}

              {question.type === 'coding' && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500">
                    {answer?.type === 'coding' && answer.evaluationMode === 'auto'
                      ? 'Auto-evaluated: '
                      : 'Self-evaluated: '}
                    <span
                      className={
                        isCorrect ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'
                      }
                    >
                      {codingStatusLabel}
                    </span>
                  </p>
                  {answer?.type === 'coding' && answer.userCode && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-600 select-none">
                        Your code
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs leading-relaxed">
                        {answer.userCode}
                      </pre>
                    </details>
                  )}
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-600 select-none">
                      Expected answer
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs leading-relaxed">
                      {question.expectedAnswer}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={restartQuiz}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

export default ReviewScreen;
