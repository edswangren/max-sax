import { useEffect, useRef, useState } from 'react'
import { startClick, stopClick } from '../audio/synth'
import type { GeneratedProblem } from '../templates/types'

interface Props {
  problem: GeneratedProblem
  onSubmit: (value: string) => void
}

type Phase = 'study' | 'countoff' | 'playing' | 'grade'

const STARS = [
  ['S', 'Sharps/flats — read the key signature'],
  ['T', 'Time — time signature & a steady pulse'],
  ['A', 'Accidentals — any ♯ ♭ ♮ on the notes'],
  ['R', 'Rhythm — scan the tricky beats first'],
  ['S', 'Signs — repeats, dynamics, the road map'],
]

const GRADES: { value: string; label: string; cls: string }[] = [
  { value: 'nailed', label: 'Nailed it', cls: 'border-emerald-go text-emerald-go hover:bg-emerald-go/15' },
  { value: 'slips',  label: 'A few slips', cls: 'border-amber-400 text-amber-400 hover:bg-amber-400/15' },
  { value: 'wreck',  label: 'Train wreck', cls: 'border-maroon text-maroon hover:bg-maroon/15' },
]

export default function PerformPanel({ problem, onSubmit }: Props) {
  const spec = problem.perform!
  const [phase, setPhase] = useState<Phase>('study')
  const [studyLeft, setStudyLeft] = useState(spec.studySeconds)
  const [beatsLeft, setBeatsLeft] = useState(spec.countInBars * spec.beatsPerMeasure)
  const timer = useRef<number | null>(null)

  // Stop the metronome if the panel unmounts mid-flow (e.g. user navigates away).
  useEffect(() => () => stopClick(), [])

  // Study countdown.
  useEffect(() => {
    if (phase !== 'study') return
    if (studyLeft <= 0) { beginCountoff(); return }
    timer.current = window.setTimeout(() => setStudyLeft((s) => s - 1), 1000)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [phase, studyLeft])

  // Count-off beats, synced to the metronome tempo.
  useEffect(() => {
    if (phase !== 'countoff') return
    const tickMs = 60_000 / spec.bpm
    timer.current = window.setInterval(() => {
      setBeatsLeft((b) => {
        if (b <= 1) {
          if (timer.current) clearInterval(timer.current)
          setPhase('playing')
          return 0
        }
        return b - 1
      })
    }, tickMs)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [phase, spec.bpm])

  function beginCountoff() {
    if (timer.current) clearTimeout(timer.current)
    setBeatsLeft(spec.countInBars * spec.beatsPerMeasure)
    startClick({ bpm: spec.bpm, beatsPerMeasure: spec.beatsPerMeasure, accentDownbeat: true })
    setPhase('countoff')
  }

  function donePlaying() {
    stopClick()
    setPhase('grade')
  }

  if (phase === 'study') {
    return (
      <div className="mt-4 bg-ink-light border border-ink-lighter rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-white">Study it (STARS), then play at {spec.bpm} BPM</p>
          <span className="text-brass font-black text-2xl tabular-nums">{studyLeft}</span>
        </div>
        <ul className="space-y-1 mb-4">
          {STARS.map(([k, text], i) => (
            <li key={i} className="text-sm text-cream/80 flex gap-2">
              <span className="text-brass font-black w-4">{k}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={beginCountoff}
          className="w-full bg-brass text-ink font-bold px-6 py-3 rounded-xl hover:bg-brass-dim transition-colors"
        >
          Ready — count me in
        </button>
      </div>
    )
  }

  if (phase === 'countoff') {
    return (
      <div className="mt-4 bg-ink-light border border-brass/40 rounded-xl p-8 text-center">
        <p className="text-cream/70 mb-2">Count-off…</p>
        <p className="text-brass font-black text-6xl tabular-nums animate-pop-in">{beatsLeft}</p>
        <p className="text-cream/50 text-sm mt-2">Come in on the downbeat.</p>
      </div>
    )
  }

  if (phase === 'playing') {
    return (
      <div className="mt-4 bg-ink-light border border-emerald-go/40 rounded-xl p-6 text-center">
        <p className="text-emerald-go font-black text-2xl mb-1 animate-pulse">▶ Play it now</p>
        <p className="text-cream/60 text-sm mb-4">Keep the pulse. Don't stop for mistakes — that's the whole game.</p>
        <button
          onClick={donePlaying}
          className="bg-brass text-ink font-bold px-6 py-3 rounded-xl hover:bg-brass-dim transition-colors"
        >
          Done playing
        </button>
      </div>
    )
  }

  // grade
  return (
    <div className="mt-4">
      <p className="text-center text-white font-bold mb-3">How'd that read go?</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {GRADES.map((g) => (
          <button
            key={g.value}
            onClick={() => onSubmit(g.value)}
            className={`border-2 bg-ink-light font-bold px-4 py-3 rounded-xl transition-all active:scale-[0.98] ${g.cls}`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  )
}
