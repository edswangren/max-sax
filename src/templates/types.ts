export type AnswerFormat =
  | 'integer'
  | 'note-name'
  | 'note-sequence'
  | 'interval'
  | 'key-name'
  | 'multiple-choice'
  | 'text'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Clef = 'treble' | 'bass'

export interface StaffSpec {
  clef?: Clef
  keySignature?: string
  timeSignature?: string
  notes: string
  width?: number
  height?: number
}

export interface FingeringSpec {
  note: string
}

export interface AudioNote {
  midi: number
  durationMs: number
}

export interface AudioSpec {
  notes: AudioNote[]
  gapMs?: number
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
  choices?: MultipleChoiceOption[]
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
