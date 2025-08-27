"use client";

export function Instructions() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-linera-text mb-4">
        How to Play
      </h3>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-linera-text mb-1">Rules</h4>
          <ul className="space-y-1 text-sm text-linera-text-muted">
            <li>• Any live cell with 2-3 neighbors survives</li>
            <li>• Any dead cell with exactly 3 neighbors becomes alive</li>
            <li>• All other cells die or stay dead</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-linera-text mb-1">
            Controls
          </h4>
          <ul className="space-y-1 text-sm text-linera-text-muted">
            <li>• Click cells to toggle them on/off</li>
            <li>• Use play/pause to run simulation</li>
            <li>• Step forward/backward through generations</li>
            <li>• Load preset patterns from dropdown</li>
            <li>• Adjust speed with the slider</li>
            <li>• Clear board to start fresh</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-linera-text mb-1">
            Patterns
          </h4>
          <p className="text-sm text-linera-text-muted">
            Try loading different patterns to see how they evolve over time!
          </p>
        </div>
      </div>
    </div>
  );
}
