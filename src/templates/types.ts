export type AnswerFormat =
  | 'integer'
  | 'note-name'
  | 'note-sequence'
  | 'interval'
  | 'key-name'
  | 'multiple-choice'
  | 'fingering-pick'
  | 'text'
  | 'self-assess'

/** Standard = answer a question. Perform = play it on the horn, then self-grade. */
export type ProblemKind = 'standard' | 'perform'

export interface PerformSpec {
  bpm: number
  beatsPerMeasure: number
  countInBars: number
  studySeconds: number
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Clef = 'treble' | 'bass'

export interface StaffSpec {
  clef?: Clef
  keySignature?: string
  timeSignature?: string
  /**
   * Comma-separated note stream. Superset grammar:
   *   - note:    "Bb4/q", "F#5/8", "Fn4" (defaults to whole note)
   *   - rest:    "qr", "hr", "8r" (duration + r, no pitch)
   *   - dotted:  trailing "." on the duration, e.g. "Bb4/q.", "8.r"
   *   - barline: a lone "|" token between measures
   */
  notes: string
  width?: number
  height?: number
  /** Color the Nth *sounding* note (rests/barlines skipped) brass — used to mark a target note. */
  highlightIndex?: number
  /** Draw a final end-barline glyph (for multi-bar excerpts). */
  endBar?: boolean
}

export interface FingeringSpec {
  note: string
}

export interface AudioNote {
  midi: number
  durationMs: number
  /** Per-note detune in cents — overrides AudioSpec.detuneCents for this note. */
  detuneCents?: number
}

export interface AudioSpec {
  notes: AudioNote[]
  gapMs?: number
  timbre?: 'reed' | 'clean'
  detuneCents?: number
}

export interface MultipleChoiceOption {
  label: string
  value: string
}

export interface GeneratedProblem {
  questionText: string
  correctAnswer: string
  acceptableAnswers?: string[]
  answerFormat: AnswerFormat
  hint?: string
  checkWork?: string
  staffSpec?: StaffSpec
  fingeringSpec?: FingeringSpec
  audioSpec?: AudioSpec
  /** Audio rendered only on the feedback banner — useful when audio would give the answer away. */
  feedbackAudioSpec?: AudioSpec
  choices?: MultipleChoiceOption[]
  /** Defaults to 'standard'. 'perform' triggers the play-it-on-your-horn flow. */
  kind?: ProblemKind
  perform?: PerformSpec
}

export interface ProblemTemplate {
  id: string
  topicId: string
  category: string
  title: string
  difficulty: Difficulty
  answerFormat: AnswerFormat
  generate: () => GeneratedProblem
}
