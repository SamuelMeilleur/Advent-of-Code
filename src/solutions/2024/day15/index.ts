/**
 * Advent of Code 2024
 * Day 15
 * https://adventofcode.com/2024/day/15
 */
import {
  copyGrid,
  DirectionVectors,
  findPositionsInGrid,
  getValueAtPosition,
  type Grid,
  movePosition,
  type Position,
  type Vector,
} from '../../../utils/grids'
import data from './input'

type Direction = '<' | '>' | '^' | 'v'
type Directions = {
  [key in Direction]: Vector
}
const DIRECTIONS = {
  '<': DirectionVectors.Left,
  '>': DirectionVectors.Right,
  '^': DirectionVectors.Up,
  'v': DirectionVectors.Down,
} as Directions
type GridState = [Grid<string>, Position]

const ROBOT = '@'
const OBSTACLE = '#'
const BOX = 'O'
const EMPTY = '.'

const swapGridValues = (
  grid: Grid<string>,
  old: Position,
  next: Position,
): Grid<string> => {
  const _grid = copyGrid(grid)
  _grid[old[0]][old[1]] = getValueAtPosition(grid, next)
  _grid[next[0]][next[1]] = getValueAtPosition(grid, old)
  return _grid
}

const moveBox = (gridState: GridState, move: Direction): GridState => {
  const [grid, position] = gridState

  let lookahead = position.slice() as Position
  const boxPosition = movePosition(lookahead, DIRECTIONS[move])

  while (true) {
    lookahead = movePosition(lookahead, DIRECTIONS[move])
    switch (getValueAtPosition(grid, lookahead)) {
      case EMPTY:
        const movedBoxGrid = swapGridValues(grid, boxPosition, lookahead)
        return [swapGridValues(movedBoxGrid, position, boxPosition), boxPosition]
      case BOX:
        continue
      case OBSTACLE:
      default:
        return [grid, position]
    }
  }
}

const moveRobot = (gridState: GridState, move: Direction): GridState => {
  const [grid, current] = gridState
  const next = movePosition(current, DIRECTIONS[move])

  switch (getValueAtPosition(grid, next)) {
    case EMPTY:
      return [swapGridValues(grid, current, next), next]
    case BOX:
      return moveBox(gridState, move)
    case OBSTACLE:
    default:
      return [grid, current]
  }
}

const getScore = (grid: Grid<string>): number => {
  const boxes = findPositionsInGrid(grid, x => x === BOX)
  return boxes
    .map(box => box[0] * 100 + box[1])
    .reduce((total, box) => total + box, 0)
}

const inputs = data.split('\n\n')
const moves = inputs[1].replace(/\s/g, '').split('')

// Part 1
const grid = inputs[0].split('\n').map(row => row.split(''))
const position = findPositionsInGrid(grid, x => x === ROBOT).flat() as Position

let current = [copyGrid(grid), position.slice()] as GridState
for (const move of moves) {
  current = moveRobot(current, move as Direction)
}

console.log(`Part 1: ${getScore(current[0])}`)
