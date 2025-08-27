import { useState } from "react";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Send, CheckCircle, Cpu } from "lucide-react";
import {
  useLineraOperations,
  useValidateSolution,
  usePuzzle,
} from "@/lib/linera/hooks/useLineraQueries";
import { LineraService } from "@/lib/linera/services/LineraService";

interface BlockchainOperationsProps {
  boardSize: number;
  cells: Map<string, boolean>;
  generation: number;
}

export function BlockchainOperations({
  boardSize,
  cells,
  generation,
}: BlockchainOperationsProps) {
  const {
    isInitialized,
    advanceBoard,
    isAdvancing,
    advancedBoard: advancedBoardData,
    submitSolution,
    isSubmitting,
  } = useLineraOperations();

  const [puzzleId, setPuzzleId] = useState("");
  const [shouldValidate, setShouldValidate] = useState(false);

  const lineraBoard = LineraService.boardToLinera(cells, boardSize);

  const { data: puzzle } = usePuzzle(puzzleId);
  const { data: validationResult, refetch: revalidate } = useValidateSolution(
    lineraBoard,
    puzzleId,
    generation,
    shouldValidate && !!puzzleId
  );

  const handleAdvanceOnChain = () => {
    if (!isInitialized) return;
    advanceBoard({ board: lineraBoard, steps: 1 });
  };

  const handleValidate = () => {
    if (!isInitialized || !puzzleId) return;
    setShouldValidate(true);
    revalidate();
  };

  const handleSubmit = () => {
    if (!isInitialized || !puzzleId || !validationResult?.isValid) return;
    submitSolution({ puzzleId, board: lineraBoard, steps: generation });
  };

  return (
    <Tabs aria-label="Blockchain operations">
      <Tab
        key="compute"
        title={
          <div className="flex items-center space-x-2">
            <Cpu size={18} />
            <span>Compute</span>
          </div>
        }
      >
        <div className="space-y-4 pt-4">
          <p className="text-sm text-linera-text-muted">
            Compute the next generation on the blockchain
          </p>
          <Button
            color="primary"
            variant="flat"
            startContent={<Cpu size={18} />}
            onPress={handleAdvanceOnChain}
            isLoading={isAdvancing}
            isDisabled={!isInitialized}
            className="w-full"
          >
            Advance on Blockchain
          </Button>

          {advancedBoardData && (
            <div className="mt-4 p-3 bg-linera-background rounded-lg">
              <p className="text-sm text-linera-text-muted">
                Advanced board has {advancedBoardData.liveCells.length} live
                cells
              </p>
            </div>
          )}
        </div>
      </Tab>

      <Tab
        key="validate"
        title={
          <div className="flex items-center space-x-2">
            <CheckCircle size={18} />
            <span>Validate</span>
          </div>
        }
      >
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter puzzle ID"
              value={puzzleId}
              onChange={(e) => {
                setPuzzleId(e.target.value);
                setShouldValidate(false);
              }}
              className="w-full px-3 py-2 bg-linera-background rounded-lg border border-linera-background-lighter text-linera-text"
            />
            {puzzle && (
              <div className="text-xs text-linera-text-muted">
                {puzzle.title} - {puzzle.difficulty}
              </div>
            )}
          </div>

          <Button
            color="primary"
            variant="flat"
            startContent={<CheckCircle size={18} />}
            onPress={handleValidate}
            isLoading={false}
            isDisabled={!isInitialized || !puzzleId}
            className="w-full"
          >
            Validate Solution
          </Button>

          {validationResult && (
            <div
              className={`mt-4 p-3 rounded-lg ${validationResult.isValid ? "bg-success/20" : "bg-danger/20"}`}
            >
              <p className="text-sm">
                {validationResult.isValid
                  ? "✓ Valid solution!"
                  : "✗ Invalid solution"}
              </p>
              {validationResult.errorMessage && (
                <p className="text-xs mt-1 text-linera-text-muted">
                  {validationResult.errorMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </Tab>

      <Tab
        key="submit"
        title={
          <div className="flex items-center space-x-2">
            <Send size={18} />
            <span>Submit</span>
          </div>
        }
      >
        <div className="space-y-4 pt-4">
          <p className="text-sm text-linera-text-muted">
            Submit your solution to the blockchain
          </p>

          <Button
            color="primary"
            variant="solid"
            startContent={<Send size={18} />}
            onPress={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={
              !isInitialized || !puzzleId || !validationResult?.isValid
            }
            className="w-full"
          >
            Submit Solution
          </Button>
        </div>
      </Tab>
    </Tabs>
  );
}
