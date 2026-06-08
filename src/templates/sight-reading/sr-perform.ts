import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { generateExcerpt, excerptOptionsFor } from '../../utils/music'

// Flagship: the real thing. Study (STARS), get counted in, play it on the horn
// in tempo without stopping, then self-grade. The app can't hear you — honesty
// is the instrument here.

const SELF_ASSESS = [
  { label: 'Nailed it', value: 'nailed' },
  { label: 'A few slips', value: 'slips' },
  { label: 'Train wreck', value: 'wreck' },
]

const SETTINGS: Record<Difficulty, { bpm: number; bars: number; study: number }> = {
  easy:   { bpm: 70, bars: 2, study: 8 },
  medium: { bpm: 80, bars: 2, study: 6 },
  hard:   { bpm: 92, bars: 3, study: 5 },
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const cfg = SETTINGS[d]
  const ex = generateExcerpt({ ...excerptOptionsFor(d), bars: cfg.bars, refBpm: cfg.bpm })

  return {
    questionText: `Key of ${ex.key}. Study it, then play it on your horn at ${cfg.bpm} BPM.`,
    correctAnswer: 'nailed',
    answerFormat: 'self-assess',
    choices: SELF_ASSESS,
    kind: 'perform',
    perform: { bpm: cfg.bpm, beatsPerMeasure: 4, countInBars: 1, studySeconds: cfg.study },
    staffSpec: {
      clef: 'treble',
      keySignature: ex.vexKey,
      timeSignature: ex.timeSignature,
      notes: ex.staffNotes,
      width: ex.width,
      endBar: true,
    },
    feedbackAudioSpec: ex.audioSpec,
    checkWork: `Notes: ${ex.sounding.map((n) => n.name).join(' – ')}. Tap "Hear it" to check yourself.`,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-perform-${d}`,
  topicId: 'sr-perform',
  category: 'sight-reading',
  title: 'Perform it',
  difficulty: d,
  answerFormat: 'self-assess',
  generate: () => makeProblem(d),
}))
