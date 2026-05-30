/// <reference lib="dom" />
import { describe, it, expect, beforeEach } from 'vitest'

interface FakeOsc {
  type: string
  frequency: { value: number }
  detune: { value: number }
  connect: (...args: unknown[]) => unknown
  start: (...args: unknown[]) => void
  stop: (...args: unknown[]) => void
}

interface FakeFilter {
  type: string
  frequency: { value: number }
  Q: { value: number }
  connect: (...args: unknown[]) => unknown
}

interface FakeGain {
  gain: {
    setValueAtTime: (...args: unknown[]) => void
    linearRampToValueAtTime: (...args: unknown[]) => void
  }
  connect: (...args: unknown[]) => unknown
}

interface FakeCtx {
  state: 'running' | 'suspended'
  currentTime: number
  destination: object
  createOscillator: () => FakeOsc
  createBiquadFilter: () => FakeFilter
  createGain: () => FakeGain
  createBuffer: (...args: unknown[]) => object
  createBufferSource: () => { buffer: unknown; connect: (...args: unknown[]) => void; start: () => void }
  resume: () => Promise<void>
}

const oscillators: FakeOsc[] = []
const filters: FakeFilter[] = []

function makeOsc(): FakeOsc {
  const o: FakeOsc = {
    type: 'sawtooth',
    frequency: { value: 0 },
    detune: { value: 0 },
    connect: () => o,
    start: () => {},
    stop: () => {},
  }
  oscillators.push(o)
  return o
}

function makeFilter(): FakeFilter {
  const f: FakeFilter = {
    type: 'lowpass',
    frequency: { value: 0 },
    Q: { value: 0 },
    connect: () => f,
  }
  filters.push(f)
  return f
}

function makeGain(): FakeGain {
  const g: FakeGain = {
    gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
    connect: () => g,
  }
  return g
}

class FakeAudioContext implements FakeCtx {
  state: 'running' | 'suspended' = 'running'
  currentTime = 0
  destination = {}
  createOscillator = makeOsc
  createBiquadFilter = makeFilter
  createGain = makeGain
  createBuffer = () => ({})
  createBufferSource = () => ({ buffer: null, connect: () => {}, start: () => {} })
  resume = async () => {}
}

beforeEach(() => {
  oscillators.length = 0
  filters.length = 0
  // jsdom-free: install just what synth.ts touches
  ;(globalThis as unknown as { window: object }).window = globalThis
  ;(globalThis as unknown as { document: object }).document = {
    addEventListener: () => {},
    removeEventListener: () => {},
  }
  ;(globalThis as unknown as { AudioContext: typeof FakeAudioContext }).AudioContext = FakeAudioContext
  ;(globalThis as unknown as { Audio: unknown }).Audio = function () {
    return { src: '', muted: false, volume: 0, play: () => Promise.resolve() }
  }
})

describe('playSequence timbre', () => {
  it('reed (default) creates 2 oscillators per note (saw + tri) with a lowpass filter', async () => {
    const { playSequence } = await import('../audio/synth')
    playSequence([{ midi: 60, durationMs: 100 }, { midi: 64, durationMs: 100 }])
    expect(oscillators.length).toBe(4) // 2 per note × 2 notes
    expect(oscillators[0].type).toBe('sawtooth')
    expect(oscillators[1].type).toBe('triangle')
    expect(filters.length).toBe(2)
  })

  it('clean creates 1 sine oscillator per note and no filter', async () => {
    const { playSequence } = await import('../audio/synth')
    playSequence([{ midi: 60, durationMs: 100 }, { midi: 64, durationMs: 100 }], { timbre: 'clean' })
    expect(oscillators.length).toBe(2)
    for (const o of oscillators) {
      expect(o.type).toBe('sine')
    }
    expect(filters.length).toBe(0)
  })

  it('detuneCents flows through to the oscillator', async () => {
    const { playSequence } = await import('../audio/synth')
    playSequence([{ midi: 69, durationMs: 100 }], { timbre: 'clean', detuneCents: 15 })
    expect(oscillators.length).toBe(1)
    expect(oscillators[0].detune.value).toBe(15)
  })
})
