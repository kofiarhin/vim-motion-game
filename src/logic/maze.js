// Maze generator: randomized DFS/backtracker on odd grid
// 1 = wall, 0 = path

import { oddBetween } from './rng'

// Reduce default maze dimensions to suit larger visual cells
// Keep odd ranges so algorithm remains valid
export function generateMaze({ rows: fixedRows, cols: fixedCols, minRows = 7, maxRows = 11, minCols = 9, maxCols = 15, rng }) {
  // If explicit dimensions provided, honor them exactly; otherwise pick odd within range
  const rows = typeof fixedRows === 'number' ? fixedRows : oddBetween(minRows, maxRows, rng)
  const cols = typeof fixedCols === 'number' ? fixedCols : oddBetween(minCols, maxCols, rng)
  const grid = Array.from({ length: rows }, () => Array(cols).fill(1))

  const inBounds = (r, c) => r > 0 && r < rows - 1 && c > 0 && c < cols - 1

  function carve(r, c) {
    grid[r][c] = 0
    const dirs = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2]
    ]
    // shuffle dirs
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor((rng?.() ?? Math.random()) * (i + 1))
      ;[dirs[i], dirs[j]] = [dirs[j], dirs[i]]
    }
    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (inBounds(nr, nc) && grid[nr][nc] === 1) {
        // knock down wall between
        grid[r + dr / 2][c + dc / 2] = 0
        carve(nr, nc)
      }
    }
  }

  carve(1, 1) // start carve near top-left

  // Ensure start and exit are paths
  grid[1][1] = 0
  // Place exit on the carved lattice (odd indices) so it's reachable
  let er = rows - 2
  let ec = cols - 2
  if (er % 2 === 0) er -= 1
  if (ec % 2 === 0) ec -= 1
  grid[er][ec] = 0

  return { grid, start: { r: 1, c: 1 }, exit: { r: er, c: ec } }
}

export function isOpen(grid, r, c) {
  return !!grid[r] && grid[r][c] === 0
}
