import { useState } from 'react';
import useQuizStore from '@store/useQuizStore/useQuizStore';
import type { McqQuestion as McqQuestionType } from '@quiz-types/quiz';

interface McqQuestionProps {
  question: McqQuestionType;
}

function McqQuestion({ question }: Readonly<McqQuestionProps>) {
  const selectedAnswer = useQuizStore((state) => state.selectedAnswer);
  const selectAnswer = useQuizStore((state) => state.selectAnswer);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);
  const currentIndex = useQuizStore((state) => state.currentIndex);
  const questionCount = useQuizStore((state) => state.questions.length);
  const isLast = currentIndex === questionCount - 1;
  const [revealed, setRevealed] = useState(false);

  const isAnswered = Boolean(selectedAnswer) || revealed;

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return '';
    }

    if (option === question.answer) {
      return 'correct';
    }

    if (option === selectedAnswer) {
      return 'incorrect';
    }

    return '';
  };

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {question.options.map((option) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => selectAnswer(option)}
              disabled={isAnswered}
              className={`option-btn w-full text-left px-5 py-3 text-gray-700 font-medium bg-gray-50 disabled:cursor-not-allowed ${getOptionClass(option)}`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      {!isAnswered && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors border border-gray-300 text-sm"
          >
            See Solution
          </button>
        </div>
      )}

      {isAnswered && (
        <div className="flex flex-col gap-4">
          {question.explanation && (
            <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              Hint: {question.explanation}
            </p>
          )}
          <button
            type="button"
            onClick={nextQuestion}
            className="self-end px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            {isLast ? 'See Results' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}

export default McqQuestion;
