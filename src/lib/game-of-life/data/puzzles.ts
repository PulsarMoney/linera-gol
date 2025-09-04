// Known puzzle IDs from the blockchain
// These are DataBlobHash IDs of puzzles published to the chain

export interface PuzzleMetadata {
  id: string;
  title: string;
  summary: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}

export const KNOWN_PUZZLES: PuzzleMetadata[] = [
  {
    id: "c6f2b2e1a4bb32a6f2d1cbf29fd43f35fc51a20ca6eb4cafbc3bb20499f8a4ba",
    title: "Beehive Formation",
    summary: "Create a stable beehive pattern (6-cell hexagonal shape)",
    difficulty: "Easy",
    category: "Still Life"
  },
  // Additional puzzles can be added here as they are published to the chain
  // Format: DataBlobHash from linera publish-data-blob command
];

// Default board size for all puzzles
export const PUZZLE_BOARD_SIZE = 20;

// Helper to get puzzle by ID
export function getPuzzleMetadata(id: string): PuzzleMetadata | undefined {
  return KNOWN_PUZZLES.find(puzzle => puzzle.id === id);
}

// Helper to get puzzles by difficulty
export function getPuzzlesByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): PuzzleMetadata[] {
  return KNOWN_PUZZLES.filter(puzzle => puzzle.difficulty === difficulty);
}

// Helper to get puzzles by category
export function getPuzzlesByCategory(category: string): PuzzleMetadata[] {
  return KNOWN_PUZZLES.filter(puzzle => puzzle.category === category);
}