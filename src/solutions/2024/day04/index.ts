/**
 * Advent of Code 2024
 * Day 04
 * https://adventofcode.com/2024/day/4
 */
import zip from 'lodash-es/zip'
import type { Grid } from '../../../utils/grid'
import data from './input'

const lines = data.split('\n')
const letters = lines.map(line => line.split(''))

// Part 1
const getVerticalLines = (letters: Grid<string>) => {
  return zip(...letters).map(line => line.join(''))
}

const getDiagonals = (letters: Grid<string>) => {
  const diagonals = []
  for (let i = 0; i < letters[0].length + letters.length; i++) {
    let diagonal1 = ''
    let diagonal2 = ''
    for (let j = i; j >= 0; j--) {
      const x = j
      const y = i - j
      if (x >= letters[0].length || y >= letters.length) continue

      diagonal1 += letters[y][x]
      diagonal2 += letters[y][letters[0].length - x - 1]
    }

    diagonal1 != '' && diagonals.push(diagonal1)
    diagonal2 != '' && diagonals.push(diagonal2)
  }

  return diagonals
}

const WORD = /(?=(XMAS|SAMX))/g
let count = [
  ...lines,
  ...getVerticalLines(letters),
  ...getDiagonals(letters),
].reduce((sum, line) => (sum += [...line.matchAll(WORD)].length), 0)
console.log(`Part 1: ${count}`)

// Part 2
count = 0
for (let y = 1; y < letters.length - 1; y++) {
  for (let x = 1; x < letters[0].length - 1; x++) {
    if (letters[y][x] !== 'A') continue
    const cross = [
      letters[y - 1][x - 1] + letters[y][x] + letters[y + 1][x + 1],
      letters[y + 1][x - 1] + letters[y][x] + letters[y - 1][x + 1],
    ]
    if (cross.every(word => word.match(/(MAS|SAM)/g))) {
      count += 1
    }
  }
}
console.log(`Part 2: ${count}`)
