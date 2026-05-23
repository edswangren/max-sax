import { midiToFrequency } from '../utils/music'

// iOS Safari requires that the AudioContext be created AND resumed AND have
// at least one source scheduled — all inside the same synchronous user-gesture
// tick. `await ctx.resume()` breaks the gesture chain, so this module never
// awaits. We resume fire-and-forget and schedule oscillators a touch in the
// future so they begin cleanly once the context is running.

let ctx: AudioContext | null = null
let unlocked = false

function getContext(): AudioContext {
  if (!ctx) {
    type WithWebkit = { webkitAudioContext?: typeof AudioContext }
    const W = window as Window & WithWebkit
    const Ctor = window.AudioContext || W.webkitAudioContext
    if (!Ctor) throw new Error('Web Audio not supported in this browser')
    ctx = new Ctor()
  }
  return ctx
}

// Plays a 1-sample silent buffer synchronously — the iOS Web Audio unlock pattern.
function primeForIOS(c: AudioContext): void {
  if (unlocked) return
  unlocked = true
  try {
    const buf = c.createBuffer(1, 1, 22050)
    const src = c.createBufferSource()
    src.buffer = buf
    src.connect(c.destination)
    src.start(0)
  } catch {
    /* ignore */
  }
}

interface PlayNote {
  midi: number
  durationMs: number
}

/**
 * Schedule a sequence of notes. Must be invoked inside a user gesture
 * (e.g. an onClick handler) on iOS Safari — see comment at top of file.
 */
export function playSequence(notes: PlayNote[], gapMs = 30): void {
  const c = getContext()
  // Fire-and-forget resume so we don't await across the gesture boundary.
  if (c.state === 'suspended') {
    c.resume().catch(() => { /* ignore */ })
  }
  primeForIOS(c)

  // Small lead-time so the first oscillator starts cleanly once the
  // resume() promise has settled.
  let cursor = c.currentTime + 0.08
  for (const n of notes) {
    playOne(c, n.midi, n.durationMs, cursor)
    cursor += (n.durationMs + gapMs) / 1000
  }
}

function playOne(c: AudioContext, midi: number, durationMs: number, startTime: number): void {
  const dur = durationMs / 1000
  const osc = c.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = midiToFrequency(midi)

  const osc2 = c.createOscillator()
  osc2.type = 'triangle'
  osc2.frequency.value = midiToFrequency(midi)
  osc2.detune.value = 4

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 2400
  filter.Q.value = 1.4

  const gain = c.createGain()
  const peak = 0.22
  const a = 0.015, d = 0.09, sLevel = 0.65, r = 0.18
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peak, startTime + a)
  gain.gain.linearRampToValueAtTime(peak * sLevel, startTime + a + d)
  gain.gain.setValueAtTime(peak * sLevel, startTime + Math.max(a + d, dur))
  gain.gain.linearRampToValueAtTime(0, startTime + Math.max(a + d, dur) + r)

  osc.connect(filter)
  osc2.connect(filter)
  filter.connect(gain).connect(c.destination)
  osc.start(startTime)
  osc2.start(startTime)
  const stopAt = startTime + Math.max(a + d, dur) + r + 0.02
  osc.stop(stopAt)
  osc2.stop(stopAt)
}
