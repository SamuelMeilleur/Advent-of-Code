/**
 * Advent of Code 2024
 * Day 25
 * https://adventofcode.com/2024/day/25
 */
import { zip } from 'lodash-es'
import type { Grid } from '../../../utils/grids'
import data from './input'

const HEIGHT = 7
const FILLED = '#'
const EMPTY = '.'

const schematics: Grid<string>[] = data
  .split('\n\n')
  .map(schema => schema.split('\n').map(line => line.split('')))

const locks = schematics
  .filter(schema => schema[0].every(cell => cell === FILLED))
  .map(schema =>
    zip(...schema).map(col =>
      col.reduce((sum, cell) => (cell === FILLED ? sum + 1 : sum), 0),
    ),
  )

const keys = schematics
  .filter(schema => schema[0].every(cell => cell === EMPTY))
  .map(schema =>
    zip(...schema).map(col =>
      col.reduce((sum, cell) => (cell === FILLED ? sum + 1 : sum), 0),
    ),
  )

let count = locks.length * keys.length
for (const lock of locks) {
  for (const key of keys) {
    for (let i = 0; i < key.length; i++) {
      if (key[i] + lock[i] > HEIGHT) {
        count -= 1
        // console.log(key, lock, i)
        break
      }
    }
  }
}

console.log(`Part 1: ${count}`)
