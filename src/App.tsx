import React from 'react';
import { Routes, Route } from 'react-router-dom';
import clsx from 'clsx';
import { Providers } from './providers';
import { fontSans } from './config/fonts';
import { GameOfLife } from './components/game-of-life/GameOfLife';
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
            <Route path="/" element={<GameOfLife />} />
            <Route path="/initialize" element={<Initialize />} />
          </Routes>
        </div>
      </Providers>
    </div>
  );
}

export default App;