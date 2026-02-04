
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
      case 'narrative': return 'text-blue-300 italic';
      case 'system': return 'text-yellow-500 font-bold';
      case 'error': return 'text-red-500 animate-pulse';
      case 'success': return 'text-green-400 font-bold';
      case 'choice': return 'text-cyan-400 font-bold border-l-2 border-cyan-800 pl-2 my-1';
      case 'input': return 'text-white opacity-75';
      default: return 'text-green-500';
    }
  };

  const hintButtonText = hintLevel >= 3 
    ? "[ LEDTRÅDAR SLUT ]" 
    : `[ HÄMTA LEDTRÅD ${hintLevel + 1}/3 ]`;

  return (
    <div className="flex flex-col h-full bg-black border-2 border-green-900 p-4 shadow-[0_0_20px_rgba(0,255,65,0.2)] rounded-lg overflow-hidden relative">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2">
        {logs.map((entry, i) => (
          <div key={i} className={`${getEntryClass(entry.type)} break-words leading-relaxed`}>
            {entry.type === 'input' && <span className="mr-2 text-green-500 font-bold">{'>'}</span>}
            {entry.text.split('\n').map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 border-t border-green-900 pt-3">
        <form onSubmit={handleSubmit} className="flex items-center flex-1">
          <span className="text-green-500 font-bold mr-2">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={disabled}
            autoFocus
            className="bg-transparent border-none outline-none flex-1 text-white caret-green-500 font-medium placeholder-green-900"
            placeholder={disabled ? "Väntar på systemet..." : "Skriv här..."}
          />
        </form>
        <button 
          onClick={onHintRequest}
          disabled={disabled || hintLevel >= 3}
          className={`px-4 py-1 text-xs border transition-colors uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap ${
            hintLevel >= 3 
              ? 'border-gray-800 text-gray-800' 
              : 'border-yellow-700 text-yellow-500 hover:bg-yellow-900/20'
          }`}
        >
          {hintButtonText}
        </button>
      </div>
      
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </div>
  );
};

export default Terminal;
