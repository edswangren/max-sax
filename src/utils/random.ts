export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

/**
 * Repeatedly call `generate` and collect `count` items, deduping by `keyOf`.
 * If the underlying pool is smaller than `count` (so unique keys can't be
 * sustained), we cycle: exhaust the pool, clear the seen-set, and start a
 * fresh cycle. Within each cycle, no key repeats.
 *
 * Use case: a 10-problem practice session over a template whose answer pool
 * is only 4 — get 4 unique answers, then 4 more unique answers, then 2 more.
 */
export function generateUnique<T>(
  generate: () => T,
  count: number,
  keyOf: (item: T) => string,
): T[] {
  const out: T[] = []
  const seen = new Set<string>()
  let stallStreak = 0
  // Heuristic: if we miss `count * 4` times in a row without adding to `out`,
  // assume the pool is exhausted for this cycle.
  const stallLimit = Math.max(20, count * 4)

  while (out.length < count) {
    const item = generate()
    const key = keyOf(item)
    if (!seen.has(key)) {
      seen.add(key)
      out.push(item)
      stallStreak = 0
      continue
    }
    stallStreak++
    if (stallStreak >= stallLimit) {
      // Pool drained — start a new cycle with the current draw as the first
      // entry so we never get stuck.
      seen.clear()
      seen.add(key)
      out.push(item)
      stallStreak = 0
    }
  }
  return out
}
