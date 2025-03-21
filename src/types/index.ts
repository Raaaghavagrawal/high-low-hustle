export interface ComparisonItem {
  id: string;
  title: string;
  description: string;
  searchVolume: number;
  imageUrl: string;
  category: string;
  photographer: string;
}

export interface GameState {
  currentScore: number;
  highScore: number;
  currentItem: ComparisonItem;
  nextItem: ComparisonItem;
  gameOver: boolean;
}

export type GameAction = 'HIGHER' | 'LOWER'; 