
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameLogEntry, NarrativeChoice } from './types';
import { PROBLEMS } from './problems';
import Terminal from './components/Terminal';
import { getNarrative, getHint } from './geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    currentProblemIndex: 0,
    currentChoiceIndex: 0,
    currentHintLevel: 0,
    isChoiceMode: false,
    log: [
      { type: 'system', text: '--- SYSTEM INITIALIZED: PROCENT-PARADOXEN v4.0 ---' },
      { type: 'system', text: 'LOGIC-RUNNER DETECTED. Status: Infiltrating the Neural Core.' },
      { type: 'system', text: 'Ledtråds-motor aktiverad: Tre nivåer av assistans tillgängliga.' },
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
  }, []);

  const triggerHint = async () => {
    if (state.isGameOver || isLoading || state.isChoiceMode) return;
    
    const nextLevel = state.currentHintLevel + 1;
    if (nextLevel > 3) {
      addLog("MAXIMALT ANTAL LEDTRÅDAR NÅDDA FÖR DENNA SEKTOR.", 'error');
      return;
    }

    setIsLoading(true);
    const cost = nextLevel === 1 ? 2 : nextLevel === 2 ? 5 : 10;
    addLog(`[ HÄMTAR HACKER-DATA NIVÅ ${nextLevel}/3... KOSTNAD: ${cost} KRAFT ]`, 'input');
    
    const currentProblem = PROBLEMS[state.currentProblemIndex];
    const hint = await getHint(currentProblem.mathQuestion, nextLevel);
    
    setState(prev => ({
      ...prev,
      currentHintLevel: nextLevel,
      score: Math.max(0, prev.score - cost),
      log: [
        ...prev.log,
        { type: 'system', text: `LEDTRÅD ${nextLevel}: ${hint}` }
      ]
    }));
    setIsLoading(false);
  };

  const startTransitions = useCallback(async () => {
    const currentProblem = PROBLEMS[state.currentProblemIndex];
    if (currentProblem.transitions && currentProblem.transitions.length > 0) {
      setState(prev => ({ ...prev, isChoiceMode: true, currentChoiceIndex: 0 }));
      presentChoice(currentProblem.transitions[0]);
    } else {
      moveToNextProblem();
    }
  }, [state.currentProblemIndex]);

  const presentChoice = (choice: NarrativeChoice) => {
    addLog("--- NARRATIVT VAL ---", 'choice');
    addLog(choice.question, 'narrative');
    addLog(`[A] ${choice.options.A.text}`, 'choice');
    addLog(`[B] ${choice.options.B.text}`, 'choice');
  };

  const handleChoiceInput = (input: string) => {
    const choiceKey = input.toUpperCase();
    if (choiceKey !== 'A' && choiceKey !== 'B') {
      addLog("FELAKTIG INMATNING. Vänligen välj [A] eller [B].", 'error');
      return;
    }

    const currentProblem = PROBLEMS[state.currentProblemIndex];
    const choices = currentProblem.transitions!;
    const choice = choices[state.currentChoiceIndex];
    const selectedOption = choice.options[choiceKey as 'A' | 'B'];

    addLog(`VALT: ${selectedOption.text}`, 'input');
    addLog(selectedOption.result, 'success');

    const nextChoiceIndex = state.currentChoiceIndex + 1;
    if (nextChoiceIndex < choices.length) {
      setState(prev => ({ 
        ...prev, 
        currentChoiceIndex: nextChoiceIndex,
        score: prev.score + selectedOption.scoreBonus
      }));
      presentChoice(choices[nextChoiceIndex]);
    } else {
      setState(prev => ({ ...prev, score: prev.score + selectedOption.scoreBonus }));
      moveToNextProblem();
    }
  };

  const moveToNextProblem = async () => {
    setIsLoading(true);
    const nextIndex = state.currentProblemIndex + 1;
    if (nextIndex < PROBLEMS.length) {
      const nextProblem = PROBLEMS[nextIndex];
      const nextStory = await getNarrative(nextProblem.roomName, nextProblem.questDescription);
      
      setState(prev => ({
        ...prev,
        currentProblemIndex: nextIndex,
        currentChoiceIndex: 0,
        currentHintLevel: 0, // Återställ ledtrådar för nytt problem
        isChoiceMode: false,
        score: prev.score + 10,
        log: [
          ...prev.log,
          { type: 'narrative', text: nextStory },
          { type: 'system', text: nextProblem.mathQuestion }
        ]
      }));
    } else {
      addLog("SYSTEM ÅTERSTÄLLT! Du har nått hjärtat av simuleringen. W!", 'success');
      addLog(`Din slutpoäng: ${state.score + 10} | Rank: ELITE LOGIC-RUNNER`, 'system');
      setState(prev => ({ ...prev, currentProblemIndex: PROBLEMS.length, isGameOver: true }));
    }
    setIsLoading(false);
  };

  const handleInput = async (input: string) => {
    if (state.isGameOver || isLoading) return;

    if (state.isChoiceMode) {
      handleChoiceInput(input);
      return;
    }

    if (input.toLowerCase() === 'hjälp' || input.toLowerCase() === 'hint' || input.toLowerCase() === 'ledtråd') {
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
      await startTransitions();
    } else {
      addLog("DETEKTERADE EN LOGISK GLITCH: Felaktig kod. Dekrypteringshjälp aktiverad:", 'error');
      addLog(currentProblem.explanation, 'narrative');
      addLog("Försök igen, Runner. Systemet räknar med dig.", 'system');
    }

    setIsLoading(false);
  };

  const totalSteps = PROBLEMS.reduce((acc, p) => acc + 1 + (p.transitions?.length || 0), 0);
  const currentStep = PROBLEMS.slice(0, state.currentProblemIndex).reduce((acc, p) => acc + 1 + (p.transitions?.length || 0), 0) + 
                     (state.isChoiceMode ? 1 + state.currentChoiceIndex : 0);
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl h-[85vh] flex flex-col">
        <header className="mb-4 flex flex-col gap-3 border-b border-green-900 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-green-400">PROCENT-PARADOXEN</h1>
              <p className="text-xs text-green-700 uppercase tracking-tighter">USER_ACCESS: GRANTED | STATUS: INFILTRATING</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-yellow-500 uppercase">KRAFT: {state.score}</p>
              <p className="text-xs text-green-800 uppercase font-bold tracking-widest">Sector: {PROBLEMS[state.currentProblemIndex]?.roomName || 'CORE'}</p>
            </div>
          </div>
          
          <div className="w-full space-y-1">
            <div className="flex justify-between text-[10px] text-green-700 uppercase tracking-widest font-bold">
              <span>Hacking-progress</span>
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
          hintLevel={state.currentHintLevel}
        />

        <footer className="mt-4 text-[10px] text-green-900 flex justify-between uppercase tracking-widest font-bold">
          <span>{state.isChoiceMode ? "Välj [A] eller [B]" : "Kommando: hämta ledtråd / hjælp"}</span>
          <span>&copy; 2024 Logic-Runner Terminal</span>
          <span className={isLoading ? "animate-pulse text-green-400" : ""}>
            {isLoading ? "Processar..." : "System redo"}
          </span>
        </footer>
      </div>
    </div>
  );
};

export default App;
