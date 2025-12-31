/**
 * Advent of Code 2025
 * Day 07
 * https://adventofcode.com/2025/day/7
 */
import type { Grid } from '../../../utils/grids'
import data from './input'

const START = 'S'
const SPLITTER = '^'

const grid = data.split('\n').map(line => line.split('')) satisfies Grid
const startRow = grid.shift()!

// Part 1
let beams = new Set([startRow.findIndex(x => x === START)]) // Set of beams' column index

const part1 = grid.reduce((sum, row) => {
  const nextBeams = new Set(beams)
  for (const column of beams) {
    if (row[column] === SPLITTER) {
      sum += 1
      nextBeams.delete(column)
      nextBeams.add(column - 1)
      nextBeams.add(column + 1)
    }
  }
  beams = nextBeams
  return sum
}, 0)
console.log(`Part 1: ${part1}`)

// Part 2
let beamsCounts = new Map([[startRow.findIndex(x => x === START), 1]])

for (const row of grid) {
  const nextBeams = new Map(beamsCounts)
  for (const [column, value] of beamsCounts.entries()) {
    if (value === 0) continue
    if (row[column] === SPLITTER) {
      const left = nextBeams.get(column - 1) ?? 0
      const right = nextBeams.get(column + 1) ?? 0
      nextBeams.set(column, 0)
      nextBeams.set(column - 1, left + value)
      nextBeams.set(column + 1, right + value)
    }
  }
  beamsCounts = nextBeams
}

const part2 = [...beamsCounts.values()].reduce((sum, value) => sum + value, 0)
console.log(`Part 2: ${part2}`)
