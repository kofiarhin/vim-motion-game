import React from "react";
import useViewportCellSize from "../hooks/useViewportCellSize";
import "./MazeGrid.styles.scss";

export default function MazeGrid({ maze, pos, exit }) {
  const rows = maze.length;
  const cols = maze[0].length;
  // Reserve space for HUD/subhud + paddings to avoid overflow
  const cellSize = useViewportCellSize(rows, cols, {
    padding: 48,
    min: 18,
    max: 128,
  });
  return (
    <div
      className="MazeGrid"
      style={{
        "--cell-size": `${cellSize}px`,
        gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
        gridTemplateRows: `repeat(${rows}, var(--cell-size))`,
      }}
    >
      {maze.map((row, r) =>
        row.map((v, c) => {
          const isWall = v === 1;
          const isGoal = r === exit.r && c === exit.c;
          const isPlayer = r === pos.r && c === pos.c;
          return (
            <div
              key={`${r}-${c}`}
              className={`cell ${isWall ? "wall" : "path"} ${
                isPlayer ? "player" : ""
              } ${isGoal ? "goal" : ""}`}
              role="gridcell"
              aria-label={
                isPlayer ? "player" : isGoal ? "exit" : isWall ? "wall" : "path"
              }
            />
          );
        })
      )}
    </div>
  );
}
