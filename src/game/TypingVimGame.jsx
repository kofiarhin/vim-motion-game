import React, { useEffect, useMemo, useRef, useState } from 'react'
import './TypingVimGame.styles.scss'

/**
 * TypingVimGame
 * - Navigate with h/j/k/l (left/right; up/down are no-ops on one line)
 * - Jump words with w (next word start) and b (previous word start)
 * - When cursor is on the target word, press i to enter INSERT mode
 * - Type the word and press Enter. If correct, target highlights green and a success message appears
 */
export default function TypingVimGame({
  sentence = 'Practice makes perfect with vim like navigation',
  // zero-based word index; default targets 'navigation'
  targetIndex = 6,
}) {
  const [mode, setMode] = useState('NORMAL') // 'NORMAL' | 'INSERT'
  const [cursor, setCursor] = useState(0) // character index within sentence
  const [input, setInput] = useState('')
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('Use h/j/k/l, w, b. i to insert.')
  const containerRef = useRef(null)

  // Derived data for words and positions
  const words = useMemo(() => sentence.split(' '), [sentence])
  const wordMeta = useMemo(() => {
    const meta = []
    let pos = 0
    words.forEach((w, idx) => {
      meta.push({ idx, word: w, start: pos, end: pos + w.length })
      pos += w.length
      if (idx < words.length - 1) pos += 1 // space
    })
    return meta
  }, [words])

  const target = wordMeta[Math.max(0, Math.min(targetIndex, wordMeta.length - 1))]
  const len = sentence.length

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const clamp = (n) => Math.max(0, Math.min(n, Math.max(0, len - 1)))

  const onKeyDown = (e) => {
    const k = e.key

    if (mode === 'NORMAL') {
      if ('hjklwb'.includes(k) || k === 'i') e.preventDefault()
      switch (k) {
        case 'h':
          setCursor((c) => clamp(c - 1))
          break
        case 'l':
          setCursor((c) => clamp(c + 1))
          break
        case 'j':
        case 'k':
          // One line only in this mini-game
          break
        case 'w': {
          // Jump to start of next word
          const starts = wordMeta.map((m) => m.start)
          const next = starts.find((s) => s > cursor)
          if (next !== undefined) setCursor(next)
          else setCursor(len - 1)
          break
        }
        case 'b': {
          // Jump to start of previous word
          const starts = wordMeta.map((m) => m.start)
          const prev = [...starts].reverse().find((s) => s < cursor)
          if (prev !== undefined) setCursor(prev)
          else setCursor(0)
          break
        }
        case 'i': {
          // Enter insert when on target word
          if (cursor >= target.start && cursor < target.end) {
            setMode('INSERT')
            setInput('')
            setMessage('INSERT - type the word and press Enter')
          }
          break
        }
        default:
          break
      }
    } else if (mode === 'INSERT') {
      // In insert mode: collect input, Backspace deletes, Enter submits, Esc cancels
      if (k === 'Enter') {
        e.preventDefault()
        if (input === target.word) {
          setSuccess(true)
          setMessage('Success! Correct word.')
        } else {
          setSuccess(false)
          setMessage('Not quite - keep typing or Esc to cancel')
        }
        // Stay in INSERT on incorrect answers; exit on success
        if (input === target.word) {
          setMode('NORMAL')
        }
        return
      }
      if (k === 'Escape') {
        e.preventDefault()
        setMode('NORMAL')
        setInput('')
        setMessage('Use h/j/k/l, w, b. i to insert.')
        return
      }
      if (k === 'Backspace') {
        e.preventDefault()
        setInput((s) => s.slice(0, -1))
        return
      }
      if (k.length === 1) {
        e.preventDefault()
        setInput((s) => s + k)
        return
      }
    }
  }

  // Build character-level rendering for a simple caret visualization
  const chars = useMemo(() => sentence.split(''), [sentence])
  const isInTarget = (i) => i >= target.start && i < target.end

  return (
    <div className="TypingVimGame">
      <div
        className="tvg-surface"
        tabIndex={0}
        ref={containerRef}
        onKeyDown={onKeyDown}
        role="application"
        aria-label="Vim typing game"
      >
        <div className="tvg-hud">
          <div className="tvg-mode">Mode: {mode}</div>
          <div className="tvg-msg" aria-live="polite">{message}</div>
        </div>

        <div className="tvg-sentence" aria-label="Sentence">
          {chars.map((ch, i) => {
            const atCursor = i === cursor
            const targetClass = isInTarget(i) ? (success ? 'target success' : 'target') : ''
            return (
              <span
                key={i}
                className={[
                  'tvg-ch',
                  atCursor ? 'cursor' : '',
                  ch === ' ' ? 'space' : '',
                  targetClass,
                ].filter(Boolean).join(' ')}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            )
          })}
        </div>

        {mode === 'INSERT' && (
          <div className="tvg-input" aria-label="Type here">
            <span className="label">Input:</span>
            <span className="value">{input}</span>
          </div>
        )}
      </div>
    </div>
  )
}

