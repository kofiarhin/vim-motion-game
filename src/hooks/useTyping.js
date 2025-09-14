import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import passagesData from '../data/passages'

const pickRandom = (arr, except) => {
  if (!arr?.length) return ''
  if (arr.length === 1) return arr[0]
  let p = arr[Math.floor(Math.random() * arr.length)]
  if (except && p === except) p = arr[(arr.indexOf(p) + 1) % arr.length]
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
  const [chars, setChars] = useState([])
  const [mode] = useState('TYPING')
  const [totalKeystrokes, setTotalKeystrokes] = useState(0)
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
  const [startedAt, setStartedAt] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [done, setDone] = useState(false)
  const [timeUp, setTimeUp] = useState(false)

  const timerRef = useRef(null)
  const LIMIT_MS = 60000

  // Initialize passage on mount, honoring ?q= override
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')
    const initial = q ? formatQ(q) : pickRandom(passagesData)
    setPassage(initial)
  }, [])

  // Reset state on passage change
  useEffect(() => {
    setChars(Array.from({ length: passage.length }, () => ''))
    setTotalKeystrokes(0)
    setCorrectKeystrokes(0)
    setStartedAt(null)
    setElapsedMs(0)
    setDone(false)
    setTimeUp(false)
  }, [passage])

  // Derived counts
  const typedCount = useMemo(() => {
    let i = 0
    const max = Math.min(chars.length, passage.length)
    while (i < max && chars[i] === passage[i]) i++
    return i
  }, [chars, passage])
  const progress = useMemo(() => (passage ? typedCount / passage.length : 0), [typedCount, passage])

  // Caret is the next required index
  const cursor = typedCount

  // Done when all characters are correct
  useEffect(() => {
    setDone(passage.length > 0 && typedCount >= passage.length)
  }, [typedCount, passage.length])

  // Timer tick
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

  const restart = useCallback(() => {
    setChars(Array.from({ length: passage.length }, () => ''))
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

    // If game ended (time or success), any key starts a new game (next passage)
    if (timeUp || done) {
      e.preventDefault()
      next()
      return
    }

    // Start on first key; swallow non-printable first key
    if (!startedAt) {
      if (key.length === 1) {
        setStartedAt(Date.now())
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
      const c = cursor
      // Clear wrong char at cursor, else clear previous committed char
      if (chars[c] && chars[c] !== passage[c]) {
        setChars((arr) => {
          const nextArr = arr.slice()
          nextArr[c] = ''
          return nextArr
        })
      } else if (c > 0) {
        setChars((arr) => {
          const nextArr = arr.slice()
          nextArr[c - 1] = ''
          return nextArr
        })
      }
      return
    }

    if (done || timeUp) return

    if (key.length === 1) {
      e.preventDefault()
      const c = cursor
      const expected = passage[c]
      if (!expected) return
      const isCorrect = key === expected
      setChars((arr) => {
        const nextArr = arr.slice()
        nextArr[c] = key
        return nextArr
      })
      setTotalKeystrokes((n) => n + 1)
      if (isCorrect) setCorrectKeystrokes((n) => n + 1)
      return
    }
  }, [passage, chars, cursor, startedAt, done, timeUp, next, restart])

  const elapsedMinutes = useMemo(() => (elapsedMs || 0) / 60000, [elapsedMs])
  const correctChars = useMemo(() => typedCount, [typedCount])
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
    chars,
    cursor,
    mode,
    progress,
    correctChars,
    totalKeystrokes,
    wpm,
    accuracy,
    elapsedMs,
    status,
    started: !!startedAt,
    remainingMs,
    timeUp,
    restart,
    next,
    onKeyDown,
  }
}

export default useTyping
