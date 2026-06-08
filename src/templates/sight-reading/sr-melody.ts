import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick } from '../../utils/random'
import { generateExcerpt, excerptOptionsFor } from '../../utils/music'
import { mcFrom, neighborNames } from './_shared'

// Pitch + rhythm coupled. Easy/medium: name the highlighted note.
// Hard: name the note on a given beat of a given bar (forces rhythm tracking, no highlight).

function makeProblem(d: Difficulty): GeneratedProblem {
  const ex = generateExcerpt(excerptOptionsFor(d))
  const baseStaff = {
    clef: 'treble' as const,
    keySignature: ex.vexKey,
    timeSignature: ex.timeSignature,
    notes: ex.staffNotes,
    width: ex.width,
    endBar: true,
  }

  if (d === 'hard') {
    const target = pick(ex.sounding)
    const correct = target.name
    return {
      questionText: `Read in time: what note falls on beat ${target.beat % 1 === 0 ? target.beat : target.beat.toFixed(1)} of bar ${target.bar + 1}?`,
      correctAnswer: correct,
      answerFormat: 'note-name',
      staffSpec: baseStaff,
      checkWork: `Notes: ${ex.sounding.map((n) => n.name).join(' – ')}`,
      feedbackAudioSpec: ex.audioSpec,
    }
  }

  const idx = Math.floor(Math.random() * ex.sounding.length)
  const target = ex.sounding[idx]
  const correct = target.name
  const others = ex.sounding.map((n) => n.name).filter((n) => n !== correct)
  return {
    questionText: 'Name the highlighted note.',
    correctAnswer: correct,
    answerFormat: 'multiple-choice',
    choices: mcFrom(correct, [...others, ...neighborNames(correct)]),
    staffSpec: { ...baseStaff, highlightIndex: idx },
    hint: d === 'easy' ? 'Check the key signature, then read the gold note.' : undefined,
    feedbackAudioSpec: ex.audioSpec,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sr-melody-${d}`,
  topicId: 'sr-melody',
  category: 'sight-reading',
  title: 'Read the melody',
  difficulty: d,
  answerFormat: d === 'hard' ? 'note-name' : 'multiple-choice',
  generate: () => makeProblem(d),
}))
