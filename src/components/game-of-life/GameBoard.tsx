'use client';

import React, { useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';

interface GameBoardProps {
  width: number;
  height: number;
  cells: Map<string, boolean>;
  onCellClick: (x: number, y: number) => void;
  cellSize?: number;
}

export const GameBoard = memo(function GameBoard({ 
  width, 
  height, 
  cells, 
  onCellClick,
  cellSize = 20 
}: GameBoardProps) {
  const handleCellClick = useCallback((x: number, y: number) => {
    onCellClick(x, y);
  }, [onCellClick]);

  const grid = useMemo(() => {
    const result = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const key = `${x},${y}`;
        const isAlive = cells.has(key);
        result.push(
          <motion.div
            key={key}
            className={`
              border border-linera-background-lighter cursor-pointer
              transition-transform duration-75
              ${isAlive ? 'bg-linera-primary shadow-lg shadow-linera-primary/50' : 'bg-linera-background-light'}
            `}
            style={{
              width: cellSize,
              height: cellSize,
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
            onClick={() => handleCellClick(x, y)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              backgroundColor: isAlive ? '#DE2A02' : '#1A1F27',
              boxShadow: isAlive ? '0 0 20px rgba(222, 42, 2, 0.5)' : 'none'
            }}
            transition={{ duration: 0 }}
          />
        );
      }
    }
    return result;
  }, [width, height, cells, cellSize, handleCellClick]);

  return (
    <div 
      className="inline-grid gap-[1px] bg-linera-background-lighter p-4 rounded-lg"
      style={{
        gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
      }}
    >
      {grid}
    </div>
  );
});