
export interface ChoiceOption {
  label: string;
  text: string;
  result: string;
  scoreBonus: number;
}

export interface NarrativeChoice {
  question: string;
  options: {
    A: ChoiceOption;
    B: ChoiceOption;
  };
}

export interface Problem {
  id: number;
  questDescription: string;
  mathQuestion: string;
  correctAnswers: string[];
  explanation: string;
  roomName: string;
  congratulation: string;
  transitions?: NarrativeChoice[];
}

export interface GameLogEntry {
  type: 'narrative' | 'system' | 'error' | 'success' | 'input' | 'choice';
  text: string;
}

export interface GameState {
  currentProblemIndex: number;
  currentChoiceIndex: number;
  currentHintLevel: number; // 0, 1, 2, eller 3
  isChoiceMode: boolean;
  log: GameLogEntry[];
  isGameOver: boolean;
  score: number;
}
