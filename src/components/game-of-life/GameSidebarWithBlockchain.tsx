"use client";

import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Play, Settings, HelpCircle } from "lucide-react";
import { GameControls } from "./GameControls";
import { BoardSettings } from "./BoardSettings";
import { Instructions } from "./Instructions";
import { BlockchainStatus } from "../linera/BlockchainStatus";

interface GameSidebarWithBlockchainProps {
  gameProps: {
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
  };
  boardSettings: {
    boardSize: number;
    onBoardSizeChange: (size: number) => void;
  };
  blockchainProps: {
    boardSize: number;
    cells: Map<string, boolean>;
    generation: number;
  };
}

export function GameSidebarWithBlockchain({
  gameProps,
  boardSettings,
  blockchainProps,
}: GameSidebarWithBlockchainProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-linera-background-light/90 backdrop-blur-md border border-linera-background-lighter">
        <CardBody className="p-4">
          <Tabs aria-label="Game Options" className="w-full">
            <Tab
              key="controls"
              title={
                <div className="flex items-center space-x-2">
                  <Play size={18} />
                  <span>Controls</span>
                </div>
              }
            >
              <div className="p-4">
                <GameControls {...gameProps} />
              </div>
            </Tab>
            <Tab
              key="settings"
              title={
                <div className="flex items-center space-x-2">
                  <Settings size={18} />
                  <span>Settings</span>
                </div>
              }
            >
              <div className="p-4">
                <BoardSettings {...boardSettings} />
              </div>
            </Tab>
            {/* Commenting out blockchain tab for now
            <Tab
              key="blockchain"
              title={
                <div className="flex items-center space-x-2">
                  <Link size={18} />
                  <span>Blockchain</span>
                </div>
              }
            >
              <div className="p-4">
                <BlockchainOperations {...blockchainProps} />
              </div>
            </Tab>
            */}
            <Tab
              key="instructions"
              title={
                <div className="flex items-center space-x-2">
                  <HelpCircle size={18} />
                  <span>Help</span>
                </div>
              }
            >
              <div className="p-4">
                <Instructions />
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      <BlockchainStatus />
    </div>
  );
}
