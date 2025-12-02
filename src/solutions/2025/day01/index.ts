/**
 * Advent of Code 2025
 * Day 01
 * https://adventofcode.com/2025/day/1
 */
import data from './input'

enum Direction {
  LEFT = 'L',
  RIGHT = 'R',
}
type Rotation = {
  direction: Direction
  amount: number
}

type Dial = {
  position: number
  count: number
}

const getTurnAmount = (rotation: Rotation) =>
  rotation.amount * (rotation.direction === Direction.LEFT ? -1 : 1)

const getNextPosition = (current: number, turn: number) =>
  (((current + turn) % 100) + 100) % 100

const rotations = data.split('\n').map(line => ({
  direction: line.slice(0, 1) === 'L' ? Direction.LEFT : Direction.RIGHT,
  amount: Number(line.slice(1)),
})) satisfies Rotation[]

// Part 1
const { count: part1 } = rotations.reduce<Dial>(
  (current, rotation) => {
    const turn = getTurnAmount(rotation)
    current.position = getNextPosition(current.position, turn)

    if (current.position === 0) {
      current.count += 1
    }

    return current
  },
  {
    position: 50,
    count: 0,
  },
)
console.log(`Part 1: ${part1}`)

// Part 2
const passesByZero = (current: number, next: number, direction: Direction) => {
  if (current === 0) return false
  return (
    next === 0 ||
    (direction === Direction.LEFT && next > current) ||
    (direction === Direction.RIGHT && next < current)
  )
}
const { count: part2 } = rotations.reduce<Dial>(
  (current, rotation) => {
    const turn = getTurnAmount(rotation)
    const nextPosition = getNextPosition(current.position, turn)
    current.count += Math.floor(Math.abs(turn) / 100)

    if (passesByZero(current.position, nextPosition, rotation.direction)) {
      current.count += 1
    }

    return {
      ...current,
      position: nextPosition,
    }
  },
  {
    position: 50,
    count: 0,
  },
)
console.log(`Part 2: ${part2}`)
