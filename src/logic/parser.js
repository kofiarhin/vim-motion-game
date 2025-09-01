// Buffered key parser for hjkl with optional numeric count prefix

const isDigit = (k) => /[0-9]/.test(k)

export function emptyBuffer() {
  return { count: null, op: null }
}

export function displayBuffer(buf) {
  if (buf.count != null && buf.op == null) return `${buf.count}_`
  return ''
}

export function parseKey(buf, key) {
  let ready = false
  let message = ''
  // Escape clears
  if (key === 'Escape') return { buf: emptyBuffer(), ready: false, display: '', message }

  // Counts
  if (isDigit(key)) {
    const n = Number(key)
    if (buf.count == null) {
      if (n === 0) {
        // leading 0: clear buffer to be forgiving
        return { buf: emptyBuffer(), ready: false, display: '', message }
      }
      buf.count = n
    } else {
      buf.count = buf.count * 10 + n
    }
    return { buf, ready, display: displayBuffer(buf), message }
  }

  // Motions hjkl only
  if (key === 'h' || key === 'j' || key === 'k' || key === 'l') {
    buf.op = key
    ready = true
    return { buf, ready, display: displayBuffer(buf), message }
  }

  // Unknown: ignore
  return { buf, ready: false, display: displayBuffer(buf), message }
}

