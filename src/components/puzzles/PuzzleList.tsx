import { Card, CardHeader, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Badge } from '@heroui/badge';
import { KNOWN_PUZZLES, PuzzleMetadata } from '@/lib/game-of-life/data/puzzles';

interface PuzzleListProps {
  onSelectPuzzle: (puzzleId: string) => void;
  currentPuzzleId?: string;
}

const difficultyColors = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'danger'
} as const;

export function PuzzleList({ onSelectPuzzle, currentPuzzleId }: PuzzleListProps) {
  const groupedPuzzles = KNOWN_PUZZLES.reduce((acc, puzzle) => {
    if (!acc[puzzle.difficulty]) {
      acc[puzzle.difficulty] = [];
    }
    acc[puzzle.difficulty].push(puzzle);
    return acc;
  }, {} as Record<string, PuzzleMetadata[]>);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Available Puzzles</h2>
      
      {Object.entries(groupedPuzzles).map(([difficulty, puzzles]) => (
        <div key={difficulty} className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Badge color={difficultyColors[difficulty as keyof typeof difficultyColors]} variant="flat">
              {difficulty}
            </Badge>
            Difficulty
          </h3>
          
          <div className="grid gap-2">
            {puzzles.map((puzzle) => (
              <Card 
                key={puzzle.id}
                className={`${currentPuzzleId === puzzle.id ? 'border-primary' : ''}`}
                isPressable
                onPress={() => onSelectPuzzle(puzzle.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex-1">
                      <h4 className="font-semibold">{puzzle.title}</h4>
                      <p className="text-sm text-gray-600">{puzzle.category}</p>
                    </div>
                    {currentPuzzleId === puzzle.id && (
                      <Badge color="primary" variant="flat" size="sm">
                        Current
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-sm">{puzzle.summary}</p>
                  <Button
                    size="sm"
                    color="primary"
                    variant={currentPuzzleId === puzzle.id ? "bordered" : "solid"}
                    className="mt-2"
                    onPress={() => onSelectPuzzle(puzzle.id)}
                  >
                    {currentPuzzleId === puzzle.id ? 'Selected' : 'Select Puzzle'}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      {KNOWN_PUZZLES.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">No puzzles available yet.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}