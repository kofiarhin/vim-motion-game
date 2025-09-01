import { useEffect, useState } from 'react'

export default function useViewportCellSize(rows, cols, options = {}) {
  const pad = options.padding ?? 16 // outer padding around the board (px)
  const minSize = options.min ?? 12 // safety floor
  const maxSize = options.max ?? 96 // safety ceiling

  const calc = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const usableW = Math.max(0, vw - pad * 2)
    const usableH = Math.max(0, vh - pad * 2)
    const sizeW = usableW / cols
    const sizeH = usableH / rows
    const size = Math.floor(Math.max(minSize, Math.min(maxSize, Math.min(sizeW, sizeH))))
    return size
  }

  const [cell, setCell] = useState(calc)

  useEffect(() => {
    const onResize = () => setCell(calc())
    window.addEventListener('resize', onResize)
    // Recalculate when dims change
    setCell(calc())
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols, pad, minSize, maxSize])

  return cell // pixels per cell
}

