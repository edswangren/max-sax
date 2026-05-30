import { useEffect, useRef, useState } from 'react'
import { startClick, stopClick } from '../audio/synth'

type TimeSig = '4/4' | '3/4' | '6/8' | '2/4' | '2/2'

const TIME_SIGS: Array<{ label: string; value: TimeSig; beatsPerMeasure: number }> = [
  { label: '4/4', value: '4/4', beatsPerMeasure: 4 },
  { label: '3/4', value: '3/4', beatsPerMeasure: 3 },
  { label: '2/4', value: '2/4', beatsPerMeasure: 2 },
  { label: '6/8', value: '6/8', beatsPerMeasure: 6 },
  { label: 'cut (2/2)', value: '2/2', beatsPerMeasure: 2 },
]

const MIN_BPM = 40
const MAX_BPM = 240

export default function Metronome() {
  const [bpm, setBpm] = useState(80)
  const [sig, setSig] = useState<TimeSig>('4/4')
  const [running, setRunning] = useState(false)
  const tapTimesRef = useRef<number[]>([])

  // Restart the click on tempo / sig change while running.
  useEffect(() => {
    if (!running) return
    const found = TIME_SIGS.find((t) => t.value === sig) ?? TIME_SIGS[0]
    startClick({ bpm, beatsPerMeasure: found.beatsPerMeasure, accentDownbeat: true })
  }, [bpm, sig, running])

  // Clean up the click on unmount.
  useEffect(() => () => { stopClick() }, [])

  function toggle(): void {
    if (running) {
      stopClick()
      setRunning(false)
      return
    }
    const found = TIME_SIGS.find((t) => t.value === sig) ?? TIME_SIGS[0]
    startClick({ bpm, beatsPerMeasure: found.beatsPerMeasure, accentDownbeat: true })
    setRunning(true)
  }

  function tapTempo(): void {
    const now = performance.now()
    const taps = tapTimesRef.current
    taps.push(now)
    // Drop taps older than 3s
    while (taps.length && now - taps[0] > 3000) taps.shift()
    if (taps.length >= 2) {
      const intervals = []
      for (let i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1])
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const tapped = Math.round(60_000 / avgMs)
      const clamped = Math.max(MIN_BPM, Math.min(MAX_BPM, tapped))
      setBpm(clamped)
    }
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-black mb-1">Metronome</h1>
      <p className="text-cream/70 mb-6 text-sm">Lock the beat. Then play to it.</p>

      <div className="bg-ink-light rounded-2xl border border-ink-lighter p-5 sm:p-6 mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-xs uppercase tracking-wide text-cream/60 font-bold">Tempo</p>
          <p className="text-cream/60 text-xs">{MIN_BPM}–{MAX_BPM} BPM</p>
        </div>
        <p className="text-6xl sm:text-7xl font-black text-brass mb-3 tabular-nums">{bpm}<span className="text-cream/40 text-2xl ml-2 font-bold">BPM</span></p>
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value, 10))}
          className="w-full accent-brass"
          aria-label="Tempo in BPM"
        />
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => setBpm((b) => Math.max(MIN_BPM, b - 1))}
            className="bg-ink border border-ink-lighter text-cream font-bold px-3 py-2 rounded-lg hover:border-white/40 transition-colors"
          >−1</button>
          <button
            type="button"
            onClick={() => setBpm((b) => Math.min(MAX_BPM, b + 1))}
            className="bg-ink border border-ink-lighter text-cream font-bold px-3 py-2 rounded-lg hover:border-white/40 transition-colors"
          >+1</button>
          <button
            type="button"
            onClick={tapTempo}
            className="ml-auto bg-ink border border-ink-lighter text-cream font-bold px-4 py-2 rounded-lg hover:border-white/40 transition-colors"
          >Tap tempo</button>
        </div>
      </div>

      <div className="bg-ink-light rounded-2xl border border-ink-lighter p-5 sm:p-6 mb-6">
        <p className="text-xs uppercase tracking-wide text-cream/60 font-bold mb-3">Time signature</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {TIME_SIGS.map((t) => {
            const active = t.value === sig
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setSig(t.value)}
                className={`px-3 py-3 rounded-xl border-2 font-bold transition-colors ${
                  active
                    ? 'bg-brass text-ink border-brass'
                    : 'bg-ink border-ink-lighter text-cream/80 hover:border-white/40'
                }`}
              >{t.label}</button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        className={`w-full text-xl font-black px-6 py-5 rounded-2xl transition-colors shadow-lg ${
          running
            ? 'bg-maroon text-white hover:bg-maroon/85'
            : 'bg-brass text-ink hover:bg-brass-dim shadow-[0_0_28px_rgba(245,181,15,0.45)]'
        }`}
      >
        {running ? 'STOP' : 'START'}
      </button>
    </div>
  )
}
