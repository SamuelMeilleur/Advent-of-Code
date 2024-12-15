/**
 * Advent of Code 2024
 * Day 14
 * https://adventofcode.com/2  024/day/14
 */
import {
  Grid,
  movePosition,
  type Position,
  type Vector,
} from '../../../utils/grid'
import data from './input'

type Dimensions = {
  width: number
  height: number
}
const DIMENSIONS = {
  width: 101,
  height: 103,
} as const

type Velocity = Vector
type Robot = {
  position: Position
  velocity: Velocity
}

const moveRobots = (
  robots: Robot[],
  dimensions: Dimensions,
  seconds = 1,
): Robot[] => {
  return robots.map(robot => {
    const { position, velocity } = robot
    const [x, y] = movePosition(
      position,
      velocity.map(x => x * seconds) as Velocity,
    )
    return {
      position: [
        ((x % dimensions.width) + dimensions.width) % dimensions.width,
        ((y % dimensions.height) + dimensions.height) % dimensions.height,
      ],
      velocity,
    }
  })
}

const getSafetyFactor = (robots: Robot[], dimensions: Dimensions) => {
  const quadrants = Array(4).fill(0)
  for (const robot of robots) {
    const [x, y] = robot.position

    const middle = {
      x: Math.floor(dimensions.width / 2),
      y: Math.floor(dimensions.height / 2),
    }
    if (x === middle.x || y === middle.y) continue

    if (y < middle.y) {
      if (x < middle.x) quadrants[0] += 1
      else quadrants[1] += 1
    } else {
      if (x < middle.x) quadrants[2] += 1
      else quadrants[3] += 1
    }
  }

  return quadrants.reduce((score, value) => (score *= value), 1)
}

const getGrid = (robots: Robot[], dimensions: Dimensions) => {
  const grid: Grid<string> = []
  for (let i = 0; i < dimensions.height; i++) {
    const row: string[] = []
    for (let j = 0; j < dimensions.width; j++) {
      row.push('.')
    }
    grid.push(row)
  }

  for (const robot of robots) {
    const [x, y] = robot.position
    grid[y][x] = '#'
  }

  return grid
}

const findTree = (robots: Robot[], dimensions: Dimensions) => {
  type SafetyFactor = number
  type Time = number

  let time = 0
  let record: [Time, SafetyFactor] = [time, Infinity]
  let grid: Grid<string>
  while (true) {
    if (time > dimensions.width * dimensions.height) break
    time += 1
    robots = moveRobots(robots, dimensions)

    const safety = getSafetyFactor(robots, dimensions)
    if (safety >= record[1]) continue

    record = [time, safety]
    grid = getGrid(robots, dimensions)
  }

  return {
    time: record[0],
    grid,
  }
}

const start = data
  .split('\n')
  .map(line =>
    line.split(' ').map(prop =>
      prop
        .match(/\w=(-?\d+),(-?\d+)/)
        .slice(1, 3)
        .map(Number),
    ),
  )
  .map(([position, velocity]) => ({
    position,
    velocity,
  })) as Robot[]

// Part 1
const robots = moveRobots(start.slice(), DIMENSIONS, 100)
const safetyFactor = getSafetyFactor(robots, DIMENSIONS)

// Part 2
const { time, grid } = findTree(start.slice(0), DIMENSIONS)

console.log(grid.map(line => line.join('')).join('\n'), '\n\n')

console.log(`Part 1: ${safetyFactor}`)
console.log(`Part 2: ${time}`)
