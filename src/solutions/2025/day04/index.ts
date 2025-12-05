/**
 * Advent of Code 2025
 * Day 04
 * https://adventofcode.com/2025/day/4
 */
import {
  findPositionsInGrid,
  getValueAtPosition,
  isInGrid,
  movePosition,
  type Grid,
  type Position,
} from '../../../utils/grids'
import data from './input'

type Roll = Position
const ROLL = '@'

// Part 1
const isAccessible = (roll: Roll, rolls: Grid) => {
  let count = 0
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) continue
      const neighbor = movePosition(roll, [x, y])
      if (!isInGrid(rolls, neighbor)) continue
      if (getValueAtPosition(rolls, neighbor) === ROLL) {
        count += 1
      }
      if (count === 4) return false
    }
  }

  return true
}

const grid = data.split('\n').map(line => line.split('')) satisfies Grid
let rolls = findPositionsInGrid(grid, x => x === ROLL) satisfies Roll[]

const part1 = rolls.reduce(
  (count, pos) => (isAccessible(pos, grid) ? count + 1 : count),
  0,
)

console.log(`Part 1: ${part1}`)

// Part 2
let part2 = 0
let rerun = true
while (rerun) {
  const nextRunRolls: Roll[] = []
  rerun = false
  part2 += rolls.reduce((count, pos) => {
    if (isAccessible(pos, grid)) {
      grid[pos[0]][pos[1]] = 'x'
      rerun = true
      count += 1
    } else {
      nextRunRolls.push(pos)
    }
    rolls = nextRunRolls
    return count
  }, 0)
}
console.log(`Part 2: ${part2}`)
