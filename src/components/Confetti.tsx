import { useMemo } from 'react'

const PALETTE = ['#f5b50f', '#d12932', '#34c97e', '#22d3ee', '#ec4899', '#a855f7', '#fb923c']

// Pure-CSS confetti burst — renders ~40 floating colored shapes that fall + spin.
// One-shot animation; consumer just unmounts when they're done.
export default function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100
      const cx = (Math.random() - 0.5) * 40 // horizontal drift in vw
      const delay = Math.random() * 600
      const duration = 1800 + Math.random() * 1800
      const color = PALETTE[i % PALETTE.length]
      const size = 6 + Math.random() * 8
      const isSquare = Math.random() < 0.5
      return { i, left, cx, delay, duration, color, size, isSquare }
    })
  }, [count])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-40">
      {pieces.map((p) => (
        <div
          key={p.i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isSquare ? 1 : '50%',
            // @ts-expect-error custom CSS prop
            '--cx': `${p.cx}vw`,
            animation: `confetti-fall ${p.duration}ms ${p.delay}ms cubic-bezier(.2,.6,.4,1) forwards`,
          }}
        />
      ))}
    </div>
  )
}
