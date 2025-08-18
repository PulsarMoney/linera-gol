'use client';

import React, { useRef, useEffect, useCallback, memo } from 'react';

interface GameBoardCanvasProps {
  width: number;
  height: number;
  cells: Map<string, boolean>;
  onCellClick: (x: number, y: number) => void;
  cellSize?: number;
}

export const GameBoardCanvas = memo(function GameBoardCanvas({
  width,
  height,
  cells,
  onCellClick,
  cellSize = 20
}: GameBoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1A1F27'; // linera-background-light
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#252C37'; // linera-background-lighter
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height * cellSize);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width * cellSize, y * cellSize);
      ctx.stroke();
    }

    // Draw alive cells
    ctx.fillStyle = '#DE2A02'; // linera-primary
    ctx.shadowColor = 'rgba(222, 42, 2, 0.5)';
    ctx.shadowBlur = 10;

    cells.forEach((_, key) => {
      const [x, y] = key.split(',').map(Number);
      if (x >= 0 && x < width && y >= 0 && y < height) {
        ctx.fillRect(
          x * cellSize + 1,
          y * cellSize + 1,
          cellSize - 2,
          cellSize - 2
        );
      }
    });

    ctx.shadowBlur = 0;
  }, [width, height, cells, cellSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      onCellClick(x, y);
    }
  }, [cellSize, width, height, onCellClick]);

  return (
    <canvas
      ref={canvasRef}
      width={width * cellSize}
      height={height * cellSize}
      className="cursor-pointer rounded-lg"
      onClick={handleCanvasClick}
      style={{
        imageRendering: 'pixelated',
        backgroundColor: '#1A1F27'
      }}
    />
  );
});