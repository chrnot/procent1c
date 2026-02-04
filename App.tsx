
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameLogEntry } from './types';
import { PROBLEMS } from './problems';
import Terminal from './components/Terminal';
import { getNarrative, getHint } from './geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    currentProblemIndex: 0,
    log: [
      { type: 'system', text: '--- SYSTEM INITIALIZED: PROCENT-PARADOXEN v1.0 ---' },
      { type: 'system', text: 'Välkommen, användare. Du är fast i en digital simulering där logiken är trasig.' },
      { type: 'system', text: 'Endast genom att lösa de matematiska paradoxerna kan du ta dig ut.' },
      { type: 'system', text: '--------------------------------------------------' }
    ],
    isGameOver: false,
    score: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const addLog = useCallback((text: string, type: GameLogEntry['type'] = 'narrative') => {
    setState(prev => ({
      ...prev,
      log: [...prev.log, { type, text }]
    }));
  }, []);

  // Initialize first room
  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      const firstProblem = PROBLEMS[0];
      const story = await getNarrative(firstProblem.roomName, firstProblem.questDescription);
      addLog(story, 'narrative');
      addLog(firstProblem.mathQuestion, 'system');
      setIsLoading(false);
    };
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerHint = async () => {
    if (state.isGameOver || isLoading) return;
    setIsLoading(true);
    addLog("[ HÄMTAR DATA FRÅN HACKER-DATABAS... ]", 'input');
    const currentProblem = PROBLEMS[state.currentProblemIndex];
    const hint = await getHint(currentProblem.mathQuestion);
    addLog(`HACKER-TIPS: ${hint}`, 'system');
    setIsLoading(false);
  };

  const handleInput = async (input: string) => {
    if (state.isGameOver || isLoading) return;

    if (input.toLowerCase() === 'hjälp' || input.toLowerCase() === 'hint') {
      triggerHint();
      return;
    }

    addLog(input, 'input');
    setIsLoading(true);

    const currentProblem = PROBLEMS[state.currentProblemIndex];
    const isCorrect = currentProblem.correctAnswers.some(ans => 
      input.toLowerCase().includes(ans.toLowerCase())
    );

    if (isCorrect) {
      addLog(currentProblem.congratulation, 'success');
      
      const nextIndex = state.currentProblemIndex + 1;
      if (nextIndex < PROBLEMS.length) {
        const nextProblem = PROBLEMS[nextIndex];
        const nextStory = await getNarrative(nextProblem.roomName, nextProblem.questDescription);
        
        setState(prev => ({
          ...prev,
          currentProblemIndex: nextIndex,
          score: prev.score + 10,
          log: [
            ...prev.log,
            { type: 'narrative', text: nextStory },
            { type: 'system', text: nextProblem.mathQuestion }
          ]
        }));
      } else {
        addLog("GRATTIS! Du har knäckt alla paradoxer och återställt verkligheten. W!", 'success');
        addLog(`Din slutpoäng: ${state.score + 10}`, 'system');
        setState(prev => ({ ...prev, currentProblemIndex: PROBLEMS.length, isGameOver: true }));
      }
    } else {
      addLog("SYSTEM ERROR: Felaktig kod inmatad. Här är den logiska förklaringen:", 'error');
      addLog(currentProblem.explanation, 'narrative');
      addLog("Försök igen när du har förstått logiken.", 'system');
    }

    setIsLoading(false);
  };

  const progressPercentage = (state.currentProblemIndex / PROBLEMS.length) * 100;

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col">
        <header className="mb-4 flex flex-col gap-3 border-b border-green-900 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-green-400">PROCENT-PARADOXEN</h1>
              <p className="text-xs text-green-700">USER_ACCESS: GRANTED | SESSION_ID: 88219</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-yellow-500">POÄNG: {state.score}</p>
              <p className="text-xs text-green-800 uppercase">Room: {PROBLEMS[state.currentProblemIndex]?.roomName || 'OUTRO'}</p>
            </div>
          </div>
          
          <div className="w-full space-y-1">
            <div className="flex justify-between text-[10px] text-green-700 uppercase tracking-widest font-bold">
              <span>Simuleringsstatus</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-2 w-full bg-green-950 border border-green-900 rounded-full overflow-hidden p-[1px]">
              <div 
                className="h-full bg-gradient-to-r from-green-800 to-green-400 shadow-[0_0_10px_rgba(0,255,65,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </header>

        <Terminal 
          logs={state.log} 
          onInput={handleInput} 
          onHintRequest={triggerHint}
          disabled={state.isGameOver || isLoading}
        />

        <footer className="mt-4 text-[10px] text-green-900 flex justify-between uppercase tracking-widest">
          <span>Skriv 'hjälp' eller använd knappen</span>
          <span>&copy; 2024 MathQuest OS</span>
          <span className={isLoading ? "animate-pulse" : ""}>
            {isLoading ? "Processar..." : "System redo"}
          </span>
        </footer>
      </div>
    </div>
  );
};

export default App;
