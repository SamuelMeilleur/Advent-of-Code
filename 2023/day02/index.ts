/**
 * Advent of Code 2023 
 * Day 02
 * https://adventofcode.com/2023/day/2
 */
import data from './input'

const COLORS = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
}

const CUBES_NUMBERS = {
  [COLORS.RED]: 12,
  [COLORS.GREEN]: 13,
  [COLORS.BLUE]: 14
}

const lines = data.split('\n')

// Part 1
let sum = 0
lines.forEach((line, index) => {
  const results = line.split(': ')[1].split('; ')

  for (const result of results) {
    const cubes = result.split(', ')

    for (const cube of cubes) {
      const [_, amount, color] = [...cube.matchAll(/(\d+) (\w+)/g)][0]

      if (parseInt(amount) > CUBES_NUMBERS[color])
        return
    }
  }

  sum += index + 1
})
console.log(`Part 1: ${sum}`)

// Part 2
let power = 0;
lines.forEach(line => {
  const results = line.split(': ')[1].split('; ')

  const fewest_cubes = {
    [COLORS.RED]: 0,
    [COLORS.GREEN]: 0,
    [COLORS.BLUE]: 0,
  }

  for (const result of results) {
    const cubes = result.split(', ')

    for (const cube of cubes) {
      const [_, amount, color] = [...cube.matchAll(/(\d+) (\w+)/g)][0]

      if (parseInt(amount) > fewest_cubes[color]) {
        fewest_cubes[color] = parseInt(amount)
      }
    }
  }

  power += Object.values(fewest_cubes).reduce((acc, value) => acc * value, 1)
})
console.log(`Part 2: ${power}`)
