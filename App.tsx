
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
      { type: 'system', text: '--- SYSTEM INITIALIZED: PROCENT-PARADOXEN v5.1 ---' },
      { type: 'system', text: 'DEPLOYMENT_STATUS: SUCCESS | ENV: SECURE_CORE' },
      { type: 'system', text: 'Hacking-protokoll redo. Kraft-stabilisatorer online.' },
      { type: 'system', text: '--------------------------------------------------' }
    ],
    isGameOver: false,
    score: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isScorePulsing, setIsScorePulsing] = useState(false);
  const [scoreChange, setScoreChange] = useState<number | null>(null);
  const prevScore = useRef(state.score);

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
        {/* MODERNIERAD HUD HEADER */}
        <header className="mb-6 border-2 border-green-900 bg-black/90 p-5 rounded-sm shadow-[0_0_30px_rgba(0,100,0,0.4)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-8 relative z-10">
            
            {/* PROGRESS SECTION */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  <h1 className="text-2xl font-black tracking-[0.1em] text-green-400 uppercase italic">Infiltration_OS</h1>
                </div>
                <div className="text-[10px] text-green-600 font-bold uppercase tracking-[0.3em] bg-green-950/40 px-2 py-1 rounded">
                  Sektor: <span className="text-white">{PROBLEMS[state.currentProblemIndex]?.roomName || 'CENTRAL CORE'}</span>
                </div>
              </div>

              <div className="relative h-10 w-full bg-black border-2 border-green-900/50 rounded-sm p-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-950 via-green-500 to-green-200 shadow-[0_0_20px_rgba(0,255,0,0.5)] transition-all duration-1000 ease-in-out relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {/* Scanline effect on bar */}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-20 animate-[move_2s_infinite]"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-black text-white mix-blend-difference tracking-[0.4em] uppercase">
                    SYSTEM_BREACH: {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            </div>

            {/* KRAFT SECTION - Centraliserad och tydlig */}
            <div className="relative flex flex-col items-center justify-center min-w-[160px] bg-green-950/30 border-2 border-green-800 rounded-sm p-3 group transition-all duration-300 hover:border-green-400">
              <span className="text-[10px] text-green-500 font-black uppercase tracking-[0.25em] mb-1">Logisk_Kraft</span>
              <div className="relative">
                <span className={`text-5xl font-black tracking-tighter transition-all duration-300 ${isScorePulsing ? 'text-white scale-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-yellow-500'}`}>
                  {state.score}
                </span>
                
                {/* FLOATING CHANGE INDICATOR */}
                {scoreChange !== null && (
                  <div className={`absolute -top-8 -right-6 font-black text-2xl animate-[bounce_1s_infinite] drop-shadow-md ${scoreChange > 0 ? 'text-green-400' : 'text-red-500'}`}>
                    {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
                  </div>
                )}
              </div>
              <div className="w-full h-1.5 bg-green-900 mt-2 rounded-full overflow-hidden border border-green-800/50">
                <div className="h-full bg-yellow-600 w-full animate-pulse opacity-60"></div>
              </div>
            </div>
          </div>
          
          {/* Visual Grid Decoration */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#00ff41_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </header>

        <Terminal 
          logs={state.log} 
          onInput={handleInput} 
          onHintRequest={triggerHint}
          disabled={state.isGameOver || isLoading}
          hintLevel={state.currentHintLevel}
        />

        <footer className="mt-4 px-3 text-[10px] text-green-900 flex justify-between uppercase tracking-[0.25em] font-black">
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${state.isChoiceMode ? 'bg-purple-600 animate-pulse' : 'bg-green-900'}`}></div>
              {state.isChoiceMode ? "STÄLLNINGSTAGANDE_KRÄVS" : "HACKER_INPUT_VÄNTAR"}
            </span>
            <span className="opacity-30 hidden lg:inline">SEC_LEVEL: ALPHA-9</span>
          </div>
          <div className="flex items-center gap-6">
            <span className={isLoading ? "text-green-400 animate-pulse" : "text-green-800"}>
              {isLoading ? "ÖVERFÖR_DATAPAKET..." : "LÄNK_STABIL"}
            </span>
            <span className="opacity-20">PROCENT-PARADOXEN_SYS_V5.1</span>
          </div>
        </footer>
      </div>
      
      <style>{`
        @keyframes move {
          from { transform: translateX(-100%); }
          to { transform: translateX(500%); }
        }
      `}</style>
    </div>
  );
};

export default App;
