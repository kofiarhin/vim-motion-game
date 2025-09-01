import { isOpen } from './maze'

export function startState(mazeObj) {
  const { grid, start, exit } = mazeObj
  return {
    maze: grid,
    pos: { r: start.r, c: start.c },
    exit: { r: exit.r, c: exit.c },
    steps: 0,
  }
}

export function applyMotion(state, buf) {
  const maze = state.maze
  let { r, c } = state.pos
  const count = buf.count ?? 1
  let movedSteps = 0

  const dirMap = {
    h: [0, -1],
    j: [1, 0],
    k: [-1, 0],
    l: [0, 1],
  }
  const [dr, dc] = dirMap[buf.op] || [0, 0]

  for (let i = 0; i < count; i++) {
    const nr = r + dr
    const nc = c + dc
    if (!isOpen(maze, nr, nc)) break
    r = nr
    c = nc
    movedSteps++
  }

  const newState = {
    ...state,
    pos: { r, c },
    steps: movedSteps > 0 ? state.steps + 1 : state.steps,
  }
  const reachedExit = r === state.exit.r && c === state.exit.c
  return { state: newState, ok: movedSteps > 0, reachedExit }
}

