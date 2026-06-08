import { describe, it, expect } from 'vitest'
import { generateUnique } from '../utils/random'

describe('generateUnique', () => {
  it('returns N unique items when the pool is large enough', () => {
    let i = 0
    const out = generateUnique(() => `item-${i++ % 100}`, 10, (x) => x)
    expect(out).toHaveLength(10)
    expect(new Set(out).size).toBe(10)
  })

  it('cycles through a small pool, never repeating within a cycle', () => {
    // pool of 4 items, request 10
    const pool = ['a', 'b', 'c', 'd']
    let i = 0
    const out = generateUnique(() => pool[i++ % pool.length], 10, (x) => x)
    expect(out).toHaveLength(10)
    // The first 4 are some permutation of the pool.
    expect(new Set(out.slice(0, 4)).size).toBe(4)
  })

  it('over a small random sampler — every poolSize-window is fully unique', () => {
    const pool = ['x', 'y', 'z']
    const gen = () => pool[Math.floor(Math.random() * pool.length)]
    for (let trial = 0; trial < 30; trial++) {
      const out = generateUnique(gen, 9, (x) => x)
      expect(out).toHaveLength(9)
      // Within each cycle (poolSize items in a row) all values are unique.
      // Cycle boundaries may collide (last of cycle N = first of cycle N+1).
      for (let start = 0; start + pool.length <= out.length; start += pool.length) {
        const window = out.slice(start, start + pool.length)
        expect(new Set(window).size).toBe(pool.length)
      }
    }
  })

  it('does not infinite-loop when pool is size 1', () => {
    const out = generateUnique(() => 'only', 5, (x) => x)
    expect(out).toHaveLength(5)
    expect(out.every((x) => x === 'only')).toBe(true)
  })
})
