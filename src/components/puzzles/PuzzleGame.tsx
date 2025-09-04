import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { usePuzzleGame } from "@/lib/game-of-life/hooks/usePuzzleGame";
import { PuzzleList } from "./PuzzleList";
import { PuzzleInfo } from "./PuzzleInfo";
import { PUZZLE_BOARD_SIZE } from "@/lib/game-of-life/data/puzzles";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Home,
} from "lucide-react";
import { GameBoardWrapper } from "@/components/game-of-life/GameBoardWrapper";

export function PuzzleGame() {
  const navigate = useNavigate();
  const game = usePuzzleGame();

  const handleCellClick = (x: number, y: number) => {
    game.toggleCell(x, y);
  };

  const handleSelectPuzzle = (puzzleId: string) => {
    game.loadPuzzle(puzzleId);
  };

  return (
    <div className="min-h-screen bg-linera-background">
      <div className="max-w-[1920px] mx-auto p-8">
        <div className="mb-6">
          <Button
            color="primary"
            variant="flat"
            size="sm"
            startContent={<Home size={18} />}
            onPress={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {game.showPuzzleList ? (
              <PuzzleList
                onSelectPuzzle={handleSelectPuzzle}
                currentPuzzleId={game.currentPuzzleId || undefined}
              />
            ) : (
              <>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => game.setShowPuzzleList(true)}
                  className="w-full"
                >
                  ← Back to Puzzle List
                </Button>

                <PuzzleInfo
                  puzzle={game.currentPuzzle}
                  stepCount={game.stepCount}
                  validationResult={game.validationResult}
                  isValidating={game.isValidating}
                  isSubmitting={game.isSubmitting}
                  onValidate={game.validateSolution}
                  onSubmit={game.submitSolution}
                  onClear={game.clear}
                />
              </>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-linera-background-light border border-linera-background-lighter">
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        color="primary"
                        variant="flat"
                        onPress={game.isPlaying ? game.pause : game.play}
                      >
                        {game.isPlaying ? (
                          <Pause size={20} />
                        ) : (
                          <Play size={20} />
                        )}
                      </Button>

                      <Button
                        isIconOnly
                        color="primary"
                        variant="flat"
                        onPress={game.previous}
                        isDisabled={!game.canUndo}
                      >
                        <SkipBack size={20} />
                      </Button>

                      <Button
                        isIconOnly
                        color="primary"
                        variant="flat"
                        onPress={game.next}
                      >
                        <SkipForward size={20} />
                      </Button>

                      <Button
                        isIconOnly
                        color="danger"
                        variant="flat"
                        onPress={game.clear}
                      >
                        <RotateCcw size={20} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-linera-text">
                        Generation: {game.generation}
                      </span>
                      <span className="text-sm font-semibold text-linera-text">
                        Steps: {game.stepCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="overflow-auto max-w-full max-h-[60vh] rounded-lg border border-linera-background-lighter">
                      <GameBoardWrapper
                        width={PUZZLE_BOARD_SIZE}
                        height={PUZZLE_BOARD_SIZE}
                        cells={game.cells}
                        onCellClick={handleCellClick}
                        cellSize={Math.max(
                          10,
                          Math.min(25, 600 / PUZZLE_BOARD_SIZE)
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-linera-text">Speed:</span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={game.speed}
                      onChange={(e) => game.setSpeed(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm w-10 text-linera-text">
                      {game.speed}
                    </span>
                  </div>

                  {/* Pattern Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => game.generateRandom(0.3)}
                    >
                      Random Pattern
                    </Button>
                    {Object.entries(game.patterns).map(([name, pattern]) => (
                      <Button
                        key={name}
                        size="sm"
                        variant="flat"
                        onPress={() =>
                          game.loadPattern(
                            pattern,
                            Math.floor(
                              PUZZLE_BOARD_SIZE / 2 - pattern[0].length / 2
                            ),
                            Math.floor(
                              PUZZLE_BOARD_SIZE / 2 - pattern.length / 2
                            )
                          )
                        }
                      >
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
