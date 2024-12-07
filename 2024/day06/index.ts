/**
 * Advent of Code 2024
 * Day 06
 * https://adventofcode.com/2024/day/6
 */
import data from './input'

type Position = [number, number]
type Direction = [1, 0] | [-1, 0] | [0, 1] | [0, -1]

const OBSTACLE = '#' as const
const FLOOR = '.' as const

const move = (position: Position, direction: Direction) =>
  position.map((val, index) => val + direction[index])

const map = data
  .split('\n')
  .map(line => line.split(''))

// Part 1
const startPosition = map
  .flatMap((row, y) => row.map((cell, x) =>
    cell !== OBSTACLE && cell !== FLOOR ? [y, x] : null))
  .find(Boolean) as Position

const seenPositions = new Set<string>()
let direction = [-1, 0] as Direction
let position = [...startPosition] as Position
while (true) {
  seenPositions.add(String(position))
  const [y, x] = move(position, direction)
  if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
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
  let _position = [...start] as Position
  let _direction = [-1, 0] as Direction
  while (true) {
    if (seen.get(String(_position))?.includes(String(_direction))) {
      return true
    }
    seen.set(String(_position),
      (seen.get(String(_position)) ?? []).concat(String(_direction))
    )

    const [y, x] = move(_position, _direction)
    if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) {
      return false
    }

    if (grid[y][x] === OBSTACLE || (y === newObstacle[0] && x === newObstacle[1])) {
      _direction = [_direction[1], -_direction[0]] as Direction
    } else {
      _position = [y, x]
    }
  }
}

const loopsCount = [...seenPositions.keys()]
  .map(pos => pos.split(',').map(Number))
  .reduce((count, [y, x]) =>
    isLoop(map, startPosition, [y, x]) ? count + 1 : count, 0)

console.log(`Part 2: ${loopsCount}`)
