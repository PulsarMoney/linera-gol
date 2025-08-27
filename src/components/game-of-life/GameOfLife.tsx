'use client';

import React, { useState, useMemo } from 'react';
import { useGameOfLife } from '@/lib/game-of-life/hooks/useGameOfLife';
import { GameBoardWrapper } from './GameBoardWrapper';
import { GameSidebarWithBlockchain } from './GameSidebarWithBlockchain';

export function GameOfLife() {
  const [boardSize, setBoardSize] = useState(30);
  
  const game = useGameOfLife({
    width: boardSize,
    height: boardSize,
    infinite: false,
    initialSpeed: 5
  });

  const displaySize = useMemo(() => {
    return { width: boardSize, height: boardSize };
  }, [boardSize]);

  return (
    <div className="min-h-screen bg-linera-background">
      <div className="max-w-[1920px] mx-auto p-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-5xl font-bold text-linera-text">
            Conway's Game of Life
          </h1>
          <p className="text-linera-text-muted text-lg">
            Powered by <span className="text-linera-primary font-semibold">Linera</span>
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 flex items-center justify-center">
            <div className="overflow-auto max-w-full max-h-[80vh] rounded-lg border border-linera-background-lighter">
              <GameBoardWrapper
                width={displaySize.width}
                height={displaySize.height}
                cells={game.cells}
                onCellClick={game.toggleCell}
                cellSize={Math.max(5, Math.min(20, 800 / Math.max(displaySize.width, displaySize.height)))}
              />
            </div>
          </div>

          <div className="w-[400px] flex-shrink-0">
            <GameSidebarWithBlockchain
              gameProps={{
                isPlaying: game.isPlaying,
                generation: game.generation,
                speed: game.speed,
                canUndo: game.canUndo,
                canRedo: game.canRedo,
                onPlay: game.play,
                onPause: game.pause,
                onNext: game.next,
                onPrevious: game.previous,
                onClear: game.clear,
                onSpeedChange: game.setSpeed,
                onLoadPattern: game.loadPattern,
                onGenerateRandom: game.generateRandom,
                patterns: game.patterns
              }}
              boardSettings={{
                boardSize,
                onBoardSizeChange: setBoardSize
              }}
              blockchainProps={{
                boardSize,
                cells: game.cells,
                generation: game.generation
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}