// Music utilities — note/interval/key manipulation
// Scientific pitch notation: C4 = MIDI 60

import type { Difficulty, AudioSpec, Clef } from '../templates/types'

export type PitchClass =
  | 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E'
  | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B'

const LETTER_TO_SEMITONE: Record<string, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
}

const SEMITONE_TO_SHARP: PitchClass[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const SEMITONE_TO_FLAT: PitchClass[] = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']

// ---------- Note name normalization ----------

/** Normalize a pitch class spelling — strips octave, uppercases letter, normalizes accidental. */
export function normalizeNoteName(input: string): string {
  let s = input.trim()
    .replace(/♭/g, 'b')
    .replace(/♯/g, '#')
    .replace(/\s+/g, '')
  if (!s) return ''
  const letter = s[0].toUpperCase()
  const rest = s.slice(1)
  // strip trailing octave digits
  const accidentalMatch = rest.match(/^([#b]?)/)
  const accidental = (accidentalMatch?.[1] ?? '')
  return letter + accidental
}

/** Parse pitch-class string into a semitone 0..11 (or undefined). */
export function pitchClassToSemitone(input: string): number | undefined {
  const n = normalizeNoteName(input)
  const letter = n[0]
  const accidental = n.slice(1)
  const base = LETTER_TO_SEMITONE[letter]
  if (base === undefined) return undefined
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0
  return (base + shift + 12) % 12
}

/** Common enharmonic equivalents for a pitch class. */
export function enharmonicEquivalents(pc: string): string[] {
  const n = normalizeNoteName(pc)
  const map: Record<string, string[]> = {
    'C#': ['Db'], 'Db': ['C#'],
    'D#': ['Eb'], 'Eb': ['D#'],
    'F#': ['Gb'], 'Gb': ['F#'],
    'G#': ['Ab'], 'Ab': ['G#'],
    'A#': ['Bb'], 'Bb': ['A#'],
  }
  return map[n] ?? []
}

// ---------- Scientific pitch / MIDI ----------

/** Parse "C4" / "Bb3" / "F#5" → MIDI. C4 = 60. Returns undefined on parse failure. */
export function noteNameToMidi(input: string): number | undefined {
  const s = input.trim().replace(/♭/g, 'b').replace(/♯/g, '#').replace(/\s+/g, '')
  const m = s.match(/^([A-Ga-g])([#b]?)(-?\d+)$/)
  if (!m) return undefined
  const letter = m[1].toUpperCase()
  const accidental = m[2]
  const octave = parseInt(m[3], 10)
  const base = LETTER_TO_SEMITONE[letter]
  if (base === undefined) return undefined
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0
  return (octave + 1) * 12 + base + shift
}

/** MIDI → "C4" using sharps. */
export function midiToNoteNameSharp(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const pc = SEMITONE_TO_SHARP[midi % 12]
  return `${pc}${octave}`
}

/** MIDI → "C4" using flats. */
export function midiToNoteNameFlat(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const pc = SEMITONE_TO_FLAT[midi % 12]
  return `${pc}${octave}`
}

/** MIDI → frequency Hz (A4 = MIDI 69 = 440 Hz). */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// ---------- Key signatures ----------

/** Major key → list of accidentals as pitch classes (e.g. "Bb major" → ["Bb","Eb"]). */
export function keySignatureAccidentals(key: string): string[] {
  const n = normalizeKeyName(key)
  const flatKeys: Record<string, string[]> = {
    'C major': [],
    'F major': ['Bb'],
    'Bb major': ['Bb','Eb'],
    'Eb major': ['Bb','Eb','Ab'],
    'Ab major': ['Bb','Eb','Ab','Db'],
    'Db major': ['Bb','Eb','Ab','Db','Gb'],
    'Gb major': ['Bb','Eb','Ab','Db','Gb','Cb'],
    'Cb major': ['Bb','Eb','Ab','Db','Gb','Cb','Fb'],
  }
  const sharpKeys: Record<string, string[]> = {
    'G major': ['F#'],
    'D major': ['F#','C#'],
    'A major': ['F#','C#','G#'],
    'E major': ['F#','C#','G#','D#'],
    'B major': ['F#','C#','G#','D#','A#'],
    'F# major': ['F#','C#','G#','D#','A#','E#'],
    'C# major': ['F#','C#','G#','D#','A#','E#','B#'],
  }
  return flatKeys[n] ?? sharpKeys[n] ?? []
}

/** VexFlow key signature spec for a major key — e.g. "Bb", "F#", "C". */
export function vexKeySignature(key: string): string {
  const n = normalizeKeyName(key).replace(/ major$/, '').replace(/ minor$/, '')
  return n
}

/** Count of flats/sharps for a major key. Positive = sharps, negative = flats. */
export function keySignatureCount(key: string): number {
  const accs = keySignatureAccidentals(key)
  if (accs.length === 0) return 0
  return accs[0].endsWith('b') ? -accs.length : accs.length
}

/** Major key from accidental count. */
export function majorKeyFromCount(count: number): string {
  const sharp = ['C','G','D','A','E','B','F#','C#']
  const flat = ['C','F','Bb','Eb','Ab','Db','Gb','Cb']
  if (count >= 0 && count <= 7) return `${sharp[count]} major`
  if (count < 0 && count >= -7) return `${flat[-count]} major`
  return 'C major'
}

// ---------- Scales ----------

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
const NATURAL_MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10]

const SHARP_KEYS = new Set(['G','D','A','E','B','F#','C#'])

/** Build a 7-note scale starting at the given pitch class. Uses correct accidental spellings. */
export function buildScale(root: string, type: 'major' | 'natural-minor' = 'major'): string[] {
  const intervals = type === 'major' ? MAJOR_INTERVALS : NATURAL_MINOR_INTERVALS
  const rootPc = normalizeNoteName(root)
  const rootSemi = pitchClassToSemitone(rootPc)
  if (rootSemi === undefined) return []
  // Choose letter-cycle so each scale degree uses a unique letter
  const letterOrder = ['C','D','E','F','G','A','B']
  const rootLetter = rootPc[0]
  const startIdx = letterOrder.indexOf(rootLetter)
  const out: string[] = []
  for (let i = 0; i < 7; i++) {
    const expectedSemi = (rootSemi + intervals[i]) % 12
    const letter = letterOrder[(startIdx + i) % 7]
    const naturalSemi = LETTER_TO_SEMITONE[letter]
    let diff = (expectedSemi - naturalSemi + 12) % 12
    if (diff > 6) diff -= 12 // prefer flats over sharps when distance > 6
    let spelling: string
    if (diff === 0) spelling = letter
    else if (diff === 1) spelling = letter + '#'
    else if (diff === -1) spelling = letter + 'b'
    else if (diff === 2) spelling = letter + '##' // double sharp — rare
    else if (diff === -2) spelling = letter + 'bb' // double flat — rare
    else spelling = letter
    out.push(spelling)
  }
  return out
}

/** Choose major-vs-flat spelling appropriate for the root. */
export function preferredAccidentalForRoot(root: string): 'sharp' | 'flat' {
  const n = normalizeNoteName(root)
  if (n.endsWith('b')) return 'flat'
  if (n.endsWith('#')) return 'sharp'
  return SHARP_KEYS.has(n) ? 'sharp' : 'flat'
}

// ---------- Intervals ----------

const INTERVAL_BY_SEMITONE: Record<number, string> = {
  0: 'P1',
  1: 'm2', 2: 'M2',
  3: 'm3', 4: 'M3',
  5: 'P4',
  6: 'A4', // also d5 — defaults to A4
  7: 'P5',
  8: 'm6', 9: 'M6',
  10: 'm7', 11: 'M7',
  12: 'P8',
}

const INTERVAL_NAMES: Record<string, string> = {
  P1: 'Perfect Unison', m2: 'Minor 2nd', M2: 'Major 2nd',
  m3: 'Minor 3rd', M3: 'Major 3rd', P4: 'Perfect 4th',
  A4: 'Augmented 4th', d5: 'Diminished 5th',
  P5: 'Perfect 5th', m6: 'Minor 6th', M6: 'Major 6th',
  m7: 'Minor 7th', M7: 'Major 7th', P8: 'Octave',
}

/** Interval between two MIDI notes as short name (e.g. "M3"). Direction-agnostic. */
export function intervalFromMidis(a: number, b: number): string {
  const semi = Math.abs(b - a) % 12
  const isOctave = Math.abs(b - a) === 12
  if (isOctave) return 'P8'
  return INTERVAL_BY_SEMITONE[semi] ?? 'P1'
}

/** Long form of an interval short name. */
export function intervalLongName(short: string): string {
  return INTERVAL_NAMES[normalizeInterval(short)] ?? short
}

/** Normalize an interval string. Accepts short ("M3", "p5") and long ("Major 3rd"). */
export function normalizeInterval(input: string): string {
  const raw = input.trim().replace(/\s+/g, ' ')
  if (!raw) return ''

  // short form: m3, M3, P5, A4, d5 — case-sensitive on quality letter
  const shortMatch = raw.match(/^([mMpPaAdD])(\d+)$/)
  if (shortMatch) {
    const q = shortMatch[1]
    const n = shortMatch[2]
    // Major = uppercase M; minor = lowercase m; perfect/augmented/diminished have one canonical case
    const qNorm = q === 'M' ? 'M'
      : q === 'm' ? 'm'
      : q.toLowerCase() === 'p' ? 'P'
      : q.toLowerCase() === 'a' ? 'A'
      : 'd'
    return `${qNorm}${n}`
  }

  const s = raw.toLowerCase()
  const longMap: Record<string, string> = {
    'unison': 'P1', 'perfect unison': 'P1',
    'minor 2nd': 'm2', 'minor second': 'm2', 'half step': 'm2', 'halfstep': 'm2', 'semitone': 'm2',
    'major 2nd': 'M2', 'major second': 'M2', 'whole step': 'M2', 'wholestep': 'M2', 'whole tone': 'M2',
    'minor 3rd': 'm3', 'minor third': 'm3',
    'major 3rd': 'M3', 'major third': 'M3',
    'perfect 4th': 'P4', 'perfect fourth': 'P4', 'fourth': 'P4',
    'augmented 4th': 'A4', 'tritone': 'A4', 'aug 4': 'A4', 'aug4': 'A4',
    'diminished 5th': 'd5', 'dim 5': 'd5', 'dim5': 'd5',
    'perfect 5th': 'P5', 'perfect fifth': 'P5', 'fifth': 'P5',
    'minor 6th': 'm6', 'minor sixth': 'm6',
    'major 6th': 'M6', 'major sixth': 'M6',
    'minor 7th': 'm7', 'minor seventh': 'm7',
    'major 7th': 'M7', 'major seventh': 'M7',
    'octave': 'P8', 'perfect octave': 'P8', '8ve': 'P8',
  }
  return longMap[s] ?? s
}

// ---------- Key names ----------

/** Normalize "bb maj" / "B♭ Major" / "Bb" → "Bb major". */
export function normalizeKeyName(input: string): string {
  let s = input.trim().replace(/♭/g, 'b').replace(/♯/g, '#').replace(/\s+/g, ' ').toLowerCase()
  if (!s) return ''
  const m = s.match(/^([a-g])([#b]?)\s*(maj|major|min|minor|m|nat\s*min|natural\s*minor)?$/i)
  if (!m) return s
  const letter = m[1].toUpperCase()
  const accidental = m[2]
  const qualityRaw = (m[3] ?? '').toLowerCase().replace(/\s+/g, '')
  const isMinor = qualityRaw === 'min' || qualityRaw === 'minor' || qualityRaw === 'm' || qualityRaw === 'natmin' || qualityRaw === 'naturalminor'
  const quality = isMinor ? 'minor' : 'major'
  return `${letter}${accidental} ${quality}`
}

// ---------- Triads ----------

export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented'

/** Semitone intervals from root for a triad in root position. */
export function triadIntervals(quality: TriadQuality): [number, number, number] {
  switch (quality) {
    case 'major':       return [0, 4, 7]
    case 'minor':       return [0, 3, 7]
    case 'diminished':  return [0, 3, 6]
    case 'augmented':   return [0, 4, 8]
  }
}

// ---------- Relative / parallel keys ----------

// Hardcoded relative-key pairs match conventional spelling (e.g. G minor ↔ Bb
// major, not A# major). Computing by semitone shift gets the pitch right but
// not always the spelling musicians expect.
const RELATIVE_PAIRS: Array<[string, string]> = [
  ['C major', 'A minor'],
  ['G major', 'E minor'],
  ['D major', 'B minor'],
  ['A major', 'F# minor'],
  ['E major', 'C# minor'],
  ['B major', 'G# minor'],
  ['F# major', 'D# minor'],
  ['C# major', 'A# minor'],
  ['F major', 'D minor'],
  ['Bb major', 'G minor'],
  ['Eb major', 'C minor'],
  ['Ab major', 'F minor'],
  ['Db major', 'Bb minor'],
  ['Gb major', 'Eb minor'],
  ['Cb major', 'Ab minor'],
]

const MAJOR_TO_MINOR = new Map(RELATIVE_PAIRS)
const MINOR_TO_MAJOR = new Map(RELATIVE_PAIRS.map(([maj, min]) => [min, maj] as const))

/** Relative minor of a major key. "Bb major" → "G minor". */
export function relativeMinor(majorKey: string): string {
  const n = normalizeKeyName(majorKey)
  return MAJOR_TO_MINOR.get(n) ?? n
}

/** Relative major of a natural-minor key. "G minor" → "Bb major". */
export function relativeMajor(minorKey: string): string {
  const n = normalizeKeyName(minorKey)
  return MINOR_TO_MAJOR.get(n) ?? n
}

// ---------- Chromatic ----------

/** Next chromatic note from a pitch class. Direction-aware, with letter-conventional spelling. */
export function chromaticNext(pc: string, direction: 'up' | 'down'): string {
  const semi = pitchClassToSemitone(pc)
  if (semi === undefined) return pc
  const next = (semi + (direction === 'up' ? 1 : 11)) % 12
  // Ascending → prefer sharps; descending → prefer flats. Convention.
  return direction === 'up' ? SEMITONE_TO_SHARP[next] : SEMITONE_TO_FLAT[next]
}

/** Apply a major key signature to a natural letter — "F" in "G major" → "F#". */
export function applyKeySignatureToLetter(letter: string, majorKey: string): string {
  const L = letter[0].toUpperCase()
  const accs = keySignatureAccidentals(majorKey)
  const match = accs.find((a) => a[0] === L)
  return match ?? L
}

// ---------- Melodic phrase generation ----------

export type PhraseShape = 'step-up' | 'step-down' | 'arpeggio' | 'neighbor' | 'leap-step'

export interface PhraseNote {
  name: string      // pitch class, e.g. 'Bb'
  spec: string      // staff spec, e.g. 'B4' (no accidental if key sig already covers it)
  midi: number      // for highest/lowest comparisons
}

export interface Phrase {
  notes: PhraseNote[]
  shape: PhraseShape
  key: string
}

const LETTER_CYCLE = ['C','D','E','F','G','A','B']

// Degree offsets per shape — degree 0 is the start scale-degree we pick.
const SHAPE_OFFSETS: Record<PhraseShape, number[]> = {
  'step-up':   [0, 1, 2, 3],
  'step-down': [0, -1, -2, -3],
  'arpeggio':  [0, 2, 4, 7],   // 1-3-5-8
  'neighbor':  [0, 1, 0, -1],
  'leap-step': [0, 4, 3, 2],
}

// Per-shape valid starting scale degrees (0-indexed; 0 = tonic).
// Constrained so the resulting phrase stays in roughly MIDI 55–82 from the root.
const SHAPE_STARTS: Record<PhraseShape, number[]> = {
  'step-up':   [0, 1, 2, 3, 4],
  'step-down': [3, 4, 5, 6, 7],
  'arpeggio':  [0, 1, 2],
  'neighbor':  [1, 2, 3, 4, 5],
  'leap-step': [0, 1, 2, 3],
}

// Default starting octave for the root — keeps natural-letter roots in the
// treble staff range. Flat roots (Bb, Eb) still spell cleanly at octave 4.
const PHRASE_ROOT_OCTAVE = 4

/** Generate a melodic phrase in the given key + shape. Length is fixed at 4 notes. */
export function generatePhrase(key: string, shape: PhraseShape, startDegreeOverride?: number): Phrase {
  const root = key.replace(/ major$/, '').replace(/ minor$/, '')
  const scale = buildScale(root, 'major')   // e.g. ['Bb','C','D','Eb','F','G','A']
  const rootLetter = root[0].toUpperCase()
  const rootOctave = PHRASE_ROOT_OCTAVE
  const rootMidi = noteNameToMidi(`${root}${rootOctave}`) ?? 60

  const validStarts = SHAPE_STARTS[shape]
  const startDegree = startDegreeOverride ?? validStarts[Math.floor(Math.random() * validStarts.length)]
  const offsets = SHAPE_OFFSETS[shape]

  const notes: PhraseNote[] = offsets.map((off) => {
    const d = startDegree + off
    const noteIdx = ((d % 7) + 7) % 7
    const noteName = scale[noteIdx]
    const startIdx = LETTER_CYCLE.indexOf(rootLetter)
    const absIdx = startIdx + d
    const octave = rootOctave + Math.floor(absIdx / 7)
    const spec = specForKey(noteName, octave, key)
    // Compute midi from the pitch class + octave (handle accidentals).
    const midi = noteNameToMidi(`${noteName}${octave}`) ?? rootMidi
    return { name: noteName, spec, midi }
  })

  return { notes, shape, key }
}

/** Build a staff note spec, omitting accidentals already implied by the key sig. */
function specForKey(noteName: string, octave: number, key: string): string {
  const accs = keySignatureAccidentals(key)
  const letter = noteName[0]
  const accInKey = accs.find((a) => a[0] === letter)
  if (accInKey && accInKey === noteName) return `${letter}${octave}`
  return `${noteName}${octave}`
}

// ---------- Multi-bar excerpt generator (sight reading) ----------

export type RhythmComplexity = 'plain' | 'mixed' | 'syncopated'

export interface ExcerptOptions {
  keys: string[]
  bars: number
  timeSignature?: string          // default '4/4'
  rhythm: RhythmComplexity
  rangeLowMidi?: number
  rangeHighMidi?: number
  leapMax?: number                // max semitone jump between consecutive notes
  accidentalDensity?: number      // 0..1 chance the excerpt carries one chromatic accidental
  clef?: Clef
  refBpm?: number                 // tempo for audioSpec playback (default 80)
}

export interface ExcerptNote {
  name: string        // pitch class, e.g. 'Bb' / 'F#'
  spec: string        // staff token pitch, e.g. 'B4' (accidental omitted if in key sig)
  midi: number
  durBeats: number
  durCode: string     // 'q', 'h', 'q.', '8' ...
  bar: number         // 0-indexed
  beat: number        // 1-based beat position within the bar
  isRest: boolean
  altered: boolean    // explicit (non-key) accidental drawn on this note
  index: number       // index among SOUNDING notes (rests excluded); -1 for rests
}

export interface Excerpt {
  key: string
  timeSignature: string
  bars: number
  notes: ExcerptNote[]      // includes rests
  sounding: ExcerptNote[]   // notes only, in order
  staffNotes: string        // ready for StaffSpec.notes (with | / rest / dot tokens)
  vexKey: string
  width: number
  highestIndex: number      // into sounding
  lowestIndex: number
  accidentalCount: number   // printed accidentals (explicit, drawn on notes)
  alteredIndex: number      // index into sounding of the chromatic note, or -1
  audioSpec: AudioSpec
}

const DUR_BEATS: Record<string, number> = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25 }

interface Slot { base: string; dotted: boolean; isRest: boolean; beats: number }

function parseSlot(tok: string): Slot {
  const isRest = tok.endsWith('r')
  const core = isRest ? tok.slice(0, -1) : tok
  const dotted = core.endsWith('.')
  const base = dotted ? core.slice(0, -1) : core
  const beats = DUR_BEATS[base] * (dotted ? 1.5 : 1)
  return { base, dotted, isRest, beats }
}

// Per-bar rhythm banks (4/4, each row sums to 4 beats).
const RHYTHM_BANK: Record<RhythmComplexity, string[][]> = {
  plain: [
    ['q', 'q', 'q', 'q'],
    ['h', 'q', 'q'],
    ['q', 'q', 'h'],
    ['h', 'h'],
    ['q', 'h', 'q'],
    ['w'],
  ],
  mixed: [
    ['q', '8', '8', 'q', 'q'],
    ['8', '8', 'q', 'q', 'q'],
    ['q', 'q', '8', '8', 'q'],
    ['q.', '8', 'q', 'q'],
    ['q', 'q', 'q', 'qr'],
    ['h', '8', '8', 'q'],
    ['8', '8', '8', '8', 'h'],
  ],
  syncopated: [
    ['8', 'q', '8', 'q', 'q'],
    ['8', '8', '8', '8', '8', '8', '8', '8'],
    ['q.', '8', '8', '8', 'q'],
    ['16', '16', '8', 'q', 'q', 'q'],
    ['8r', '8', 'q', 'q', 'q'],
    ['q', '8', '8', '8', '8', 'q'],
    ['8', '8', 'q', '8r', '8', 'q'],
  ],
}

interface RawNote { name: string; spec: string; midi: number; altered: boolean }

function noteAtDegree(
  deg: number, scale: string[], rootLetter: string, rootOctave: number, key: string, alter = 0,
): RawNote {
  const noteName = scale[((deg % 7) + 7) % 7]
  const startIdx = LETTER_CYCLE.indexOf(rootLetter)
  const octave = rootOctave + Math.floor((startIdx + deg) / 7)
  if (alter === 0) {
    const spec = specForKey(noteName, octave, key)
    return { name: noteName, spec, midi: noteNameToMidi(`${noteName}${octave}`) ?? 60, altered: false }
  }
  // Chromatic alteration → explicit accidental (used by sr-in-context).
  const letter = noteName[0]
  const acc = noteName.slice(1)
  let newName = noteName
  if (alter > 0) newName = acc === 'b' ? letter : acc === '' ? letter + '#' : noteName
  else newName = acc === '#' ? letter : acc === '' ? letter + 'b' : noteName
  if (newName === noteName) {
    const spec = specForKey(noteName, octave, key)
    return { name: noteName, spec, midi: noteNameToMidi(`${noteName}${octave}`) ?? 60, altered: false }
  }
  const keyAltersLetter = keySignatureAccidentals(key).some((a) => a[0] === letter)
  const newAcc = newName.slice(1)
  const specAcc = newAcc === '' && keyAltersLetter ? 'n' : newAcc
  return {
    name: newName,
    spec: `${letter}${specAcc}${octave}`,
    midi: noteNameToMidi(`${newName}${octave}`) ?? 60,
    altered: true,
  }
}

/** Generate a musically valid multi-bar melodic excerpt for sight-reading drills. */
export function generateExcerpt(opts: ExcerptOptions): Excerpt {
  const timeSignature = opts.timeSignature ?? '4/4'
  const key = opts.keys[Math.floor(Math.random() * opts.keys.length)]
  const root = key.replace(/ major$/, '').replace(/ minor$/, '')
  const scale = buildScale(root, 'major')
  const rootLetter = root[0].toUpperCase()
  const low = opts.rangeLowMidi ?? SAX_RANGE.STAFF_BOTTOM
  const high = opts.rangeHighMidi ?? SAX_RANGE.STAFF_TOP
  const leapMax = opts.leapMax ?? 7
  const refBpm = opts.refBpm ?? 80

  // Find a starting octave so the tonic-region degrees sit inside the range.
  let rootOctave = PHRASE_ROOT_OCTAVE
  for (let o = 2; o <= 7; o++) {
    const m = noteNameToMidi(`${root}${o}`)
    if (m != null && m >= low && m <= (low + high) / 2 + 2) { rootOctave = o; break }
  }

  const inRange = (deg: number) => {
    const m = noteAtDegree(deg, scale, rootLetter, rootOctave, key).midi
    return m >= low && m <= high
  }

  // Choose a start degree near the centre of the range.
  const mid = (low + high) / 2
  const starts: { deg: number; dist: number }[] = []
  for (let d = -14; d <= 21; d++) {
    if (!inRange(d)) continue
    const m = noteAtDegree(d, scale, rootLetter, rootOctave, key).midi
    starts.push({ deg: d, dist: Math.abs(m - mid) })
  }
  starts.sort((a, b) => a.dist - b.dist)
  const startPool = starts.slice(0, Math.min(5, starts.length))
  let deg = startPool.length ? startPool[Math.floor(Math.random() * startPool.length)].deg : 0

  // Build rhythm: one bank row per bar.
  const bank = RHYTHM_BANK[opts.rhythm]
  const slots: { slot: Slot; bar: number; beat: number }[] = []
  for (let bar = 0; bar < opts.bars; bar++) {
    const row = bank[Math.floor(Math.random() * bank.length)]
    let beat = 1
    for (const tok of row) {
      const slot = parseSlot(tok)
      slots.push({ slot, bar, beat })
      beat += slot.beats
    }
  }

  // Walk degrees for the sounding slots.
  const STEP_CHOICES = [-2, -1, -1, 1, 1, 2]
  const LEAP_CHOICES = [-4, -3, 3, 4]
  const notes: ExcerptNote[] = []
  let soundingIdx = 0
  let first = true
  let prevMidi = noteAtDegree(deg, scale, rootLetter, rootOctave, key).midi
  for (const { slot, bar, beat } of slots) {
    if (slot.isRest) {
      notes.push({
        name: '', spec: '', midi: 0, durBeats: slot.beats,
        durCode: slot.base + (slot.dotted ? '.' : ''),
        bar, beat, isRest: true, altered: false, index: -1,
      })
      continue
    }
    if (!first) {
      const useLeap = Math.random() < 0.2 && leapMax >= 3
      const pool = useLeap ? [...LEAP_CHOICES, ...STEP_CHOICES] : STEP_CHOICES
      const valid = pool.filter((step) => {
        const nd = deg + step
        if (!inRange(nd)) return false
        const m = noteAtDegree(nd, scale, rootLetter, rootOctave, key).midi
        return Math.abs(m - prevMidi) <= leapMax
      })
      const choices = valid.length ? valid : STEP_CHOICES.filter((s) => inRange(deg + s))
      const step = choices.length ? choices[Math.floor(Math.random() * choices.length)] : 0
      deg += step
    }
    first = false
    const rn = noteAtDegree(deg, scale, rootLetter, rootOctave, key)
    prevMidi = rn.midi
    notes.push({
      name: rn.name, spec: rn.spec, midi: rn.midi, durBeats: slot.beats,
      durCode: slot.base + (slot.dotted ? '.' : ''),
      bar, beat, isRest: false, altered: false, index: soundingIdx++,
    })
  }

  // Optionally inject one chromatic accidental on an interior sounding note.
  let alteredSoundingIndex = -1
  if (opts.accidentalDensity && Math.random() < opts.accidentalDensity) {
    const interior = notes.filter((n) => !n.isRest && n.index > 0)
    if (interior.length) {
      const target = interior[Math.floor(Math.random() * interior.length)]
      // Recover the degree of this note isn't tracked; alter via re-spelling from its name.
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
      const altered = alterSpelling(target, key, dir, low, high)
      if (altered) {
        target.name = altered.name
        target.spec = altered.spec
        target.midi = altered.midi
        target.altered = true
        alteredSoundingIndex = target.index
      }
    }
  }

  // Assemble staffNotes (tokens + barlines).
  const tokens: string[] = []
  let curBar = 0
  for (const n of notes) {
    if (n.bar !== curBar) { tokens.push('|'); curBar = n.bar }
    if (n.isRest) tokens.push(`${n.durCode}r`)
    else tokens.push(`${n.spec}/${n.durCode}`)
  }
  const staffNotes = tokens.join(',')

  const sounding = notes.filter((n) => !n.isRest)
  let highestIndex = 0, lowestIndex = 0
  sounding.forEach((n, i) => {
    if (n.midi > sounding[highestIndex].midi) highestIndex = i
    if (n.midi < sounding[lowestIndex].midi) lowestIndex = i
  })
  const accidentalCount = sounding.filter((n) => /[#bn]/.test(n.spec.replace(/-?\d+$/, ''))).length

  const audioSpec: AudioSpec = {
    notes: sounding.map((n) => ({ midi: n.midi, durationMs: Math.round(n.durBeats * (60000 / refBpm)) })),
    timbre: 'reed',
    gapMs: 0,
  }

  return {
    key, timeSignature, bars: opts.bars, notes, sounding, staffNotes,
    vexKey: vexKeySignature(key),
    width: Math.min(720, 130 + opts.bars * 120),
    highestIndex, lowestIndex, accidentalCount,
    alteredIndex: alteredSoundingIndex, audioSpec,
  }
}

/** Re-spell an already-placed note up/down a semitone with an explicit accidental. */
function alterSpelling(
  n: ExcerptNote, key: string, dir: 1 | -1, low: number, high: number,
): { name: string; spec: string; midi: number } | null {
  const letter = n.name[0]
  const acc = n.name.slice(1)
  let newName = n.name
  if (dir > 0) newName = acc === 'b' ? letter : acc === '' ? letter + '#' : n.name
  else newName = acc === '#' ? letter : acc === '' ? letter + 'b' : n.name
  if (newName === n.name) return null
  const octave = parseInt(n.spec.match(/-?\d+$/)?.[0] ?? '4', 10)
  const midi = noteNameToMidi(`${newName}${octave}`)
  if (midi == null || midi < low || midi > high) return null
  const keyAltersLetter = keySignatureAccidentals(key).some((a) => a[0] === letter)
  const newAcc = newName.slice(1)
  const specAcc = newAcc === '' && keyAltersLetter ? 'n' : newAcc
  return { name: newName, spec: `${letter}${specAcc}${octave}`, midi }
}

/** Difficulty → excerpt options. Topics may override individual fields. */
export function excerptOptionsFor(d: Difficulty): ExcerptOptions {
  if (d === 'easy') {
    return {
      keys: ['C major', 'F major', 'G major'], bars: 2, rhythm: 'plain', leapMax: 4,
      rangeLowMidi: SAX_RANGE.STAFF_BOTTOM, rangeHighMidi: SAX_RANGE.STAFF_TOP,
    }
  }
  if (d === 'medium') {
    return {
      keys: ['C major', 'F major', 'G major', 'Bb major', 'Eb major', 'D major'], bars: 3,
      rhythm: 'mixed', leapMax: 7, accidentalDensity: 0.15,
      rangeLowMidi: SAX_RANGE.LOW_C, rangeHighMidi: SAX_RANGE.PALM_D,
    }
  }
  return {
    keys: ['Bb major', 'Eb major', 'Ab major', 'A major', 'E major'], bars: 4,
    rhythm: 'syncopated', leapMax: 12, accidentalDensity: 0.3,
    rangeLowMidi: SAX_RANGE.LOW_BB, rangeHighMidi: SAX_RANGE.PALM_F_SHARP,
  }
}

// ---------- Order of accidentals (sharps + flats) ----------

export const ORDER_OF_SHARPS: string[] = ['F#','C#','G#','D#','A#','E#','B#']
export const ORDER_OF_FLATS:  string[] = ['Bb','Eb','Ab','Db','Gb','Cb','Fb']

// ---------- Sax range ----------

/** Standard written sax range — low Bb (Bb3) to palm F# (F#6). Altissimo extends higher. */
export const SAX_RANGE = {
  LOW_BB: 58,        // Bb3
  LOW_C: 60,         // C4
  STAFF_BOTTOM: 64,  // E4 (bottom line of treble staff)
  STAFF_TOP: 77,     // F5 (top line of treble staff)
  PALM_D: 86,        // D6
  PALM_F_SHARP: 90,  // F#6
  ALTISSIMO_G: 91,   // G6
}

/** Concert pitch transposition: returns the MIDI offset to ADD to concert pitch to get written sax pitch. */
export function transpositionOffset(instrument: 'alto' | 'tenor'): number {
  // Alto sax (Eb): written sounds a major 6th lower → written = concert + 9
  // Tenor sax (Bb): written sounds a major 9th lower → written = concert + 14
  return instrument === 'alto' ? 9 : 14
}

/** What pitch class does the sax player READ when the band plays this concert pitch? */
export function concertToWrittenPc(concertPc: string, instrument: 'alto' | 'tenor'): string {
  const semi = pitchClassToSemitone(concertPc)
  if (semi === undefined) return concertPc
  const newSemi = (semi + transpositionOffset(instrument)) % 12
  // Use flat spelling for flat instruments (alto/tenor are both flat-friendly)
  return SEMITONE_TO_FLAT[newSemi]
}

/** What KEY does the sax player read when the band plays this concert key? */
export function concertToWrittenKey(concertKey: string, instrument: 'alto' | 'tenor'): string {
  const n = normalizeKeyName(concertKey)
  const isMinor = n.endsWith('minor')
  const rootMatch = n.match(/^([A-G][#b]?)/)
  if (!rootMatch) return concertKey
  const written = concertToWrittenPc(rootMatch[1], instrument)
  return `${written} ${isMinor ? 'minor' : 'major'}`
}
