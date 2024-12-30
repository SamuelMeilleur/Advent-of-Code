import {
  copyGrid,
  findPositionsInGrid,
  getValueAtPosition,
  type Grid,
  movePosition,
  type Position,
  type Vector,
} from '../../../utils/grids'
import { BOX_LEFT, BOX_RIGHT, EMPTY, MOVES, OBSTACLE } from './constants'
import type { GridState } from './types'

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

const moveBoxHorizontal = (gridState: GridState, move: Vector): GridState => {
  const { grid, position } = gridState

  const next = movePosition(position, move)
  const encounteredBoxes: Position[] = []

  let lookahead = position

  while (true) {
    lookahead = movePosition(lookahead, move)
    switch (getValueAtPosition(grid, lookahead)) {
      case EMPTY: {
        let nextGrid = grid

        for (const box of encounteredBoxes.reverse()) {
          const swap = movePosition(box, move)
          nextGrid = swapGridValues(nextGrid, box, swap)
        }
        return {
          grid: swapGridValues(nextGrid, position, next),
          position: next,
        }
      }
      case BOX_LEFT:
      case BOX_RIGHT:
        encounteredBoxes.push(lookahead)
        continue
      case OBSTACLE:
      default:
        return gridState
    }
  }
}

const getBoxPositions = (
  grid: Grid<string>,
  halfBoxPosition: Position,
): [Position, Position] => {
  return [
    halfBoxPosition,
    getValueAtPosition(grid, halfBoxPosition) === BOX_LEFT
      ? movePosition(halfBoxPosition, MOVES['>'])
      : movePosition(halfBoxPosition, MOVES['<']),
  ]
}

const moveBoxVertical = (gridState: GridState, move: Vector): GridState => {
  const { grid, position } = gridState

  const next = movePosition(position, move)
  const boxes = getBoxPositions(grid, next)
  const encounteredBoxes: Position[] = []

  while (boxes.length > 0) {
    const box = boxes.shift() as Position
    const lookahead = movePosition(box, move)

    if (encounteredBoxes.every(seen => box.toString() !== seen.toString())) {
      encounteredBoxes.push(box)
    }

    switch (getValueAtPosition(grid, lookahead)) {
      case EMPTY:
        continue
      case BOX_LEFT:
      case BOX_RIGHT:
        boxes.push(...getBoxPositions(grid, lookahead))
        continue
      case OBSTACLE:
      default:
        return gridState
    }
  }

  let nextGrid = grid
  for (const box of encounteredBoxes.reverse()) {
    const swap = movePosition(box, move)
    nextGrid = swapGridValues(nextGrid, box, swap)
  }

  return {
    grid: swapGridValues(nextGrid, position, next),
    position: next,
  }
}

const moveRobot = (gridState: GridState, move: Vector): GridState => {
  const { grid, position: current } = gridState
  const next = movePosition(current, move)

  switch (getValueAtPosition(grid, next)) {
    case EMPTY:
      return { grid: swapGridValues(grid, current, next), position: next }
    case BOX_LEFT:
    case BOX_RIGHT:
      return move[0] === 0
        ? moveBoxHorizontal(gridState, move)
        : moveBoxVertical(gridState, move)
    case OBSTACLE:
    default:
      return gridState
  }
}

export const part2 = (startState: GridState, moves: Vector[]) => {
  let current = {
    grid: copyGrid(startState.grid),
    position: startState.position.slice() as Position,
  }

  for (const move of moves) {
    current = moveRobot(current, move)
  }

  const score = findPositionsInGrid(current.grid, x => x === BOX_LEFT)
    .map(box => box[0] * 100 + box[1])
    .reduce((total, box) => total + box, 0)

  return score
}
