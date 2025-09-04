import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LineraService, LineraBoard } from '@/lib/linera/services/LineraService';
import { PUZZLE_BOARD_SIZE } from '../data/puzzles';
import { useGameOfLife } from './useGameOfLife';
import { useLineraInitialization } from '@/lib/linera/hooks/useLineraQueries';

export interface PuzzleInfo {
  id: string;
  title: string;
  summary: string;
  difficulty: "Easy" | "Medium" | "Hard";
  size: number;
  minimalSteps: number;
  maximalSteps: number;
}

const QUERY_KEYS = {
  puzzle: (id: string) => ['puzzle', id],
  validation: (puzzleId: string, board: LineraBoard) => ['validation', puzzleId, board],
};

export function usePuzzleGame() {
  const [currentPuzzleId, setCurrentPuzzleId] = useState<string | null>(null);
  const [stepCount, setStepCount] = useState(0);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message?: string } | null>(null);
  const [showPuzzleList, setShowPuzzleList] = useState(true);
  
  const queryClient = useQueryClient();
  const { data: isInitialized } = useLineraInitialization();
  const lineraService = LineraService.getInstance();
  
  // Use fixed size game board
  const game = useGameOfLife({
    width: PUZZLE_BOARD_SIZE,
    height: PUZZLE_BOARD_SIZE,
    infinite: false,
    initialSpeed: 5
  });

  // Query for current puzzle
  const { data: currentPuzzle, isLoading: isPuzzleLoading } = useQuery({
    queryKey: QUERY_KEYS.puzzle(currentPuzzleId || ''),
    queryFn: async () => {
      if (!currentPuzzleId) return null;
      return lineraService.getPuzzle(currentPuzzleId);
    },
    enabled: !!isInitialized && !!currentPuzzleId,
  });

  // Mutation to load and select a puzzle
  const loadPuzzleMutation = useMutation({
    mutationFn: async (puzzleId: string) => {
      // Load puzzle data from chain
      const puzzle = await lineraService.getPuzzle(puzzleId);
      console.log("[GOL] Loaded puzzle from chain", puzzle);
      if (!puzzle) {
        throw new Error('Puzzle not found');
      }
      return { puzzleId, puzzle };
    },
    onSuccess: ({ puzzleId }) => {
      // Update local state
      setCurrentPuzzleId(puzzleId);
      setStepCount(0);
      setValidationResult(null);
      setShowPuzzleList(false);
      game.clear();
      
      // Invalidate query to refresh puzzle data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puzzle(puzzleId) });
    },
    onError: (error) => {
      console.error('Failed to load puzzle:', error);
    }
  });

  // Load puzzle function
  const loadPuzzle = useCallback((puzzleId: string) => {
    loadPuzzleMutation.mutate(puzzleId);
  }, [loadPuzzleMutation]);

  // Convert game cells to Linera board format
  const getCellsAsLineraBoard = useCallback(() => {
    const liveCells: Array<{ x: number; y: number }> = [];
    
    game.cells.forEach((alive, key) => {
      if (alive) {
        const [x, y] = key.split(',').map(Number);
        liveCells.push({ x, y });
      }
    });
    
    return {
      size: PUZZLE_BOARD_SIZE,
      liveCells
    };
  }, [game.cells]);

  // Load board state from Linera format
  const loadLineraBoard = useCallback((board: { size: number; liveCells: Array<{ x: number; y: number }> }) => {
    game.clear();
    board.liveCells.forEach(({ x, y }) => {
      game.toggleCell(x, y);
    });
  }, [game]);

  // Mutation for advancing board on chain
  const advanceBoardMutation = useMutation({
    mutationFn: async (steps: number = 1) => {
      const currentBoard = getCellsAsLineraBoard();
      return lineraService.advanceBoard(currentBoard, steps);
    },
    onSuccess: (newBoard, steps = 1) => {
      loadLineraBoard(newBoard);
      setStepCount(prev => prev + steps);
    },
    onError: (error) => {
      console.error('Failed to advance board:', error);
    },
  });

  const advanceBoardOnChain = useCallback((steps: number = 1) => {
    return advanceBoardMutation.mutate(steps);
  }, [advanceBoardMutation]);

  // Mutation for validating solution
  const validateMutation = useMutation({
    mutationFn: async () => {
      if (!currentPuzzle) {
        throw new Error('No puzzle selected');
      }
      const board = getCellsAsLineraBoard();
      return lineraService.validateSolution(board, currentPuzzle.id);
    },
    onSuccess: (result) => {
      setValidationResult({
        isValid: result.isValid,
        message: result.errorMessage || (result.isValid ? 'Solution is valid!' : 'Solution is not valid')
      });
    },
    onError: (error) => {
      console.error('Failed to validate solution:', error);
      setValidationResult({ 
        isValid: false, 
        message: error instanceof Error ? error.message : 'Failed to validate solution' 
      });
    },
  });

  const validateSolution = useCallback(() => {
    return validateMutation.mutate();
  }, [validateMutation]);

  // Mutation for submitting solution
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!currentPuzzle) {
        throw new Error('No puzzle selected');
      }
      
      // First validate
      const board = getCellsAsLineraBoard();
      const validationResult = await lineraService.validateSolution(board, currentPuzzle.id);
      
      if (!validationResult.isValid) {
        throw new Error(validationResult.errorMessage || 'Solution is not valid');
      }
      
      // Then submit
      return lineraService.submitSolution(currentPuzzle.id, board);
    },
    onSuccess: () => {
      setValidationResult({
        isValid: true,
        message: 'Solution submitted successfully!'
      });
      // Invalidate puzzle query to potentially update solved status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.puzzle(currentPuzzleId || '') });
    },
    onError: (error) => {
      console.error('Failed to submit solution:', error);
      setValidationResult({
        isValid: false,
        message: error instanceof Error ? error.message : 'Failed to submit solution'
      });
    },
  });

  const submitSolution = useCallback(() => {
    return submitMutation.mutate();
  }, [submitMutation]);

  // Override the next function to track steps
  const originalNext = game.next;
  const next = useCallback(() => {
    originalNext();
    setStepCount(prev => prev + 1);
  }, [originalNext]);

  // Reset step count when clearing
  const originalClear = game.clear;
  const clear = useCallback(() => {
    originalClear();
    setStepCount(0);
    setValidationResult(null);
  }, [originalClear]);

  // Method to go back to puzzle list
  const backToPuzzleList = useCallback(() => {
    setShowPuzzleList(true);
    setCurrentPuzzleId(null);
    setStepCount(0);
    setValidationResult(null);
    game.clear();
  }, [game]);

  return {
    ...game,
    next,
    clear,
    currentPuzzle: currentPuzzle || null,
    currentPuzzleId,
    isPuzzleLoading: isPuzzleLoading || loadPuzzleMutation.isPending,
    stepCount,
    isValidating: validateMutation.isPending,
    validationResult,
    isSubmitting: submitMutation.isPending,
    loadPuzzle,
    validateSolution,
    submitSolution,
    advanceBoardOnChain,
    isAdvancingOnChain: advanceBoardMutation.isPending,
    getCellsAsLineraBoard,
    loadLineraBoard,
    showPuzzleList,
    setShowPuzzleList,
    backToPuzzleList
  };
}