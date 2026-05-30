import { describe, it, expect } from 'vitest'
import {
  normalizeNoteName,
  noteNameToMidi,
  midiToNoteNameSharp,
  midiToNoteNameFlat,
  midiToFrequency,
  pitchClassToSemitone,
  keySignatureAccidentals,
  majorKeyFromCount,
  buildScale,
  intervalFromMidis,
  normalizeInterval,
  normalizeKeyName,
  concertToWrittenPc,
  concertToWrittenKey,
} from '../utils/music'

describe('normalizeNoteName', () => {
  it('uppercases letter, normalizes accidental, strips octave', () => {
    expect(normalizeNoteName('bb')).toBe('Bb')
    expect(normalizeNoteName('Bb3')).toBe('Bb')
    expect(normalizeNoteName('F#5')).toBe('F#')
    expect(normalizeNoteName('B♭')).toBe('Bb')
    expect(normalizeNoteName('f♯')).toBe('F#')
    expect(normalizeNoteName(' C ')).toBe('C')
  })
})

describe('noteNameToMidi', () => {
  it('round-trips A4 / C4 / known anchors', () => {
    expect(noteNameToMidi('A4')).toBe(69)
    expect(noteNameToMidi('C4')).toBe(60)
    expect(noteNameToMidi('Bb3')).toBe(58)
    expect(noteNameToMidi('F#5')).toBe(78)
    expect(noteNameToMidi('C5')).toBe(72)
  })

  it('handles accidental synonyms', () => {
    expect(noteNameToMidi('Bb3')).toBe(noteNameToMidi('A#3'))
    expect(noteNameToMidi('F#4')).toBe(noteNameToMidi('Gb4'))
  })

  it('returns undefined for garbage', () => {
    expect(noteNameToMidi('zzz')).toBeUndefined()
  })
})

describe('midiToNoteName (sharp/flat)', () => {
  it('produces correct names', () => {
    expect(midiToNoteNameSharp(60)).toBe('C4')
    expect(midiToNoteNameSharp(69)).toBe('A4')
    expect(midiToNoteNameSharp(70)).toBe('A#4')
    expect(midiToNoteNameFlat(70)).toBe('Bb4')
    expect(midiToNoteNameSharp(78)).toBe('F#5')
    expect(midiToNoteNameFlat(78)).toBe('Gb5')
  })

  it('round-trips with noteNameToMidi', () => {
    for (let m = 36; m <= 96; m++) {
      expect(noteNameToMidi(midiToNoteNameSharp(m))).toBe(m)
      expect(noteNameToMidi(midiToNoteNameFlat(m))).toBe(m)
    }
  })
})

describe('midiToFrequency', () => {
  it('A4 = 440 Hz', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 5)
  })
  it('octaves double frequency', () => {
    expect(midiToFrequency(81) / midiToFrequency(69)).toBeCloseTo(2, 5)
  })
})

describe('pitchClassToSemitone', () => {
  it('produces 0..11', () => {
    expect(pitchClassToSemitone('C')).toBe(0)
    expect(pitchClassToSemitone('C#')).toBe(1)
    expect(pitchClassToSemitone('Db')).toBe(1)
    expect(pitchClassToSemitone('B')).toBe(11)
    expect(pitchClassToSemitone('Cb')).toBe(11)
  })
})

describe('keySignatureAccidentals', () => {
  it('returns the right flats/sharps per key', () => {
    expect(keySignatureAccidentals('C major')).toEqual([])
    expect(keySignatureAccidentals('F major')).toEqual(['Bb'])
    expect(keySignatureAccidentals('Bb major')).toEqual(['Bb', 'Eb'])
    expect(keySignatureAccidentals('G major')).toEqual(['F#'])
    expect(keySignatureAccidentals('D major')).toEqual(['F#', 'C#'])
  })
})

describe('majorKeyFromCount', () => {
  it('round-trips with keySignatureAccidentals', () => {
    for (let c = -7; c <= 7; c++) {
      const key = majorKeyFromCount(c)
      const accs = keySignatureAccidentals(key)
      const expected = c === 0 ? 0 : Math.abs(c)
      expect(accs.length).toBe(expected)
    }
  })
})

