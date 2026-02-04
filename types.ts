
export interface Problem {
  id: number;
  questDescription: string;
  mathQuestion: string;
  correctAnswers: string[]; // Support multiple formats (e.g., "33.3", "33,3", "33.3%")
  explanation: string;
  roomName: string;
  congratulation: string;
}

export interface GameLogEntry {
  type: 'narrative' | 'system' | 'error' | 'success' | 'input';
  text: string;
}

export interface GameState {
  currentProblemIndex: number;
  log: GameLogEntry[];
  isGameOver: boolean;
  score: number;
}
