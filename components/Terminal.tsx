
import React, { useEffect, useRef } from 'react';
import { GameLogEntry } from '../types';

interface TerminalProps {
  logs: GameLogEntry[];
  onInput: (value: string) => void;
  onHintRequest: () => void;
  disabled?: boolean;
  hintLevel?: number;
}

const Terminal: React.FC<TerminalProps> = ({ logs, onInput, onHintRequest, disabled, hintLevel = 0 }) => {
  const [inputValue, setInputValue] = React.useState('');
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [logs, disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onInput(inputValue.trim());
      setInputValue('');
    }
  };

  const getEntryClass = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'narrative': return 'text-cyan-100 italic opacity-90 border-l border-cyan-900/50 pl-4 py-1 my-2';
      case 'system': return 'text-yellow-400 font-bold bg-yellow-950/20 px-2 py-1 rounded-sm inline-block w-full';
      case 'error': return 'text-red-500 font-black animate-pulse bg-red-950/10 px-2 uppercase tracking-wider';
      case 'success': return 'text-green-400 font-black bg-green-950/30 px-2 py-1 border-y border-green-900/50 block';
      case 'choice': return 'text-purple-400 font-bold border-l-4 border-purple-900 pl-3 my-2 bg-purple-950/10 py-1';
      case 'input': return 'text-white font-mono opacity-100 bg-white/5 px-2';
      default: return 'text-green-500';
    }
  };

  const hintButtonText = hintLevel >= 3 
    ? "[ LEDTRÅDAR_SLUT ]" 
    : `[ HÄMTA_LEDTRÅD ${hintLevel + 1}/3 ]`;

  return (
    <div className="flex flex-col h-full bg-[#020202] border-2 border-green-900/50 p-6 shadow-[inset_0_0_50px_rgba(0,50,0,0.2)] rounded-sm overflow-hidden relative">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-4 custom-scrollbar">
        {logs.map((entry, i) => (
          <div key={i} className={`${getEntryClass(entry.type)} break-words leading-relaxed text-sm md:text-base transition-all duration-300`}>
            {entry.type === 'input' && <span className="mr-3 text-green-500 font-black tracking-widest">{'>_'}</span>}
            {entry.text.split('\n').map((line, j) => (
              <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
            ))}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 border-t border-green-900/40 pt-5">
        <form onSubmit={handleSubmit} className="flex items-center flex-1 bg-green-950/10 px-3 py-1 border border-green-900/30 rounded">
          <span className="text-green-500 font-black mr-3">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={disabled}
            autoFocus
            className="bg-transparent border-none outline-none flex-1 text-green-100 caret-green-400 font-bold placeholder-green-900/50"
            placeholder={disabled ? "PROCESSAR..." : "SYSTEM_INPUT_VÄNTAR..."}
          />
        </form>
        <button 
          onClick={onHintRequest}
          disabled={disabled || hintLevel >= 3}
          className={`px-6 py-2 text-[10px] border transition-all duration-300 uppercase font-black tracking-widest rounded shadow-sm ${
            hintLevel >= 3 
              ? 'border-gray-800 text-gray-800' 
              : 'border-yellow-700 text-yellow-500 hover:bg-yellow-500 hover:text-black active:scale-95'
          }`}
        >
          {hintButtonText}
        </button>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
    </div>
  );
};

export default Terminal;