describe('buildScale', () => {
  it('Bb major is Bb C D Eb F G A', () => {
    expect(buildScale('Bb', 'major')).toEqual(['Bb','C','D','Eb','F','G','A'])
  })
  it('C major is C D E F G A B', () => {
    expect(buildScale('C', 'major')).toEqual(['C','D','E','F','G','A','B'])
  })
  it('D major is D E F# G A B C#', () => {
    expect(buildScale('D', 'major')).toEqual(['D','E','F#','G','A','B','C#'])
  })
  it('A natural minor is A B C D E F G', () => {
    expect(buildScale('A', 'natural-minor')).toEqual(['A','B','C','D','E','F','G'])
  })
  it('E natural minor is E F# G A B C D', () => {
    expect(buildScale('E', 'natural-minor')).toEqual(['E','F#','G','A','B','C','D'])
  })
  it('all major scales have 7 unique letters', () => {
    const roots = ['C','D','E','F','G','A','B','Bb','Eb','Ab','Db','F#']
    for (const r of roots) {
      const scale = buildScale(r, 'major')
      const letters = scale.map((n) => n[0])
      expect(new Set(letters).size).toBe(7)
    }
  })
  it('all natural-minor scales have 7 unique letters', () => {
    const roots = ['A','D','E','G','C','B','F','Bb','Eb','F#','C#']
    for (const r of roots) {
      const scale = buildScale(r, 'natural-minor')
      const letters = scale.map((n) => n[0])
      expect(new Set(letters).size).toBe(7)
    }
  })
})

describe('intervalFromMidis', () => {
  it('names intervals correctly', () => {
    expect(intervalFromMidis(60, 62)).toBe('M2')
    expect(intervalFromMidis(60, 64)).toBe('M3')
    expect(intervalFromMidis(60, 63)).toBe('m3')
    expect(intervalFromMidis(60, 67)).toBe('P5')
    expect(intervalFromMidis(60, 72)).toBe('P8')
    expect(intervalFromMidis(60, 65)).toBe('P4')
    expect(intervalFromMidis(60, 66)).toBe('A4') // tritone
  })
})

describe('normalizeInterval', () => {
  it('canonicalizes various spellings', () => {
    expect(normalizeInterval('M3')).toBe('M3')
    expect(normalizeInterval('m3')).toBe('m3')
    expect(normalizeInterval('Major 3rd')).toBe('M3')
    expect(normalizeInterval('minor 3rd')).toBe('m3')
    expect(normalizeInterval('p5')).toBe('P5')
    expect(normalizeInterval('Perfect 5th')).toBe('P5')
    expect(normalizeInterval('octave')).toBe('P8')
    expect(normalizeInterval('tritone')).toBe('A4')
  })
})

describe('normalizeKeyName', () => {
  it('canonicalizes various spellings', () => {
    expect(normalizeKeyName('bb maj')).toBe('Bb major')
    expect(normalizeKeyName('B♭ major')).toBe('Bb major')
    expect(normalizeKeyName('Bb')).toBe('Bb major')
    expect(normalizeKeyName('g minor')).toBe('G minor')
    expect(normalizeKeyName('gm')).toBe('G minor')
    expect(normalizeKeyName('F# major')).toBe('F# major')
  })
})

describe('concertToWrittenPc / Key', () => {
  it('alto sax reads M6 up from concert', () => {
    // concert Bb → alto reads G
    expect(concertToWrittenPc('Bb', 'alto')).toBe('G')
    // concert Eb → alto reads C
    expect(concertToWrittenPc('Eb', 'alto')).toBe('C')
    // concert F → alto reads D
    expect(concertToWrittenPc('F', 'alto')).toBe('D')
  })
  it('tenor sax reads M2 up from concert (pitch-class wise)', () => {
    // concert Bb → tenor reads C
    expect(concertToWrittenPc('Bb', 'tenor')).toBe('C')
    // concert Eb → tenor reads F
    expect(concertToWrittenPc('Eb', 'tenor')).toBe('F')
    // concert F → tenor reads G
    expect(concertToWrittenPc('F', 'tenor')).toBe('G')
  })
  it('preserves major/minor quality', () => {
    expect(concertToWrittenKey('Bb major', 'alto')).toBe('G major')
    expect(concertToWrittenKey('Bb minor', 'alto')).toBe('G minor')
  })
})
