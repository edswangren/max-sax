import { describe, it, expect } from 'vitest'
import { getAllTemplates } from '../templates/registry'
import { checkAnswer } from '../templates/validator'

const SAMPLES_PER_TEMPLATE = 25

describe('every template — generate → validate roundtrip', () => {
  const templates = getAllTemplates()

  for (const tpl of templates) {
    it(`${tpl.id}: own correctAnswer validates`, () => {
      for (let i = 0; i < SAMPLES_PER_TEMPLATE; i++) {
        const p = tpl.generate()
        // basic shape
        expect(p.questionText.length).toBeGreaterThan(0)
        expect(p.correctAnswer.length).toBeGreaterThan(0)

        // own correct answer should validate
        const ok = checkAnswer(p.correctAnswer, p.correctAnswer, p.answerFormat, p.acceptableAnswers)
        expect(ok, `template ${tpl.id} failed: input "${p.correctAnswer}" did not match itself`).toBe(true)

        // if multiple-choice, the correct answer must appear in the choices
        if (p.answerFormat === 'multiple-choice') {
          expect(p.choices, `template ${tpl.id} MC has no choices`).toBeDefined()
          const values = p.choices!.map((c) => c.value)
          expect(values, `template ${tpl.id}: correctAnswer "${p.correctAnswer}" missing from choices ${JSON.stringify(values)}`)
            .toContain(p.correctAnswer)
        }
      }
    })
  }
})

describe('coverage', () => {
  it('every topic in the catalog has at least 1 template per difficulty', async () => {
    const { categories } = await import('../data/catalog')
    const { getTemplatesForTopic } = await import('../templates/registry')
    for (const c of categories) {
      for (const t of c.topics) {
        for (const d of ['easy','medium','hard'] as const) {
          const tpls = getTemplatesForTopic(t.id, d)
          expect(tpls.length, `${t.id} has no templates at difficulty ${d}`).toBeGreaterThan(0)
        }
      }
    }
  })
})
