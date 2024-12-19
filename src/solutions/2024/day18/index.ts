/**
 * Advent of Code 2024
 * Day 18
 * https://adventofcode.com/2024/day/18
 */
import {
  DirectionVectors,
  getValueAtPosition,
  isInGrid,
  isSamePosition,
  movePosition,
  type Grid,
  type Position,
  type Vector,
} from '../../../utils/grids'
import data from './input'

type Node = {
  position: Position
  prev: Node | null
}
type PositionID = string

const STEPS = 2 ** 10
const SIZE = 70

const EMPTY = '.'
const OBSTACLE = '#'

const buildGrid = (bytes: Position[]) => {
  const grid: Grid<string> = Array(SIZE + 1)
    .fill(Array(SIZE + 1).fill(EMPTY))
    .map(row => row.slice())

  for (const [x, y] of bytes) {
    grid[y][x] = OBSTACLE
  }

  return grid
}

const buildPath = (end: Node) => {
  let current = end
  const path: Position[] = []
  while (current.prev != null) {
    path.unshift(current.position)
    current = current.prev
  }

  return path
}

const findPath = (grid: Grid<string>, start: Position, end: Position) => {
  const seen: Set<PositionID> = new Set(String(start))
  const queue: Node[] = [
    {
      position: start,
      prev: null,
    },
  ]

  while (queue.length > 0) {
    const current = queue.pop() as Node
    if (isSamePosition(current.position, end)) return buildPath(current)

    const nextNodes: Node[] = Object.values(DirectionVectors)
      .map(vector => movePosition(current.position, vector))
      .filter(
        position =>
          isInGrid(grid, position) &&
          getValueAtPosition(grid, position) !== OBSTACLE &&
          !seen.has(String(position)),
      )
      .map(position => ({
        position,
        prev: current,
      }))

    nextNodes.forEach(node => seen.add(String(node.position)))
    queue.unshift(...nextNodes)
  }

  return null
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

  if (path == null) boundaries[1] = current
  else boundaries[0] = current
}
console.log(`Part 2: ${bytes[boundaries[0]]}`)
