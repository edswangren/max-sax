import { describe, it, expect } from 'vitest'
import { generateExcerpt, excerptOptionsFor, type ExcerptOptions } from '../utils/music'
import type { Difficulty } from '../templates/types'

const DIFFS: Difficulty[] = ['easy', 'medium', 'hard']
const SAMPLES = 40

const NOTE_TOKEN = /^([A-Ga-g][#bn]?-?\d+)\/(w|h|q|8|16)\.?$/
const REST_TOKEN = /^(w|h|q|8|16)\.?r$/

describe('generateExcerpt invariants', () => {
  for (const d of DIFFS) {
    it(`${d}: every excerpt is well-formed`, () => {
      const opts = excerptOptionsFor(d)
      const beatsPerBar = parseInt((opts.timeSignature ?? '4/4').split('/')[0], 10)
      for (let i = 0; i < SAMPLES; i++) {
        const ex = generateExcerpt(opts)

        // staffNotes tokens all parse (note, rest, or barline)
        for (const tok of ex.staffNotes.split(',')) {
          const ok = tok === '|' || NOTE_TOKEN.test(tok) || REST_TOKEN.test(tok)
          expect(ok, `bad token "${tok}" in "${ex.staffNotes}"`).toBe(true)
        }

        // each bar's durations sum to the meter
        const perBar: number[] = Array(ex.bars).fill(0)
        for (const n of ex.notes) perBar[n.bar] += n.durBeats
        perBar.forEach((sum, bar) =>
          expect(sum, `bar ${bar} sums to ${sum} not ${beatsPerBar} in ${ex.staffNotes}`).toBeCloseTo(beatsPerBar, 5),
        )

        // highest/lowest indices are truly the extremes
        const midis = ex.sounding.map((n) => n.midi)
        expect(ex.sounding[ex.highestIndex].midi).toBe(Math.max(...midis))
        expect(ex.sounding[ex.lowestIndex].midi).toBe(Math.min(...midis))

        // all sounding notes within the requested range
        for (const n of ex.sounding) {
          expect(n.midi).toBeGreaterThanOrEqual(opts.rangeLowMidi ?? 64)
          expect(n.midi).toBeLessThanOrEqual(opts.rangeHighMidi ?? 77)
        }

        // sounding[] index field is contiguous 0..n-1
        ex.sounding.forEach((n, idx) => expect(n.index).toBe(idx))

        // audioSpec matches sounding count
        expect(ex.audioSpec.notes.length).toBe(ex.sounding.length)
      }
    })
  }

  it('range option can reach altissimo without going below low Bb', () => {
    const opts: ExcerptOptions = {
      keys: ['C major'], bars: 2, rhythm: 'plain',
      rangeLowMidi: 58 /* Bb3 */, rangeHighMidi: 96 /* C7 */,
    }
    for (let i = 0; i < 30; i++) {
      for (const n of generateExcerpt(opts).sounding) {
        expect(n.midi).toBeGreaterThanOrEqual(58)
      }
    }
  })
})
