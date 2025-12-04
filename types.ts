export interface Question {
  question: string;
  options: string[]; // Always 4 options
  correctAnswerIndex: number; // 0-3
  difficulty: number; // 1-15 scale, purely for tracking
}

export interface GameState {
  currentQuestionIndex: number;
  questions: Question[];
  status: 'IDLE' | 'LOADING' | 'PLAYING' | 'VICTORY' | 'GAME_OVER';
  winnings: number;
  lifelines: {
    fiftyFifty: boolean;
    phoneAFriend: boolean;
    askTheAudience: boolean;
  };
  audienceData: number[] | null; // Percentages for A, B, C, D
  friendMessage: string | null;
  selectedAnswer: number | null;
  isAnswerConfirmed: boolean;
  isAnswerCorrect: boolean | null; // null = pending check, true = correct, false = wrong
}

// 6 steps, ending in 1 Million Euro
export const MONEY_LADDER = [
  500,      // Q1
  2000,     // Q2
  8000,     // Q3 (Safe Haven 1)
  32000,    // Q4
  125000,   // Q5
  1000000   // Q6 (Top Prize)
].reverse(); // Stored highest to lowest for display

// Indices in the non-reversed array (0-based)
// Index 2 is the 3rd question (8000 Euro) - Safe Haven
// Index 5 is the 6th question (1 Million)
export const GUARANTEED_LEVELS = [2, 5];