# Vim hjkl Maze — React + Vite

A small, keyboard-driven maze game built with React 18 and Vite. Move using Vim-style keys, race the timer, and reach the red exit.

## Live Demo

Play the game live at [https://vim-motion-game.vercel.app/](https://vim-motion-game.vercel.app/)

## Features

- Keyboard movement with Vim keys: `h` `j` `k` `l`
- Numeric prefixes supported: `0-9` before a direction (e.g., `3l`)
- Fixed grid size: 12 × 12 each round (layout is randomized)
- Viewport-fit board: cells scale to fill the screen without scrollbars
- Clear visuals:
  - Path cells: solid white
  - Walls: dark blocks
  - Exit: solid red tile (high contrast)
  - Player: green with subtle pulse animation
- Any-key start: press any key (or click the big button) to begin
- Timer: starts when a round starts, stops on success or timeout
- Accessibility: proper `role="grid"` and `role="gridcell"`, ARIA labels for cells

## Quick Start

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

Open the dev URL printed in your terminal (usually http://localhost:5173).

## How To Play

- Start: press any key (or click the button).
- Move: `h` (left), `j` (down), `k` (up), `l` (right).
- Counts: optionally press digits `0-9` before a motion (e.g., `5j`).
- Escape: cancels a partial numeric prefix.
- Goal: reach the red exit tile before the timer hits zero.

## Project Structure

```
src/
  game/
    MazeGame.jsx          # Main game container (start/timer, overlays)
    MazeGame.styles.scss  # Game-level styles (overlays, timer badge)
    MazeGrid.jsx          # Renders the grid with ARIA roles
    MazeGrid.styles.scss  # Grid + cell visuals (paths/walls/player/exit)
  hooks/
    useViewportCellSize.js # Calculates cell size from viewport and grid dims
  logic/
    maze.js               # Maze generator (DFS/backtracker)
    engine.js             # Movement application and state updates
    parser.js             # Parses hjkl motions + numeric prefixes
    rng.js                # PRNG + helpers
  styles/
    global.scss           # Global theme + resets
```

## Key Implementation Notes

- Grid size is locked to 12×12 via constants in `MazeGame.jsx` and passed to `generateMaze()`.
- Cells size responsively using the `--cell-size` CSS variable set from `useViewportCellSize`.
- Exit placement is aligned to the carved lattice in `logic/maze.js`, ensuring it’s always reachable.
- Visuals (SCSS) are UI-only; game logic (generation, parser, engine, timers, scoring) remains unchanged.

## Styling

- Component-scoped SCSS files (`ComponentName.styles.scss`).
- White paths, dark walls, red exit; player cell pulses. Respects `prefers-reduced-motion`.

## Accessibility

- Container has `role="grid"` and each tile `role="gridcell"`.
- ARIA labels: `player`, `exit`, `wall`, `path`.

## Scripts

- `npm run dev` – Start Vite dev server
- `npm run build` – Production build
- `npm run preview` – Preview built assets

## License

This project is provided as-is for learning and experimentation.
