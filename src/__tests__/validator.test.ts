import { describe, it, expect } from 'vitest'
import { checkAnswer } from '../templates/validator'

describe('checkAnswer — note-name', () => {
  it('accepts case/accidental variants', () => {
    expect(checkAnswer('F#', 'F#', 'note-name')).toBe(true)
    expect(checkAnswer('f#', 'F#', 'note-name')).toBe(true)
    expect(checkAnswer('F♯', 'F#', 'note-name')).toBe(true)
    expect(checkAnswer('Bb', 'Bb', 'note-name')).toBe(true)
    expect(checkAnswer('B♭', 'Bb', 'note-name')).toBe(true)
  })
  it('rejects mismatched pitches', () => {
    expect(checkAnswer('F', 'F#', 'note-name')).toBe(false)
    expect(checkAnswer('Gb', 'F#', 'note-name')).toBe(false)
  })
  it('respects acceptableAnswers override', () => {
    expect(checkAnswer('Gb', 'F#', 'note-name', ['F#', 'Gb'])).toBe(true)
  })
})

describe('checkAnswer — note-sequence', () => {
  it('accepts comma- or space-separated', () => {
    expect(checkAnswer('Bb,C,D,Eb,F,G,A', 'Bb, C, D, Eb, F, G, A', 'note-sequence')).toBe(true)
    expect(checkAnswer('Bb C D Eb F G A', 'Bb, C, D, Eb, F, G, A', 'note-sequence')).toBe(true)
  })
  it('rejects wrong order or wrong notes', () => {
    expect(checkAnswer('C,Bb,D,Eb,F,G,A', 'Bb, C, D, Eb, F, G, A', 'note-sequence')).toBe(false)
    expect(checkAnswer('Bb,C,D,E,F,G,A', 'Bb, C, D, Eb, F, G, A', 'note-sequence')).toBe(false)
  })
})

describe('checkAnswer — interval', () => {
  it('accepts long form', () => {
    expect(checkAnswer('Major 3rd', 'M3', 'interval')).toBe(true)
    expect(checkAnswer('m3', 'm3', 'interval')).toBe(true)
    expect(checkAnswer('Perfect 5th', 'P5', 'interval')).toBe(true)
  })
  it('rejects mismatch', () => {
    expect(checkAnswer('M3', 'm3', 'interval')).toBe(false)
  })
})

describe('checkAnswer — key-name', () => {
  it('accepts various spellings', () => {
    expect(checkAnswer('bb maj', 'Bb major', 'key-name')).toBe(true)
    expect(checkAnswer('B♭', 'Bb major', 'key-name')).toBe(true) // default major
    expect(checkAnswer('Gm', 'G minor', 'key-name')).toBe(true)
  })
})

describe('checkAnswer — integer / multiple-choice / text', () => {
  it('integer', () => {
    expect(checkAnswer('4', '4', 'integer')).toBe(true)
    expect(checkAnswer(' 4 ', '4', 'integer')).toBe(true)
    expect(checkAnswer('5', '4', 'integer')).toBe(false)
  })
  it('multiple-choice ignores case/spaces', () => {
    expect(checkAnswer('forte', 'Forte', 'multiple-choice')).toBe(true)
    expect(checkAnswer('  forte  ', 'forte', 'multiple-choice')).toBe(true)
  })
  it('text', () => {
    expect(checkAnswer('whole note', 'whole note', 'text')).toBe(true)
    expect(checkAnswer('half note', 'whole note', 'text')).toBe(false)
  })
})
