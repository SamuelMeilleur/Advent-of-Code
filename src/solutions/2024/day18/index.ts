/**
 * Advent of Code 2024
 * Day 18
 * https://adventofcode.com/2024/day/18
 */
import { EMPTY, findPath, OBSTACLE } from '../../../utils/pathfinding'
import { type Grid, type Position, type Vector } from '../../../utils/grids'
import data from './input'

const STEPS = 2 ** 10
const SIZE = 70

const buildGrid = (bytes: Position[]) => {
  const grid: Grid<string> = Array(SIZE + 1)
    .fill(Array(SIZE + 1).fill(EMPTY))
    .map(row => row.slice())

  for (const [x, y] of bytes) {
    grid[y][x] = OBSTACLE
  }

  return grid
}

const START = [0, 0] as Vector
const END = [SIZE, SIZE] as Vector
const bytes = data
  .split('\n')
  .map(line => line.split(',').map(Number)) as Position[]

// Part 1
const grid = buildGrid(bytes.slice(0, STEPS))
const path = findPath(grid, START, END)
console.log(`Part 1: ${path?.length}`)

// Part 2
const boundaries = [STEPS, bytes.length]
while (boundaries[0] + 1 < boundaries[1]) {
  // binary search
  const current = boundaries[0] + Math.floor((boundaries[1] - boundaries[0]) / 2)
  const grid = buildGrid(bytes.slice(0, current))
  const path = findPath(grid, START, END)

  if (path.length === 0) boundaries[1] = current
  else boundaries[0] = current
}

console.log(`Part 2: ${bytes[boundaries[0]]}`)
