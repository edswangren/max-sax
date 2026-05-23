import type { ProblemTemplate, GeneratedProblem, Difficulty } from '../types'
import { pick, shuffle } from '../../utils/random'
import { majorKeyFromCount, vexKeySignature } from '../../utils/music'

function chooseCount(d: Difficulty): number {
  // negative counts = flats
  if (d === 'easy')   return -pick([1, 2])
  if (d === 'medium') return -pick([1, 2, 3, 4])
  return -pick([1, 2, 3, 4, 5, 6, 7])
}

function makeProblem(d: Difficulty): GeneratedProblem {
  const count = chooseCount(d)
  const flats = Math.abs(count)
  const key = majorKeyFromCount(count)
  const vexKey = vexKeySignature(key)
  const allMajorKeys = ['C major','F major','Bb major','Eb major','Ab major','Db major','Gb major','Cb major']
  const distractors = shuffle(allMajorKeys.filter((k) => k !== key)).slice(0, 3)
  const choices = shuffle([key, ...distractors]).map((v) => ({ label: v, value: v }))
  return {
    questionText: `This key signature has ${flats} flat${flats === 1 ? '' : 's'}. What major key is it?`,
    correctAnswer: key,
    answerFormat: 'multiple-choice',
    choices,
    staffSpec: { clef: 'treble', keySignature: vexKey, notes: '' },
    hint: d === 'easy' ? 'Order of flats: B E A D G C F (BEAD-GCF). The 2nd-to-last flat names the key.' : undefined,
  }
}

export const templates: ProblemTemplate[] = (['easy', 'medium', 'hard'] as const).map((d) => ({
  id: `sk-keysig-flats-${d}`,
  topicId: 'sk-keysig-flats',
  category: 'scales-keys',
  title: 'Key signatures — flats',
  difficulty: d,
  answerFormat: 'multiple-choice',
  generate: () => makeProblem(d),
}))
