import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { generateExcerpt, excerptOptionsFor } from '../../utils/music'

// Read the whole line: type every pitch in order. The full sight-reading act,
// minus rhythm-in-real-time. Easy stays short (2 bars) so it's not a marathon.

function makeProblem(d: Difficulty): GeneratedProblem {
  const opts = { ...excerptOptionsFor(d), accidentalDensity: d === 'hard' ? 0.3 : 0 }
  const ex = generateExcerpt(opts)
  const names = ex.sounding.map((n) => n.name)
  const correct = names.join(', ')

  return {
    questionText: `Key of ${ex.key}. Type every note in order, comma-separated.`,
    correctAnswer: correct,
    acceptableAnswers: [correct, names.join(','), names.join(' ')],
    answerFormat: 'note-sequence',
    staffSpec: {
      clef: 'treble',
      keySignature: ex.vexKey,
      timeSignature: ex.timeSignature,
      notes: ex.staffNotes,
      width: ex.width,
      endBar: true,
    },
    hint: d === 'easy' ? 'Apply the key sig to each note. Example: "Bb, C, D, Eb"' : undefined,
    checkWork: `Notes: ${names.join(' – ')}`,
    feedbackAudioSpec: ex.audioSpec,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-line-${d}`,
  topicId: 'sr-line',
  category: 'sight-reading',
  title: 'Read the whole line',
  difficulty: d,
  answerFormat: 'note-sequence',
  generate: () => makeProblem(d),
}))
