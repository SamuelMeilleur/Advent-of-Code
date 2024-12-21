/**
 * Advent of Code 2024
 * Day 20
 * https://adventofcode.com/2024/day/20
 */
import { findPath, type Path } from '../../../utils/pathfinding'
import { getManhattanDistance, type Position } from '../../../utils/grids'
import data from './input'

type Maze = {
  start: Position
  end: Position
}

const START = 'S'
const END = 'E'

const findCheatTimes = (path: Path, length: number) => {
  const timeSavings: number[] = []
  for (const [index1, positionA] of path.slice(0, -length).entries()) {
    for (const [delta, positionB] of path.slice(index1).entries()) {
      const index2 = index1 + delta
      const distance = getManhattanDistance(positionA, positionB)
      if (distance > length) {
        continue
      }

      timeSavings.push(Math.abs(index2 - index1) - distance)
    }
  }
  return timeSavings.filter(time => time >= 100)
}

const grid = data.split('\n').map(row => row.split(''))
const { start, end } = grid.reduce<Maze>(
  (positions, row, i) =>
    row.reduce((positions, cell, j) => {
      if (cell === START)
        return {
          ...positions,
          start: [i, j] as Position,
        }
      if (cell === END)
        return {
          ...positions,
          end: [i, j] as Position,
        }
      return positions
    }, positions),
  {} as Maze,
)

// Part 1
const regularPath = findPath(grid, start, end)
let result = findCheatTimes(regularPath, 2).length
console.log(`Part 1: ${result}`)

// Part 2
result = findCheatTimes(regularPath, 20).length
console.log(`Part 2: ${result}`)
