import { useMemo, useState } from 'react';
import useQuizStore from '@store/useQuizStore/useQuizStore';
import type { ExperienceLevel, QuizTopic } from '@quiz-types/quiz';

const LEVEL_OPTIONS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Expert'];

function StartScreen() {
  const storedUserName = useQuizStore((state) => state.userName);
  const storedExperienceLevel = useQuizStore((state) => state.experienceLevel);
  const selectedTopics = useQuizStore((state) => state.selectedTopics);
  const questionBank = useQuizStore((state) => state.questionBank);
  const resumeSessionSnapshot = useQuizStore((state) => state.resumeSessionSnapshot);
  const startQuiz = useQuizStore((state) => state.startQuiz);
  const startDailyChallenge = useQuizStore((state) => state.startDailyChallenge);
  const dailyChallengeDate = useQuizStore((state) => state.dailyChallengeDate);
  const dailyChallengeCompleted = useQuizStore((state) => state.dailyChallengeCompleted);
  const dailyChallengeScorePct = useQuizStore((state) => state.dailyChallengeScorePct);
  const setSelectedTopics = useQuizStore((state) => state.setSelectedTopics);
  const resumeSavedSession = useQuizStore((state) => state.resumeSavedSession);
  const discardSavedSession = useQuizStore((state) => state.discardSavedSession);
  const [userName, setUserName] = useState(storedUserName);
  const [level, setLevel] = useState<ExperienceLevel>(storedExperienceLevel);

  const availableTopics = useMemo(
    () => Array.from(new Set(questionBank.map((question) => question.topic))),
    [questionBank],
  );

  const handleTopicToggle = (topic: QuizTopic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((value) => value !== topic));
      return;
    }

    setSelectedTopics([...selectedTopics, topic]);
  };

  const isStartDisabled = userName.trim().length === 0 || selectedTopics.length === 0;
  const isDailyDisabled = isStartDisabled;

  const handleStartQuiz = () => {
    if (isStartDisabled) {
      return;
    }

    startQuiz({
      userName: userName.trim(),
      experienceLevel: level,
      selectedTopics,
    });
  };

  const handleDailyChallenge = () => {
    if (isDailyDisabled) {
      return;
    }

    startDailyChallenge({
      userName: userName.trim(),
      experienceLevel: level,
      selectedTopics,
    });
  };

  const today = new Date().toISOString().slice(0, 10);
  const isCompletedToday = dailyChallengeDate === today && dailyChallengeCompleted;

  return (
    <div className="quiz-card bg-white flex flex-col items-center gap-6 p-10 text-center">
      <div className="text-6xl" aria-hidden="true">
        ⚡
      </div>
      <h1 className="text-3xl font-bold text-gray-800">ScriptSprint</h1>
      <p className="text-gray-500 max-w-md">
        Choose your level and get <span className="font-semibold text-indigo-600">60</span>{' '}
        randomized questions per run.
      </p>

      {resumeSessionSnapshot && (
        <div className="w-full max-w-md rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-left">
          <p className="text-sm font-semibold text-indigo-700">Resume saved quiz?</p>
          <p className="text-xs text-indigo-600 mt-1">
            {resumeSessionSnapshot.userName || 'Player'} • {resumeSessionSnapshot.experienceLevel} •
            {' '}
            Question {Math.min(resumeSessionSnapshot.currentIndex + 1, resumeSessionSnapshot.questionOrder.length)}
            {' '}
            of {resumeSessionSnapshot.questionOrder.length}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resumeSavedSession}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={discardSavedSession}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg text-sm transition-colors border border-gray-300"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md flex flex-col gap-4">
        <label htmlFor="user-name" className="text-left text-sm font-semibold text-gray-600">
          Your Name
        </label>
        <input
          id="user-name"
          type="text"
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="w-full max-w-md flex flex-col gap-3">
        <p className="text-left text-sm font-semibold text-gray-600">Select Level</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {LEVEL_OPTIONS.map((option) => {
            const isSelected = option === level;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setLevel(option)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-left text-sm font-semibold text-gray-600">Choose Topics</p>
          <p className="text-xs text-gray-400">{selectedTopics.length} selected</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableTopics.map((topic) => {
            const isSelected = selectedTopics.includes(topic);

            return (
              <button
                key={topic}
                type="button"
                onClick={() => handleTopicToggle(topic)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleStartQuiz}
        disabled={isStartDisabled}
        className="mt-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        Start Quiz
      </button>

      <div className="w-full max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 flex flex-col gap-3 text-left">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-amber-800">Daily Challenge (10 Questions)</p>
          {isCompletedToday ? (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              Completed Today
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              Not Completed
            </span>
          )}
        </div>
        <p className="text-xs text-amber-700">
          Score at least 70% to complete today&apos;s deterministic challenge set.
          {dailyChallengeScorePct !== null && dailyChallengeDate === today
            ? ` Last score: ${dailyChallengeScorePct}%`
            : ''}
        </p>
        <button
          type="button"
          onClick={handleDailyChallenge}
          disabled={isDailyDisabled}
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        >
          Start Daily Challenge
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
