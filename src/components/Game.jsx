import React, { useEffect, useMemo, useRef } from 'react'
import useTyping from '../hooks/useTyping'
import Stats from './Stats'
import Controls from './Controls'
import './game.styles.scss'

const Game = () => {
  const {
    passage,
    chars,
    cursor,
    mode,
    progress,
    wpm,
    accuracy,
    elapsedMs,
    status,
    remainingMs,
    started,
    timeUp,
    restart,
    next,
    onKeyDown,
  } = useTyping()

  const surfaceRef = useRef(null)
  useEffect(() => {
    surfaceRef.current?.focus()
  }, [passage])

  // Global fallback: route keydown to handler when surface isn't focused
  useEffect(() => {
    const handler = (e) => {
      if (e.defaultPrevented) return
      const ae = document.activeElement
      const root = surfaceRef.current
      const inside = root && (ae === root || root.contains(ae))
      const isInput = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable)
      if (inside || isInput) return
      onKeyDown(e)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onKeyDown])

  const handleRestart = () => {
    restart()
    requestAnimationFrame(() => surfaceRef.current?.focus())
  }
  const handleNext = () => {
    next()
    requestAnimationFrame(() => surfaceRef.current?.focus())
  }

  const sourceChars = useMemo(() => passage.split(''), [passage])

  return (
    <div className="typingGame">
      <div className="card">
        <div className="header">
          <div className="badge" aria-label="Mode">{mode}</div>
          <div className="status" aria-live="polite">
            {status === 'Press any key to start' ? (
              <strong>Press any key to start</strong>
            ) : status === 'Typing…' ? (
              <>Typing… — {Math.ceil(remainingMs / 1000)}s left</>
            ) : status === 'Complete' ? (
              <>Success!</>
            ) : (
              status
            )}
          </div>
        </div>

        <div
          className="surface"
          tabIndex={0}
          role="textbox"
          aria-multiline="true"
          aria-label="Typing surface"
          ref={surfaceRef}
          onKeyDown={onKeyDown}
          onClick={() => surfaceRef.current?.focus()}
        >
          {!started ? (
            <div className="overlay" aria-live="polite">
              <strong>Press any key to start</strong>
            </div>
          ) : timeUp ? (
            <div className="overlay" aria-live="polite">
              <strong>GAME OVER — press any key to restart</strong>
            </div>
          ) : status === 'Complete' ? (
            <div className="overlay" aria-live="polite">
              <strong>SUCCESS — press any key for next</strong>
            </div>
          ) : (
            <div className="passage">
              {sourceChars.map((ch, i) => {
                const typedCh = chars[i]
                const isTyped = typedCh !== ''
                const isCorrect = isTyped && typedCh === ch
                const isCaret = i === cursor
                const cls = [
                  'char',
                  isCaret ? 'caret' : '',
                  isTyped ? (isCorrect ? 'typedCorrect' : 'typedWrong') : 'untouched',
                  ch === ' ' ? 'space' : '',
                ].filter(Boolean).join(' ')
                return (
                  <span key={i} className={cls} aria-hidden="true">
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        <div className="footer">
          <div className="row">
            <Stats wpm={wpm} accuracy={accuracy} elapsedMs={elapsedMs} />
            <Controls onRestart={handleRestart} onNext={handleNext} />
          </div>
          <div className="progressWrap" aria-label="Progress">
            <div className="progressBar" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <div className="row">
            <div className="hint" aria-hidden="true">Esc — restart | Enter — next | Backspace — fix</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game
