/**
 * Advent of Code 2025
 * Day 02
 * https://adventofcode.com/2025/day/2
 */
import data from './input'

type Range = {
  start: string
  end: string
}

// Part 1
const isRepeatingDigits = (id: string) => {
  if (id.length % 2 === 1) return false
  return id.slice(0, id.length / 2) === id.slice(id.length / 2)
}

const ranges = data
  .split(',')
  .map(range => range.split('-'))
  .map(([start, end]) => ({
    start,
    end,
  })) satisfies Range[]

const part1 = ranges.reduce<number>((count, range) => {
  for (let i = Number(range.start); i <= Number(range.end); i++) {
    if (isRepeatingDigits(i.toString())) {
      count += i
    }
  }
  return count
}, 0)
console.log(`Part 1: ${part1}`)

// Part 2
const isInvalidId = (id: string) => {
  for (let i = 1; i <= id.length / 2; i++) {
    const repeats = id.length / i
    if (repeats !== Math.floor(repeats)) continue
    if (id.slice(0, i).repeat(repeats) === id) return true
  }
  return false
}

const part2 = ranges.reduce<number>((count, range) => {
  for (let i = Number(range.start); i <= Number(range.end); i++) {
    if (isInvalidId(i.toString())) {
      count += i
    }
  }
  return count
}, 0)
console.log(`Part 2: ${part2}`)
