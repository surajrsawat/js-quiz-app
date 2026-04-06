import { useState } from 'react';
import useQuizStore from '@store/useQuizStore/useQuizStore';
import type { ExperienceLevel } from '@quiz-types/quiz';

const LEVEL_OPTIONS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Expert'];

function StartScreen() {
  const storedUserName = useQuizStore((state) => state.userName);
  const storedExperienceLevel = useQuizStore((state) => state.experienceLevel);
  const startQuiz = useQuizStore((state) => state.startQuiz);
  const [userName, setUserName] = useState(storedUserName);
  const [level, setLevel] = useState<ExperienceLevel>(storedExperienceLevel);

  const isStartDisabled = userName.trim().length === 0;

  const handleStartQuiz = () => {
    if (isStartDisabled) {
      return;
    }

    startQuiz({
      userName: userName.trim(),
      experienceLevel: level,
    });
  };

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

      <button
        type="button"
        onClick={handleStartQuiz}
        disabled={isStartDisabled}
        className="mt-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        Start Quiz
      </button>
    </div>
  );
}

export default StartScreen;
