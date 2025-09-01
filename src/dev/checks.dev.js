import { randomSeed } from '../logic/rng'
import { generateMaze, isOpen } from '../logic/maze'
import { emptyBuffer, parseKey } from '../logic/parser'
import { applyMotion, startState } from '../logic/engine'

export function runDevChecks() {
  try {
    const rng = randomSeed(123)
    const m = generateMaze({ rng })
    console.assert(isOpen(m.grid, m.start.r, m.start.c), 'Start should be open')
    console.assert(isOpen(m.grid, m.exit.r, m.exit.c), 'Exit should be open')

    // Parser buffering 3l
    let b = emptyBuffer()
    b = parseKey(b, '3').buf
    const p1 = parseKey(b, 'l')
    console.assert(p1.ready && p1.buf.op === 'l' && p1.buf.count === 3, '3l should be ready with count=3')

    // Engine: stop at wall/edge; invalid first step
    const s0 = startState(m)
    const left = applyMotion(s0, { op: 'h', count: 10 })
    console.assert(left.ok === false || left.state.pos.c >= 1, 'Should not move through left wall')

    console.debug('[dev-checks] OK')
  } catch (e) {
    console.warn('[dev-checks] failed', e)
  }
}

