/**
 * Advent of Code 2024
 * Day 06
 * https://adventofcode.com/2024/day/6
 */
import {
  type Position,
  DirectionVectors,
  getValueAtPosition,
  type Grid,
  isInGrid,
  movePosition,
  isSamePosition,
} from '../../../utils/grids'
import data from './input'

type PositionID = string
type DirectionID = string
const EMPTY = '.' as const
const OBSTACLE = '#' as const

const grid = data.split('\n').map(line => line.split(''))

// Part 1
const startPosition = grid
  .flatMap((row, y) =>
    row.map((cell, x) => (cell !== OBSTACLE && cell !== EMPTY ? [y, x] : null)),
  )
  .find(Boolean) as Position

const seenPositions = new Set<PositionID>()
let direction = DirectionVectors.Up
let position = startPosition.slice() as Position
while (isInGrid(grid, position)) {
  seenPositions.add(String(position))
  const nextPosition = movePosition(position, direction)
  if (getValueAtPosition(grid, nextPosition) === OBSTACLE)
    // turn right when meeting obstacle
    direction = [direction[1], -direction[0]]
  else position = nextPosition
}

console.log(`Part 1: ${seenPositions.size}`)

// Part 2
const isLoop = (grid: Grid<string>, start: Position, newObstacle: Position) => {
  const seen = new Map<PositionID, DirectionID[]>()
  let direction = DirectionVectors.Up
  let position = start.slice() as Position
  while (isInGrid(grid, position)) {
    if (seen.get(String(position))?.includes(String(direction))) {
      return true
    }
    seen.set(
      String(position),
      (seen.get(String(position)) ?? []).concat(String(direction)),
    )
    const nextPosition = movePosition(position, direction)
    if (
      getValueAtPosition(grid, nextPosition) === OBSTACLE ||
      isSamePosition(nextPosition, newObstacle)
    )
      direction = [direction[1], -direction[0]]
    else position = nextPosition
  }
  return false
}

const loopsCount = Array.from(seenPositions.keys())
  .map(pos => pos.split(',').map(Number))
  .reduce(
    (count, [y, x]) => (isLoop(grid, startPosition, [y, x]) ? count + 1 : count),
    0,
  )

console.log(`Part 2: ${loopsCount}`)
