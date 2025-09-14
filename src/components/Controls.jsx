import React from 'react'
import './controls.styles.scss'

const Controls = ({ onRestart, onNext }) => (
  <div className="controls" aria-label="Controls">
    <button className="btn" onClick={onRestart} aria-label="Restart passage">
      Restart
    </button>
    <button className="btn primary" onClick={onNext} aria-label="Next passage">
      Next passage
    </button>
  </div>
)

export default Controls

