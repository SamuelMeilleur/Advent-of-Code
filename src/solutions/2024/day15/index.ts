/**
 * Advent of Code 2024
 * Day 15
 * https://adventofcode.com/2024/day/15
 */
import { findPositionsInGrid } from '../../../utils/grids'
import { BOX, BOX_LEFT, BOX_RIGHT, EMPTY, MOVES, ROBOT } from './constants'
import data from './input'
import { part1 } from './part1'
import { part2 } from './part2'
import { type Direction } from './types'

// Part 1
const inputs = data.split('\n\n')
const grid = inputs[0].split('\n').map(row => row.split(''))
const moves = inputs[1]
  .replace(/\s/g, '')
  .split('')
  .map(direction => MOVES[direction as Direction])

const gridState = {
  grid,
  position: findPositionsInGrid(grid, x => x === ROBOT)[0],
}
console.log(`Part 1: ${part1(gridState, moves)}`)

// Part 2
gridState.grid = gridState.grid.map(row =>
  row.flatMap(cell => {
    switch (cell) {
      case ROBOT:
        return [ROBOT, EMPTY]
      case BOX:
        return [BOX_LEFT, BOX_RIGHT]
      default:
        return [cell, cell]
    }
  }),
)
gridState.position = findPositionsInGrid(gridState.grid, x => x === ROBOT)[0]
console.log(`Part 2: ${part2(gridState, moves)}`)
