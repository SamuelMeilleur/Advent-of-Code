/**
 * Advent of Code 2024
 * Day 06
 * https://adventofcode.com/2024/day/6
 */
import { type Position, EMPTY, isInGrid, movePosition } from '../../../../utils/grid'
import data from './input'

type Direction = [1, 0] | [-1, 0] | [0, 1] | [0, -1]
const OBSTACLE = '#' as const

const map = data
  .split('\n')
  .map(line => line.split(''))

// Part 1
const startPosition = map
  .flatMap((row, y) => row.map((cell, x) =>
    cell !== OBSTACLE && cell !== EMPTY ? [y, x] : null))
  .find(Boolean) as Position

const seenPositions = new Set<string>()
let direction = [-1, 0] as Direction
let position = [...startPosition] as Position
while (true) {
  seenPositions.add(String(position))
  const [y, x] = movePosition(position, direction)
  if (!isInGrid(map, [y, x])) {
    break
  }

  if (map[y][x] === OBSTACLE) {
    // turn right when meeting obstacle
    direction = [direction[1], -direction[0]] as Direction
  } else {
    position = [y, x]
  }
}

console.log(`Part 1: ${seenPositions.size}`)


// Part 2
const isLoop = (grid: string[][], start: Position, newObstacle: Position) => {
  const seen = new Map<string, string[]>()
  let position = [...start] as Position
  let direction = [-1, 0] as Direction
  while (true) {
    if (seen.get(String(position))?.includes(String(direction))) {
      return true
    }
    seen.set(String(position),
      (seen.get(String(position)) ?? []).concat(String(direction))
    )

    const [y, x] = movePosition(position, direction)
    if (!isInGrid(map, [y, x])) {
      return false
    }

    if (grid[y][x] === OBSTACLE || (y === newObstacle[0] && x === newObstacle[1])) {
      direction = [direction[1], -direction[0]] as Direction
    } else {
      position = [y, x]
    }
  }
}

const loopsCount = [...seenPositions.keys()]
  .map(pos => pos.split(',').map(Number))
  .reduce((count, [y, x]) =>
    isLoop(map, startPosition, [y, x]) ? count + 1 : count, 0)

console.log(`Part 2: ${loopsCount}`)
