import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Badge } from '@heroui/badge';
import { Button } from '@heroui/button';
import { PuzzleInfo as PuzzleData } from '@/lib/game-of-life/hooks/usePuzzleGame';

interface PuzzleInfoProps {
  puzzle: PuzzleData | null;
  stepCount: number;
  validationResult: { isValid: boolean; message?: string } | null;
  isValidating: boolean;
  isSubmitting: boolean;
  onValidate: () => void;
  onSubmit: () => void;
  onClear: () => void;
}

const difficultyColors = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'danger'
} as const;

export function PuzzleInfo({
  puzzle,
  stepCount,
  validationResult,
  isValidating,
  isSubmitting,
  onValidate,
  onSubmit,
  onClear
}: PuzzleInfoProps) {
  if (!puzzle) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-gray-500">No puzzle selected. Choose one from the list.</p>
        </CardBody>
      </Card>
    );
  }

  const isWithinStepRange = stepCount >= puzzle.minimalSteps && stepCount <= puzzle.maximalSteps;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start w-full">
          <div>
            <h3 className="text-lg font-bold">{puzzle.title}</h3>
            <Badge 
              color={difficultyColors[puzzle.difficulty]} 
              variant="flat" 
              size="sm"
              className="mt-1"
            >
              {puzzle.difficulty}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Board Size</div>
            <div className="font-semibold">{puzzle.size}x{puzzle.size}</div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <p className="text-sm text-gray-700">{puzzle.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Current Steps</div>
            <div className="text-2xl font-bold">{stepCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Required Steps</div>
            <div className="text-lg">
              {puzzle.minimalSteps} - {puzzle.maximalSteps}
            </div>
          </div>
        </div>

        {!isWithinStepRange && stepCount > 0 && (
          <Badge color="warning" variant="flat" className="w-full text-center">
            Steps must be between {puzzle.minimalSteps} and {puzzle.maximalSteps}
          </Badge>
        )}

        {validationResult && (
          <div className={`p-3 rounded-lg ${
            validationResult.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-sm font-semibold">{validationResult.message}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            color="primary"
            variant="bordered"
            onPress={onValidate}
            isLoading={isValidating}
            isDisabled={!isWithinStepRange || isSubmitting}
            className="flex-1"
          >
            Validate Solution
          </Button>
          <Button
            color="success"
            onPress={onSubmit}
            isLoading={isSubmitting}
            isDisabled={!isWithinStepRange || isValidating}
            className="flex-1"
          >
            Submit Solution
          </Button>
        </div>

        <Button
          color="danger"
          variant="light"
          onPress={onClear}
          isDisabled={isValidating || isSubmitting}
          className="w-full"
        >
          Clear Board
        </Button>
      </CardBody>
    </Card>
  );
}