import { midiToFrequency } from '../utils/music'

let ctx: AudioContext | null = null

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

interface PlayNote {
  midi: number
  durationMs: number
}

/** Play a sequence of notes through a reedy-ish synth. Awaits resume() if context is suspended. */
export async function playSequence(notes: PlayNote[], gapMs = 30): Promise<void> {
  const c = getContext()
  if (c.state === 'suspended') {
    try { await c.resume() } catch { /* ignore */ }
  }
  let cursor = c.currentTime + 0.05
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

  // slight detuned partial for a richer reed-like tone
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
