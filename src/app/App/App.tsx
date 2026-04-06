import StartScreen from '@components/StartScreen/StartScreen';
import QuestionCard from '@components/QuestionCard/QuestionCard';
import ResultScreen from '@components/ResultScreen/ResultScreen';
import useQuizStore from '@store/useQuizStore/useQuizStore';

function App() {
  const phase = useQuizStore((state) => state.phase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {phase === 'start' && <StartScreen />}
        {phase === 'quiz' && <QuestionCard />}
        {phase === 'result' && <ResultScreen />}
      </div>
    </div>
  );
}

export default App;
