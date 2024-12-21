/**
 * Advent of Code 2024
 * Day 19
 * https://adventofcode.com/2024/day/19
 */
import memoize from 'lodash-es/memoize'
import data from './input'

const countPossibleDesigns = memoize(
  (design: string, patterns: string[]): number => {
    if (design.length === 0) return 1

    return patterns.reduce<number>(
      (count, pattern) =>
        design.startsWith(pattern)
          ? count + countPossibleDesigns(design.slice(pattern.length), patterns)
          : count,
      0,
    )
  },
  (design: string) => design,
)

const [patterns, designs] = data
  .split('\n\n')
  .map(part => part.split(/(?:, |\n)/))

// Part 1
const scores = designs.map(design => countPossibleDesigns(design, patterns))
let result = scores.reduce((sum, score) => sum + Math.min(1, score), 0)
console.log(`Part 1: ${result}`)

// Part 2
result = scores.reduce((sum, score) => sum + score, 0)
console.log(`Part 1: ${result}`)
