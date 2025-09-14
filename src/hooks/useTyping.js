import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import passagesData from '../data/passages'

const pickRandom = (arr, except) => {
  if (!arr?.length) return ''
  if (arr.length === 1) return arr[0]
  let p = arr[Math.floor(Math.random() * arr.length)]
  if (except && p === except) {
    p = arr[(arr.indexOf(p) + 1) % arr.length]
  }
  return p
}

const formatQ = (q) => {
  if (!q) return ''
  try {
    return decodeURIComponent(q.replace(/\+/g, ' '))
  } catch {
    return q.replace(/\+/g, ' ')
  }
}

const useTyping = () => {
  const [passage, setPassage] = useState('')
  const [chars, setChars] = useState([]) // user-entered chars per position
  const [cursor, setCursor] = useState(0)
  const [mode, setMode] = useState('TYPING') // single simple mode
  const [totalKeystrokes, setTotalKeystrokes] = useState(0)
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
  const [startedAt, setStartedAt] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [done, setDone] = useState(false)
  const [timeUp, setTimeUp] = useState(false)

  const timerRef = useRef(null)

  const len = passage.length
  const clamp = useCallback((n) => Math.max(0, Math.min(n, Math.max(0, len))), [len])
  const LIMIT_MS = 60000

  // Initialize passage on mount, honoring ?q= override
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')
    const initial = q ? formatQ(q) : pickRandom(passagesData)
    setPassage(initial)
  }, [])

  // When passage changes, reset state
  useEffect(() => {
    setChars(Array.from({ length: passage.length }, () => ''))
    setCursor(0)
    setMode('TYPING')
    setTotalKeystrokes(0)
    setCorrectKeystrokes(0)
    setStartedAt(null)
    setElapsedMs(0)
    setDone(false)
    setTimeUp(false)
  }, [passage])

  // Tick elapsed time while typing
  useEffect(() => {
    if (!startedAt || done || timeUp) return
    timerRef.current && clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const delta = Date.now() - startedAt
      if (delta >= LIMIT_MS) {
        setElapsedMs(LIMIT_MS)
        setTimeUp(true)
        clearInterval(timerRef.current)
      } else {
        setElapsedMs(delta)
      }
    }, 100)
    return () => timerRef.current && clearInterval(timerRef.current)
  }, [startedAt, done, timeUp])

  const typedCount = useMemo(() => {
    // Count up to first empty slot; supports sequential typing UX
    let i = 0
    while (i < chars.length && chars[i] !== '') i++
    return i
  }, [chars])
  const correctChars = useMemo(() => {
    let c = 0
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] && chars[i] === passage[i]) c++
    }
    return c
  }, [chars, passage])
  const progress = useMemo(() => passage ? typedCount / passage.length : 0, [typedCount, passage])

  useEffect(() => {
    setDone(passage.length > 0 && typedCount >= passage.length)
  }, [typedCount, passage.length])

  const restart = useCallback(() => {
    setChars(Array.from({ length: passage.length }, () => ''))
    setCursor(0)
    setMode('TYPING')
    setTotalKeystrokes(0)
    setCorrectKeystrokes(0)
    setStartedAt(null)
    setElapsedMs(0)
    setDone(false)
    setTimeUp(false)
  }, [passage.length])

  const next = useCallback(() => {
    const nextPassage = pickRandom(passagesData, passage)
    setPassage(nextPassage)
  }, [passage])

  const onKeyDown = useCallback((e) => {
    if (!passage) return
    const { key } = e

    // Start on first key; swallow non-printable first key
    if (!startedAt) {
      if (key.length === 1) {
        setStartedAt(Date.now())
        // continue to printable handling below
      } else {
        setStartedAt(Date.now())
        e.preventDefault()
        return
      }
    }

    // Controls
    if (key === 'Escape') {
      e.preventDefault()
      restart()
      return
    }
    if (key === 'Enter') {
      e.preventDefault()
      next()
      return
    }
    if (key === 'Backspace') {
      e.preventDefault()
      if (cursor <= 0) return
      setChars((arr) => {
        const nextArr = arr.slice()
        nextArr[cursor - 1] = ''
        return nextArr
      })
      setCursor((c) => clamp(c - 1))
      return
    }

    if (done || timeUp) return

    if (key.length === 1) {
      e.preventDefault()
      const expected = passage[cursor]
      const isCorrect = key === expected
      setChars((arr) => {
        const nextArr = arr.slice()
        nextArr[cursor] = key
        return nextArr
      })
      setCursor((c) => clamp(c + 1))
      setTotalKeystrokes((n) => n + 1)
      if (isCorrect) setCorrectKeystrokes((n) => n + 1)
      return
    }
  }, [passage, cursor, clamp, startedAt, done, timeUp, next, restart])

  const elapsedMinutes = useMemo(() => (elapsedMs || 0) / 60000, [elapsedMs])
  const wpm = useMemo(() => {
    if (!startedAt || elapsedMinutes <= 0) return 0
    return (correctChars / 5) / elapsedMinutes
  }, [correctChars, elapsedMinutes, startedAt])
  const accuracy = useMemo(() => {
    if (totalKeystrokes === 0) return 100
    return (correctKeystrokes / totalKeystrokes) * 100
  }, [correctKeystrokes, totalKeystrokes])
  const status = useMemo(() => {
    if (!startedAt) return 'Press any key to start'
    if (timeUp) return 'Time!'
    if (done) return 'Complete'
    return 'Typing…'
  }, [startedAt, done, timeUp])

  const remainingMs = useMemo(() => {
    if (!startedAt) return LIMIT_MS
    const r = LIMIT_MS - elapsedMs
    return r > 0 ? r : 0
  }, [elapsedMs, startedAt])

  return {
    passage,
    // user input state
    chars,
    cursor,
    mode,
    progress,
    // metrics
    correctChars,
    totalKeystrokes,
    wpm,
    accuracy,
    elapsedMs,
    status,
    remainingMs,
    // actions
    restart,
    next,
    onKeyDown,
  }
}

export default useTyping

