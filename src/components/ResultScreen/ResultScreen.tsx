import useQuizStore from '@store/useQuizStore/useQuizStore';

function ResultScreen() {
  const questions = useQuizStore((state) => state.questions);
  const userName = useQuizStore((state) => state.userName);
  const experienceLevel = useQuizStore((state) => state.experienceLevel);
  const getScore = useQuizStore((state) => state.getScore);
  const sessionXp = useQuizStore((state) => state.sessionXp);
  const totalXp = useQuizStore((state) => state.totalXp);
  const bestStreak = useQuizStore((state) => state.bestStreak);
  const getWeakAreasSummary = useQuizStore((state) => state.getWeakAreasSummary);
  const openReview = useQuizStore((state) => state.openReview);
  const restartQuiz = useQuizStore((state) => state.restartQuiz);
  const score = getScore();
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const weakAreas = getWeakAreasSummary();
  const topTopicEntries = weakAreas.byTopic.slice(0, 3);
  const topTypeEntries = weakAreas.byType.slice(0, 2);
  const topDifficultyEntries = weakAreas.byDifficulty.slice(0, 3);

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
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
            Session XP: {sessionXp}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
            Best Streak: {bestStreak}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            Total XP: {totalXp}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        Dive into a detailed, question-by-question breakdown with your answers, correct outcomes,
        and coding reference solutions.
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">
          Weak Areas Dashboard
        </h3>
        <p className="text-sm text-amber-900">{weakAreas.recommendation}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg bg-white border border-amber-100 p-3">
            <p className="font-semibold text-gray-700 mb-2">By Topic</p>
            {topTopicEntries.map((entry) => (
              <p key={entry.key} className="text-gray-600">
                {entry.key}: {entry.wrongCount}/{entry.totalCount} missed ({entry.accuracyPct}% accuracy)
              </p>
            ))}
          </div>
          <div className="rounded-lg bg-white border border-amber-100 p-3">
            <p className="font-semibold text-gray-700 mb-2">By Type</p>
            {topTypeEntries.map((entry) => (
              <p key={entry.key} className="text-gray-600">
                {entry.key.toUpperCase()}: {entry.wrongCount}/{entry.totalCount} missed ({entry.accuracyPct}% accuracy)
              </p>
            ))}
          </div>
          <div className="rounded-lg bg-white border border-amber-100 p-3">
            <p className="font-semibold text-gray-700 mb-2">By Difficulty</p>
            {topDifficultyEntries.map((entry) => (
              <p key={entry.key} className="text-gray-600">
                {entry.key}: {entry.wrongCount}/{entry.totalCount} missed ({entry.accuracyPct}% accuracy)
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={openReview}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
        >
          Review Answers
        </button>
        <button
          type="button"
          onClick={restartQuiz}
          className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default ResultScreen;
