import { describe, it, expect } from 'vitest'
import { checkAnswer } from '../templates/validator'
import type { ProblemTemplate } from '../templates/types'

import { templates as scan } from '../templates/sight-reading/sr-scan'
import { templates as rhythm } from '../templates/sight-reading/sr-rhythm'
import { templates as melody } from '../templates/sight-reading/sr-melody'
import { templates as line } from '../templates/sight-reading/sr-line'
import { templates as patterns } from '../templates/sight-reading/sr-patterns'
import { templates as intervals } from '../templates/sight-reading/sr-intervals'
import { templates as whatsNext } from '../templates/sight-reading/sr-whats-next'
import { templates as inContext } from '../templates/sight-reading/sr-in-context'
import { templates as range } from '../templates/sight-reading/sr-range'
import { templates as perform } from '../templates/sight-reading/sr-perform'

const ALL: ProblemTemplate[] = [
  ...scan, ...rhythm, ...melody, ...line, ...patterns,
  ...intervals, ...whatsNext, ...inContext, ...range, ...perform,
]

const SAMPLES = 30

describe('sight-reading templates — generate → validate roundtrip', () => {
  for (const tpl of ALL) {
    it(`${tpl.id}: own correctAnswer validates + MC contains it`, () => {
      for (let i = 0; i < SAMPLES; i++) {
        const p = tpl.generate()
        expect(p.questionText.length).toBeGreaterThan(0)
        expect(p.correctAnswer.length).toBeGreaterThan(0)
        expect(
          checkAnswer(p.correctAnswer, p.correctAnswer, p.answerFormat, p.acceptableAnswers),
          `${tpl.id}: "${p.correctAnswer}" did not validate against itself`,
        ).toBe(true)
        if (p.answerFormat === 'multiple-choice') {
          expect(p.choices, `${tpl.id}: MC has no choices`).toBeDefined()
          const values = p.choices!.map((c) => c.value)
          expect(values, `${tpl.id}: correctAnswer "${p.correctAnswer}" missing from ${JSON.stringify(values)}`)
            .toContain(p.correctAnswer)
          expect(p.choices!.length, `${tpl.id}: too few choices`).toBeGreaterThanOrEqual(2)
        }
      }
    })
  }
})

describe('coverage', () => {
  it('each of the 9 topics has all 3 difficulties', () => {
    const byTopic = new Map<string, Set<string>>()
    for (const t of ALL) {
      if (!byTopic.has(t.topicId)) byTopic.set(t.topicId, new Set())
      byTopic.get(t.topicId)!.add(t.difficulty)
    }
    expect(byTopic.size).toBe(10)
    for (const [topic, diffs] of byTopic) {
      expect(diffs, `${topic} missing a difficulty`).toEqual(new Set(['easy', 'medium', 'hard']))
    }
  })
})
