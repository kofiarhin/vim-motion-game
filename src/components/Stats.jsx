import React from 'react'
import './stats.styles.scss'

const formatTime = (ms) => {
  const s = Math.floor((ms || 0) / 1000)
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

const Stats = ({ wpm, accuracy, elapsedMs }) => {
  const w = Math.max(0, Math.round(wpm || 0))
  const a = Math.max(0, Math.min(100, Math.round(accuracy || 0)))
  const t = formatTime(elapsedMs)
  return (
    <div className="stats" aria-label="Typing statistics">
      <div className="metric" aria-label="Words per minute">
        <div className="label">WPM</div>
        <div className="value">{w}</div>
      </div>
      <div className="metric" aria-label="Accuracy">
        <div className="label">Accuracy</div>
        <div className="value">{a}%</div>
      </div>
      <div className="metric" aria-label="Elapsed time">
        <div className="label">Time</div>
        <div className="value">{t}</div>
      </div>
    </div>
  )
}

export default Stats

