import { midiToFrequency } from '../utils/music'

// iOS Safari audio routing has TWO layers:
//   1. Web Audio API needs the AudioContext created/resumed inside a user gesture
//      (handled in playSequence + primeForIOS).
//   2. The system audio session itself starts in a muted/ambient mode that
//      Web Audio alone WILL NOT flip. The browser will *appear* to play (you'll
//      even see the speaker indicator in the URL bar) but no sound reaches the
//      speaker. Playing an HTML <audio> element once is what flips the session
//      into the audible playback mode. Until that happens, Web Audio is silent.
//
// installInteractionUnlock() runs both unlocks on the very first user
// interaction anywhere in the app, so by the time the user reaches an
// ear-training drill the system is already audible.

let ctx: AudioContext | null = null
let webAudioUnlocked = false
let interactionListenerInstalled = false

// 44-byte valid empty WAV — used as the iOS audio-session primer.
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='

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

// Plays a silent buffer through the AudioContext — needed alongside resume()
// for older iOS releases that won't actually start ticking otherwise.
function primeWebAudio(c: AudioContext): void {
  if (webAudioUnlocked) return
  webAudioUnlocked = true
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

// Plays a tiny silent HTML <audio> clip — this is what actually flips iOS's
// system audio session from ambient/muted into audible playback.
function primeHTMLAudio(): void {
  try {
    const a = new Audio()
    a.src = SILENT_WAV
    a.muted = false
    a.volume = 0.01
    // play() returns a promise; ignore if blocked
    const p = a.play()
    if (p && typeof p.catch === 'function') p.catch(() => { /* ignore */ })
  } catch {
    /* ignore */
  }
}

/**
 * Installs a one-shot listener that unlocks both Web Audio AND the iOS audio
 * session on the very first user interaction anywhere in the app.
 *
 * Call from app boot. After it fires once, all listeners are torn down.
 */
export function installInteractionUnlock(): void {
  if (interactionListenerInstalled || typeof window === 'undefined') return
  interactionListenerInstalled = true

  const events: Array<keyof DocumentEventMap> = ['touchstart', 'mousedown', 'keydown']

  const handler = () => {
    primeHTMLAudio()
    try {
      const c = getContext()
      if (c.state === 'suspended') c.resume().catch(() => { /* ignore */ })
      primeWebAudio(c)
    } catch {
      /* ignore */
    }
    for (const e of events) document.removeEventListener(e, handler, true)
  }

  for (const e of events) {
    document.addEventListener(e, handler, { capture: true, passive: true })
  }
}

interface PlayNote {
  midi: number
  durationMs: number
}

export type Timbre = 'reed' | 'clean'

export interface PlayOptions {
  gapMs?: number
  timbre?: Timbre
  /** Steady detune in cents (single-oscillator path only). Used by the tuning drill. */
  detuneCents?: number
}

/**
 * Schedule a sequence of notes. Must be invoked inside a user gesture
 * (e.g. an onClick handler). Fully synchronous so the gesture chain stays
 * intact for iOS Safari.
 *
 * Backwards-compatible: second arg may be a number (legacy gapMs).
 */
export function playSequence(notes: PlayNote[], optsOrGap: number | PlayOptions = {}): void {
  const opts: PlayOptions = typeof optsOrGap === 'number' ? { gapMs: optsOrGap } : optsOrGap
  const gapMs = opts.gapMs ?? 30
  const timbre = opts.timbre ?? 'reed'
  const detuneCents = opts.detuneCents ?? 0

  const c = getContext()
  if (c.state === 'suspended') {
    c.resume().catch(() => { /* ignore */ })
  }
  primeWebAudio(c)
  // Belt-and-suspenders: if Play is the very first interaction, also flip
  // the iOS audio session right here.
  primeHTMLAudio()

  let cursor = c.currentTime + 0.08
  for (const n of notes) {
    playOne(c, n.midi, n.durationMs, cursor, timbre, detuneCents)
    cursor += (n.durationMs + gapMs) / 1000
  }
}

function playOne(
  c: AudioContext,
  midi: number,
  durationMs: number,
  startTime: number,
  timbre: Timbre,
  detuneCents: number,
): void {
  const dur = durationMs / 1000

  const gain = c.createGain()
  const peak = timbre === 'clean' ? 0.18 : 0.22
  const a = 0.015, d = 0.09, sLevel = 0.65, r = 0.18
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(peak, startTime + a)
  gain.gain.linearRampToValueAtTime(peak * sLevel, startTime + a + d)
  gain.gain.setValueAtTime(peak * sLevel, startTime + Math.max(a + d, dur))
  gain.gain.linearRampToValueAtTime(0, startTime + Math.max(a + d, dur) + r)
  const stopAt = startTime + Math.max(a + d, dur) + r + 0.02

  if (timbre === 'clean') {
    // Single sine, no filter, no chorus detune. Used for ear-training where
    // any reediness colors the interval. detuneCents = tuning-drill offset.
    const osc = c.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = midiToFrequency(midi)
    if (detuneCents) osc.detune.value = detuneCents
    osc.connect(gain).connect(c.destination)
    osc.start(startTime)
    osc.stop(stopAt)
    return
  }

  // Reed timbre: 2-osc sawtooth + triangle through a lowpass filter.
  const osc = c.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = midiToFrequency(midi)
  if (detuneCents) osc.detune.value = detuneCents

  const osc2 = c.createOscillator()
  osc2.type = 'triangle'
  osc2.frequency.value = midiToFrequency(midi)
  osc2.detune.value = 4 + detuneCents

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 2400
  filter.Q.value = 1.4

  osc.connect(filter)
  osc2.connect(filter)
  filter.connect(gain).connect(c.destination)
  osc.start(startTime)
  osc2.start(startTime)
  osc.stop(stopAt)
  osc2.stop(stopAt)
}
