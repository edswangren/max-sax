import type { AnswerFormat } from './types'
import { normalizeNoteName, normalizeKeyName, normalizeInterval } from '../utils/music'

function stripSpaces(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase()
}

export function checkAnswer(
  userInput: string,
  expected: string,
  format: AnswerFormat,
  acceptableAnswers?: string[],
): boolean {
  const cleaned = userInput.trim()
  if (acceptableAnswers?.some((a) => stripSpaces(a) === stripSpaces(cleaned))) {
    return true
  }

  switch (format) {
    case 'integer':
      return parseInt(cleaned, 10) === parseInt(expected, 10)

    case 'note-name':
      return normalizeNoteName(cleaned) === normalizeNoteName(expected)

    case 'note-sequence': {
      const norm = (s: string) =>
        s.split(/[,\s]+/).filter(Boolean).map(normalizeNoteName).join(',')
      return norm(cleaned) === norm(expected)
    }

    case 'interval':
      return normalizeInterval(cleaned) === normalizeInterval(expected)

    case 'key-name':
      return normalizeKeyName(cleaned) === normalizeKeyName(expected)

    case 'multiple-choice':
    case 'fingering-pick':
    case 'text':
      return stripSpaces(cleaned) === stripSpaces(expected)

    default:
      return cleaned === expected
  }
}
