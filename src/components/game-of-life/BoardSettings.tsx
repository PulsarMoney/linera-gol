'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { RefreshCw } from 'lucide-react';

interface BoardSettingsProps {
  boardSize: number;
  onBoardSizeChange: (size: number) => void;
}

export function BoardSettings({ 
  boardSize, 
  onBoardSizeChange
}: BoardSettingsProps) {
  const [tempBoardSize, setTempBoardSize] = useState<string>(boardSize.toString());
  const parsedSize = parseInt(tempBoardSize) || 30;
  const hasChanges = parsedSize !== boardSize && tempBoardSize !== '';

  const handleApply = () => {
    onBoardSizeChange(parsedSize);
  };

  useEffect(() => {
    setTempBoardSize(boardSize.toString());
  }, [boardSize]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-linera-text mb-4">Board Settings</h3>
      
      <div className="space-y-3">
        <label className="text-sm text-linera-text-muted">Board Size</label>
        <div className="flex gap-2 items-stretch">
          <Input
            type="number"
            min={10}
            max={100}
            value={tempBoardSize}
            onChange={(e) => {
              const value = e.target.value;
              setTempBoardSize(value);
            }}
            className="flex-1"
            size="md"
          />
          <Button
            color="primary"
            variant="solid"
            size="md"
            isDisabled={!hasChanges}
            onPress={handleApply}
            startContent={<RefreshCw size={18} />}
            className="px-6"
          >
            Apply
          </Button>
        </div>
        {hasChanges && (
          <p className="text-xs text-linera-primary">
            Click Apply to resize (this will reset the game)
          </p>
        )}
      </div>
    </div>
  );
}