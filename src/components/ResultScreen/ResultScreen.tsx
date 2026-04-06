import useQuizStore from '@store/useQuizStore/useQuizStore';

function ResultScreen() {
  const questions = useQuizStore((state) => state.questions);
  const answers = useQuizStore((state) => state.answers);
  const userName = useQuizStore((state) => state.userName);
  const experienceLevel = useQuizStore((state) => state.experienceLevel);
  const getScore = useQuizStore((state) => state.getScore);
  const restartQuiz = useQuizStore((state) => state.restartQuiz);
  const score = getScore();
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  let gradeLabel = 'Keep practising!';
  let gradeColor = 'text-red-500';

  if (percentage === 100) {
    gradeLabel = 'Perfect!';
    gradeColor = 'text-green-600';
  } else if (percentage >= 80) {
    gradeLabel = 'Great job!';
    gradeColor = 'text-indigo-600';
  } else if (percentage >= 60) {
    gradeLabel = 'Not bad!';
    gradeColor = 'text-yellow-600';
  }

  return (
    <div className="quiz-card bg-white flex flex-col gap-8 p-8 w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className={`text-2xl font-bold ${gradeColor}`}>{gradeLabel}</p>
        <p className="text-sm text-gray-500">
          {userName ? `${userName} • ${experienceLevel}` : experienceLevel}
        </p>
        <div className="score-badge">
          {score}/{total}
        </div>
        <p className="text-gray-400 text-sm">({percentage}% correct)</p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Review</h3>
        {questions.map((question, index) => {
          const answer = answers.find((entry) => entry.questionId === question.id);
          const isCorrect = answer?.correct ?? false;
          const isCoding = question.type === 'coding';

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
                      {answer?.type === 'mcq' ? answer.selected : 'No answer'}
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
                    Self-evaluated:{' '}
                    <span
                      className={
                        isCorrect ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'
                      }
                    >
                      {isCorrect ? 'Got it' : 'Missed it'}
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

export default ResultScreen;
