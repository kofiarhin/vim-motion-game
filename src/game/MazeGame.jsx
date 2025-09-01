import React, { useEffect, useRef, useState } from 'react'
import { randomSeed } from '../logic/rng'
import { generateMaze } from '../logic/maze'
import { emptyBuffer, parseKey, displayBuffer } from '../logic/parser'
import { applyMotion, startState } from '../logic/engine'
import MazeGrid from './MazeGrid'
import './MazeGame.styles.scss'

const Mode = { Practice: 'Practice', Time: 'Time Attack' }

export default function MazeGame() {
  const [mode, setMode] = useState(Mode.Practice)
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Press any key to start')
  const [buf, setBuf] = useState(emptyBuffer())
  // Use odd dimensions so the DFS maze (which carves on an odd lattice)
  // generates a connected path to the exit.
  // Fixed grid size per request
  const FIXED_ROWS = 12
  const FIXED_COLS = 12
  const [mazeObj, setMazeObj] = useState(() => generateMaze({ rows: FIXED_ROWS, cols: FIXED_COLS, rng: randomSeed() }))
  const [state, setState] = useState(() => startState(mazeObj))
  const containerRef = useRef(null)
  const [invalidShake, setInvalidShake] = useState(0)
  const audioCtxRef = useRef(null)

  const playWinSound = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      const ctx = audioCtxRef.current || new Ctx()
      audioCtxRef.current = ctx
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
      const now = ctx.currentTime

      // Master gain
      const master = ctx.createGain()
      master.connect(ctx.destination)
      master.gain.setValueAtTime(0.0001, now)
      master.gain.exponentialRampToValueAtTime(0.5, now + 0.02)
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.7)

      // Bright celebratory chord (sawtooth + square layers)
      const chordFreqs = [523.25, 783.99, 1046.5] // C5, G5, C6
      chordFreqs.forEach((f) => {
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.18, now)
        g.connect(master)

        const osc1 = ctx.createOscillator()
        osc1.type = 'sawtooth'
        osc1.frequency.setValueAtTime(f, now)
        osc1.connect(g)
        osc1.start(now)
        osc1.stop(now + 0.6)

        const osc2 = ctx.createOscillator()
        osc2.type = 'square'
        osc2.frequency.setValueAtTime(f / 2, now)
        osc2.connect(g)
        osc2.start(now)
        osc2.stop(now + 0.6)
      })

      // Upward chirp for emphasis
      const sweep = ctx.createOscillator()
      sweep.type = 'triangle'
      sweep.frequency.setValueAtTime(600, now)
      sweep.frequency.exponentialRampToValueAtTime(1600, now + 0.45)
      const sweepGain = ctx.createGain()
      sweepGain.gain.setValueAtTime(0.15, now)
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
      sweep.connect(sweepGain)
      sweepGain.connect(master)
      sweep.start(now)
      sweep.stop(now + 0.5)

      // Short noise burst (sparkle)
      const dur = 0.18
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      const nGain = ctx.createGain()
      nGain.gain.setValueAtTime(0.12, now)
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + dur)
      noise.connect(nGain)
      nGain.connect(master)
      noise.start(now + 0.02)
      noise.stop(now + dur + 0.02)
    } catch (_) {}
  }

  // Keep state in sync when a new maze is generated
  useEffect(() => { setState(startState(mazeObj)) }, [mazeObj])

  // Timer ticks whenever a round is running
  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [running, timeLeft])

  // Handle timeout -> show message and go Idle, prepare next maze
  useEffect(() => {
    if (timeLeft <= 0 && running) {
      setMessage('Time!')
      setRunning(false) // go Idle
      setTimeout(() => setMazeObj(generateMaze({ rows: FIXED_ROWS, cols: FIXED_COLS, rng: randomSeed() })), 50)
    }
  }, [timeLeft, running])

  const startRound = () => {
    setBuf(emptyBuffer())
    setMessage('')
    setMazeObj(generateMaze({ rows: FIXED_ROWS, cols: FIXED_COLS, rng: randomSeed() }))
    setRunning(true)
    setTimeLeft(60)
    setTimeout(() => containerRef.current?.focus(), 0)
  }

  const newMaze = () => {
    if (!running) return
    setBuf(emptyBuffer())
    setMazeObj(generateMaze({ rows: FIXED_ROWS, cols: FIXED_COLS, rng: randomSeed() }))
    setTimeout(() => containerRef.current?.focus(), 0)
  }

  const onKeyDown = (e) => {
    const key = e.key
    // Start on any key if not running
    if (!running) {
      e.preventDefault()
      startRound()
      return
    }
    const handled = 'hjkl0123456789'.includes(key) || key === 'Escape'
    if (handled) e.preventDefault()

    const parsed = parseKey({ ...buf }, key)
    setBuf(parsed.buf)
    if (!parsed.ready) return

    const { state: next, ok, reachedExit } = applyMotion(state, parsed.buf)
    if (!ok) {
      setInvalidShake(n => n + 1)
      setMessage('blocked')
    } else {
      setState(next)
      setMessage('')
      if (reachedExit) {
        playWinSound()
        setScore(s => s + 10)
        setMessage('Press any key to start')
        // Stop the timer on success; user starts next game manually
        setRunning(false)
      }
    }
    setBuf(emptyBuffer())
  }

  // Global listener so user can press any key to start without focusing grid
  useEffect(() => {
    const onAnyKey = (e) => {
      if (!running) {
        e.preventDefault()
        startRound()
      }
    }
    window.addEventListener('keydown', onAnyKey)
    return () => window.removeEventListener('keydown', onAnyKey)
  }, [running])

  const onModeChange = (m) => {
    setMode(m)
    setRunning(false)
    setTimeLeft(60)
    setBuf(emptyBuffer())
    setMessage('Press any key to start')
  }

  const hudBuffer = displayBuffer(buf)

  return (
    <div className="MazeGame">

      <div className="subhud" aria-live="polite">
        <div className="msg">{message}</div>
        <div className="buf">{hudBuffer}</div>
      </div>

      {running && (
        <div className="timerBadge" aria-hidden="true">{timeLeft}s</div>
      )}

      {!running && (
        <div className="startOverlay" aria-live="polite">
          <button className="startButton" onClick={startRound} aria-label="Press any key or click to start">
            Press any key to start
          </button>
        </div>
      )}

      {running && (
        <div
          className={`gridWrap shake-${invalidShake}`}
          tabIndex={0}
          ref={containerRef}
          onKeyDown={onKeyDown}
          role="grid"
          aria-label="Maze"
        >
          <MazeGrid
            maze={state.maze}
            pos={state.pos}
            exit={state.exit}
          />
        </div>
      )}
    </div>
  )
}
