import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LineraService, LineraBoard } from "../services/LineraService";

const QUERY_KEYS = {
  wallet: ["linera", "wallet"],
  puzzle: (id: string) => ["linera", "puzzle", id],
  validation: (puzzleId: string, board: LineraBoard, steps: number) => [
    "linera",
    "validation",
    puzzleId,
    board,
    steps,
  ],
  initialized: ["linera", "initialized"],
};

const initializeService = async () => {
    const service = LineraService.getInstance();
    await new Promise(f => setTimeout(f, 100));
    await service.initialize();
    return true;
};

export function useLineraInitialization() {
  return useQuery({
    queryKey: QUERY_KEYS.initialized,
    queryFn: initializeService,
    staleTime: Infinity,
    retry: 3,
  });
}

export function useWallet() {
  return useQuery({
    queryKey: QUERY_KEYS.wallet,
    queryFn: async () => {
      const service = LineraService.getInstance();
      return service.checkWallet();
    },
    staleTime: Infinity,
  });
}

export function usePuzzle(puzzleId: string) {
  const { data: isInitialized } = useLineraInitialization();

  return useQuery({
    queryKey: QUERY_KEYS.puzzle(puzzleId),
    queryFn: async () => {
      const service = LineraService.getInstance();
      return service.getPuzzle(puzzleId);
    },
    enabled: !!isInitialized && !!puzzleId,
  });
}

export function useValidateSolution(
  board: LineraBoard,
  puzzleId: string,
  steps: number,
  enabled: boolean = true
) {
  const { data: isInitialized } = useLineraInitialization();

  return useQuery({
    queryKey: QUERY_KEYS.validation(puzzleId, board, steps),
    queryFn: async () => {
      const service = LineraService.getInstance();
      return service.validateSolution(board, puzzleId, steps);
    },
    enabled: !!isInitialized && !!puzzleId && enabled,
  });
}

export function useAdvanceBoard() {
  const { data: isInitialized } = useLineraInitialization();

  return useMutation({
    mutationFn: async ({
      board,
      steps = 1,
    }: {
      board: LineraBoard;
      steps?: number;
    }) => {
      if (!isInitialized) throw new Error("Linera not initialized");

      const service = LineraService.getInstance();
      return service.advanceBoard(board, steps);
    },
  });
}

export function useSubmitSolution() {
  const { data: isInitialized } = useLineraInitialization();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      puzzleId,
      board,
      steps,
    }: {
      puzzleId: string;
      board: LineraBoard;
      steps: number;
    }) => {
      if (!isInitialized) throw new Error("Linera not initialized");

      const service = LineraService.getInstance();
      return service.submitSolution(puzzleId, board, steps);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.validation(
          variables.puzzleId,
          variables.board,
          variables.steps
        ),
      });
    },
  });
}

export function useLineraOperations() {
  const initialization = useLineraInitialization();
  const wallet = useWallet();
  const advanceBoard = useAdvanceBoard();
  const submitSolution = useSubmitSolution();

  return {
    isInitialized: initialization.isSuccess,
    isInitializing: initialization.isLoading,
    initError: initialization.error,
    wallet: wallet.data,

    advanceBoard: advanceBoard.mutate,
    submitSolution: submitSolution.mutate,

    isAdvancing: advanceBoard.isPending,
    isSubmitting: submitSolution.isPending,

    advancedBoard: advanceBoard.data,
    submissionResult: submitSolution.data,
  };
}
