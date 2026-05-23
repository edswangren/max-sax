// Standard saxophone fingerings — same for alto and tenor (identical key layout).
// Boolean flags = key pressed. All notes use scientific pitch (written, not concert).

export interface KeyState {
  // Octave key (left thumb)
  octave?: boolean

  // Left-hand main pearls (top of horn, played by left hand)
  leftIndex?: boolean    // B key  (top pearl)
  leftMiddle?: boolean   // A key  (middle pearl)
  leftRing?: boolean     // G key  (bottom pearl)

  // Bis Bb (small key between left index and left middle)
  bis?: boolean

  // Right-hand main pearls (lower body)
  rightIndex?: boolean   // F key  (top pearl)
  rightMiddle?: boolean  // E key  (middle pearl)
  rightRing?: boolean    // D key  (bottom pearl)

  // Side keys (operated by right index/side of hand)
  sideBb?: boolean       // side Bb
  sideC?: boolean        // side C
  sideHighE?: boolean    // side high E (often used for trills)
  highFSharp?: boolean   // high F# key (right index side or auxiliary)

  // Left palm keys (operated by heel of left hand)
  palmD?: boolean
  palmEb?: boolean
  palmF?: boolean

  // Left pinky cluster (rollers)
  leftPinkyLowBb?: boolean
  leftPinkyLowB?: boolean
  leftPinkyCSharp?: boolean
  leftPinkyGSharp?: boolean

  // Right pinky cluster
  rightPinkyEb?: boolean
  rightPinkyLowC?: boolean
}

const ALL_MAIN: KeyState = {
  leftIndex: true, leftMiddle: true, leftRing: true,
  rightIndex: true, rightMiddle: true, rightRing: true,
}

const TOP_3: KeyState = {
  leftIndex: true, leftMiddle: true, leftRing: true,
}

const TOP_2: KeyState = {
  leftIndex: true, leftMiddle: true,
}

// note key → key state (written pitch)
export const FINGERINGS: Record<string, KeyState> = {
  // Low register (no octave key)
  'Bb3':  { ...ALL_MAIN, leftPinkyLowBb: true },
  'B3':   { ...ALL_MAIN, leftPinkyLowB: true },
  'C4':   { ...ALL_MAIN, rightPinkyLowC: true },
  'C#4':  { ...ALL_MAIN, leftPinkyCSharp: true },
  'Db4':  { ...ALL_MAIN, leftPinkyCSharp: true },
  'D4':   { ...ALL_MAIN },
  'D#4':  { ...ALL_MAIN, rightPinkyEb: true },
  'Eb4':  { ...ALL_MAIN, rightPinkyEb: true },
  'E4':   { leftIndex: true, leftMiddle: true, leftRing: true, rightIndex: true, rightMiddle: true },
  'F4':   { leftIndex: true, leftMiddle: true, leftRing: true, rightIndex: true },
  'F#4':  { leftIndex: true, leftMiddle: true, leftRing: true, rightIndex: true, rightRing: true }, // fork F#
  'Gb4':  { leftIndex: true, leftMiddle: true, leftRing: true, rightIndex: true, rightRing: true },
  'G4':   { ...TOP_3 },
  'G#4':  { ...TOP_3, leftPinkyGSharp: true },
  'Ab4':  { ...TOP_3, leftPinkyGSharp: true },
  'A4':   { ...TOP_2 },
  'A#4':  { ...TOP_2, bis: true },
  'Bb4':  { ...TOP_2, bis: true },
  'B4':   { leftIndex: true },
  'C5':   { leftMiddle: true },
  'C#5':  { leftMiddle: true, sideC: true }, // various, this is one common
  'Db5':  { leftMiddle: true, sideC: true },

  // Upper register (octave key)
  'D5':   { octave: true, ...ALL_MAIN },
  'D#5':  { octave: true, ...ALL_MAIN, rightPinkyEb: true },
  'Eb5':  { octave: true, ...ALL_MAIN, rightPinkyEb: true },
  'E5':   { octave: true, leftIndex: true, leftMiddle: true, leftRing: true, rightIndex: true, rightMiddle: true },
  'F5':   { octave: true, leftIndex: true, leftMiddle: true, leftRing: true, rightIndex: true },
  'F#5':  { octave: true, leftIndex: true, leftMiddle: true, leftRing: true, rightIndex: true, rightRing: true },
  'Gb5':  { octave: true, leftIndex: true, leftMiddle: true, leftRing: true, rightIndex: true, rightRing: true },
  'G5':   { octave: true, ...TOP_3 },
  'G#5':  { octave: true, ...TOP_3, leftPinkyGSharp: true },
  'Ab5':  { octave: true, ...TOP_3, leftPinkyGSharp: true },
  'A5':   { octave: true, ...TOP_2 },
  'A#5':  { octave: true, ...TOP_2, bis: true },
  'Bb5':  { octave: true, ...TOP_2, bis: true },
  'B5':   { octave: true, leftIndex: true },
  'C6':   { octave: true, leftMiddle: true },
  'C#6':  { octave: true, leftMiddle: true, sideC: true },
  'Db6':  { octave: true, leftMiddle: true, sideC: true },

  // Palm-key range
  'D6':   { octave: true, palmD: true },
  'D#6':  { octave: true, palmD: true, palmEb: true },
  'Eb6':  { octave: true, palmD: true, palmEb: true },
  'E6':   { octave: true, palmD: true, palmEb: true, sideHighE: true },
  'F6':   { octave: true, palmD: true, palmEb: true, palmF: true },
  'F#6':  { octave: true, palmD: true, palmEb: true, palmF: true, highFSharp: true },
  'Gb6':  { octave: true, palmD: true, palmEb: true, palmF: true, highFSharp: true },
}

/** Look up fingering by written pitch (scientific notation). */
export function getFingering(note: string): KeyState | undefined {
  return FINGERINGS[note]
}

/** All notes that have a defined fingering (sorted by MIDI ascending). */
export function fingeredNotes(): string[] {
  return Object.keys(FINGERINGS)
}
