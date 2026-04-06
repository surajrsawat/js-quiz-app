import { useEffect } from 'react';
import CodingEditor from '@components/CodingEditor/CodingEditor';
import McqQuestion from '@components/McqQuestion/McqQuestion';
import useQuizStore from '@store/useQuizStore/useQuizStore';

function QuestionCard() {
  const questions = useQuizStore((state) => state.questions);
  const currentIndex = useQuizStore((state) => state.currentIndex);
  const timeRemainingSec = useQuizStore((state) => state.timeRemainingSec);
  const currentStreak = useQuizStore((state) => state.currentStreak);
  const sessionXp = useQuizStore((state) => state.sessionXp);
  const tickTimer = useQuizStore((state) => state.tickTimer);
  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const minutes = Math.floor(timeRemainingSec / 60);
  const seconds = timeRemainingSec % 60;

  useEffect(() => {
    const interval = globalThis.setInterval(() => {
      tickTimer();
    }, 1000);

    return () => {
      globalThis.clearInterval(interval);
    };
  }, [tickTimer]);

  const typeLabel =
    current.type === 'coding'
      ? { text: 'Coding', cls: 'bg-purple-100 text-purple-700' }
      : { text: 'MCQ', cls: 'bg-indigo-100 text-indigo-700' };

  let difficultyLabel = { text: 'High', cls: 'bg-red-100 text-red-700' };
  if (current.difficulty === 'Easy') {
    difficultyLabel = { text: 'Easy', cls: 'bg-green-100 text-green-700' };
  } else if (current.difficulty === 'Medium') {
    difficultyLabel = { text: 'Medium', cls: 'bg-amber-100 text-amber-700' };
  }

  return (
    <div className="quiz-card bg-white flex flex-col gap-6 p-8 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                timeRemainingSec <= 10 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyLabel.cls}`}
            >
              {difficultyLabel.text}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeLabel.cls}`}>
              Type: {typeLabel.text}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 text-xs">
          <span className="font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            Streak: {currentStreak}
          </span>
          <span className="font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
            XP: {sessionXp}
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">{current.question}</h2>

      {current.type === 'coding' ? (
        <CodingEditor question={current} />
      ) : (
        <McqQuestion question={current} />
      )}
    </div>
  );
}

export default QuestionCard;
