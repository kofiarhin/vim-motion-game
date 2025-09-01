/*
README (short):
- Controls (Running only):
  - h j k l: move (prefix counts supported, e.g., 3l)
  - Esc: clear count buffer
- Modes:
  - Practice: no timer
  - Time Attack: 60s; on timeout -> Time! and return to Idle; Start must be pressed to begin again
- Round Flow:
  - Start: fresh maze, focuses grid, starts timer if Time Attack, enters Running
  - New Maze (Running): fresh maze; timer continues
  - Exit: +10 score and auto-new maze; timer continues if Running
*/

import React from 'react'
import MazeGame from './game/MazeGame'
import './App.styles.scss'

export default function App() {
  return (
    <div className="App">
      <MazeGame />
    </div>
  )
}

if (import.meta.env.DEV) {
  import('./dev/checks.dev.js').then(({ runDevChecks }) => runDevChecks?.())
}

