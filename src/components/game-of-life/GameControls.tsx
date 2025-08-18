"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Zap,
  Shuffle,
} from "lucide-react";

interface GameControlsProps {
  isPlaying: boolean;
  generation: number;
  speed: number;
  canUndo: boolean;
  canRedo: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onClear: () => void;
  onSpeedChange: (speed: number) => void;
  onLoadPattern: (pattern: boolean[][], x: number, y: number) => void;
  onGenerateRandom?: () => void;
  patterns: Record<string, boolean[][]>;
}

export function GameControls({
  isPlaying,
  generation,
  speed,
  canUndo,
  canRedo,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onClear,
  onSpeedChange,
  onLoadPattern,
  onGenerateRandom,
  patterns,
}: GameControlsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-linera-text">
            Generation: {generation}
          </h3>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            isIconOnly
            color="default"
            variant="solid"
            size="lg"
            onPress={onPrevious}
            isDisabled={!canUndo}
            className="bg-linera-background-lighter"
          >
            <SkipBack size={24} />
          </Button>

          {isPlaying ? (
            <Button
              color="primary"
              variant="solid"
              size="lg"
              startContent={<Pause size={24} />}
              onPress={onPause}
              className="px-8"
            >
              Pause
            </Button>
          ) : (
            <Button
              color="primary"
              variant="solid"
              size="lg"
              startContent={<Play size={24} />}
              onPress={onPlay}
              className="px-8"
            >
              Play
            </Button>
          )}

          <Button
            isIconOnly
            color="default"
            variant="solid"
            size="lg"
            onPress={onNext}
            className="bg-linera-background-lighter"
          >
            <SkipForward size={24} />
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            color="default"
            variant="flat"
            size="md"
            startContent={<RotateCcw size={18} />}
            onPress={onClear}
            className="bg-linera-background-lighter hover:bg-linera-background-light"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-linera-text-muted">Speed</span>
          <span className="text-sm font-mono text-linera-primary">
            {speed} gen/s
          </span>
        </div>
        <Slider
          size="sm"
          step={1}
          maxValue={60}
          minValue={1}
          value={speed}
          onChange={(value) => onSpeedChange(value as number)}
          className="max-w-full"
          color="primary"
          startContent={<Zap size={16} className="text-linera-text-muted" />}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm text-linera-text-muted">Load Pattern</label>
        <Select
          placeholder="Select a pattern"
          className="max-w-full"
          size="md"
          variant="bordered"
          onChange={(e) => {
            const patternName = e.target.value;
            if (patternName && patterns[patternName]) {
              onLoadPattern(patterns[patternName], 10, 10);
            }
          }}
        >
          {Object.keys(patterns).map((name) => (
            <SelectItem key={name}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </SelectItem>
          ))}
        </Select>

        {onGenerateRandom && (
          <Button
            color="default"
            variant="solid"
            size="md"
            startContent={<Shuffle size={18} />}
            onPress={() => onGenerateRandom()}
            className="w-full bg-linera-background-lighter hover:bg-linera-background-light"
          >
            Generate Random Pattern
          </Button>
        )}
      </div>
    </div>
  );
}
