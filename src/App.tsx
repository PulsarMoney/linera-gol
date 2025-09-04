import React from 'react';
import { Routes, Route } from 'react-router-dom';
import clsx from 'clsx';
import { Providers } from './providers';
import { fontSans } from './config/fonts';
import { GameOfLife } from './components/game-of-life/GameOfLife';
import { PuzzleGame } from './components/puzzles/PuzzleGame';
import { Initialize } from './pages/Initialize';

function App() {
  return (
    <div
      className={clsx(
        "min-h-screen text-foreground bg-linera-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
        <div className="relative flex flex-col h-screen">
          <Routes>
            <Route path="/" element={<Initialize />} />
            <Route path="/game" element={<GameOfLife />} />
            <Route path="/puzzles" element={<PuzzleGame />} />
          </Routes>
        </div>
      </Providers>
    </div>
  );
}

export default App;