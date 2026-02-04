
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
      { type: 'system', text: '--- SYSTEM INITIALIZED: PROCENT-PARADOXEN v5.0 ---' },
      { type: 'system', text: 'LOGIC-RUNNER DETECTED. Status: Infiltrating the Neural Core.' },
      { type: 'system', text: 'HUD-synkronisering: 100%. Kraft-monitor: Aktiv.' },
      { type: 'system', text: '--------------------------------------------------' }
    ],
    isGameOver: false,
    score: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isScorePulsing, setIsScorePulsing] = useState(false);
  const [scoreChange, setScoreChange] = useState<number | null>(null);
  const prevScore = useRef(state.score);

  // Hantera poängförändrings-animation
  useEffect(() => {
    const diff = state.score - prevScore.current;
    if (diff !== 0) {
      setScoreChange(diff);
      setIsScorePulsing(true);
      
      const timer = setTimeout(() => {
        setIsScorePulsing(false);
        setScoreChange(null);
      }, 1500);
      
      prevScore.current = state.score;
      return () => clearTimeout(timer);
    }
  }, [state.score]);

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
    addLog(`[ HÄMTAR HACKER-DATA NIVÅ ${nextLevel}/3... ]`, 'input');
    
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
        currentHintLevel: 0,
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
      addLog("LOGISK GLITCH DETEKTERAD. Påbörjar nöd-dekryptering...", 'error');
      addLog(currentProblem.explanation, 'narrative');
      addLog("Försök igen, Runner.", 'system');
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
        {/* HUD HEADER */}
        <header className="mb-6 border-2 border-green-900 bg-black/80 p-5 rounded-lg shadow-[0_0_25px_rgba(0,100,0,0.3)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 relative z-10">
            
            {/* PROGRESS SECTION */}
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <h1 className="text-xl font-black tracking-tighter text-green-400 uppercase italic">Infiltration_OS</h1>
                </div>
                <div className="text-[10px] text-green-600 font-bold uppercase tracking-[0.2em]">
                  Zone: <span className="text-white">{PROBLEMS[state.currentProblemIndex]?.roomName || 'CENTRAL CORE'}</span>
                </div>
              </div>

              <div className="relative h-8 w-full bg-black border border-green-900 rounded-sm p-1">
                <div 
                  className="h-full bg-gradient-to-r from-green-900 via-green-500 to-green-300 shadow-[0_0_15px_rgba(0,255,0,0.4)] transition-all duration-1000 ease-in-out relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-black text-white mix-blend-difference tracking-[0.3em] uppercase">
                    HACKING: {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            </div>

            {/* KRAFT SECTION WITH FLOATING INDICATORS */}
            <div className="relative flex flex-col items-center justify-center min-w-[140px] bg-green-950/20 border border-green-900 rounded p-2">
              <span className="text-[9px] text-green-700 font-bold uppercase tracking-[0.2em] mb-1">System_Kraft</span>
              <div className="relative">
                <span className={`text-4xl font-black tracking-tighter transition-all duration-300 ${isScorePulsing ? 'text-white scale-110' : 'text-yellow-500'}`}>
                  {state.score}
                </span>
                
                {/* FLOATING CHANGE INDICATOR */}
                {scoreChange !== null && (
                  <div className={`absolute -top-6 -right-4 font-black text-lg animate-bounce transition-opacity duration-1000 ${scoreChange > 0 ? 'text-green-400' : 'text-red-500'}`}>
                    {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
                  </div>
                )}
              </div>
              <div className="w-full h-1 bg-green-900 mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600 w-full animate-pulse opacity-50"></div>
              </div>
            </div>
          </div>
          
          {/* Visual decoration */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-green-500/20"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-green-500/20"></div>
        </header>

        <Terminal 
          logs={state.log} 
          onInput={handleInput} 
          onHintRequest={triggerHint}
          disabled={state.isGameOver || isLoading}
          hintLevel={state.currentHintLevel}
        />

        <footer className="mt-4 px-2 text-[10px] text-green-900 flex justify-between uppercase tracking-[0.2em] font-black">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 bg-green-900 rounded-full"></span>
              {state.isChoiceMode ? "STÄLLNINGSTAGANDE KRÄVS" : "DATA-INMATNING VÄNTAR"}
            </span>
            <span className="opacity-40 hidden md:inline">ENCRYPT: AES-256</span>
          </div>
          <div className="flex items-center gap-4">
            <span className={isLoading ? "text-green-400 animate-pulse" : ""}>
              {isLoading ? "ÖVERFÖR_PAKET..." : "LÄNK_STABIL"}
            </span>
            <span className="text-green-950">V5.0.42</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
