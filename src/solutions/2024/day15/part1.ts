import {
  copyGrid,
  findPositionsInGrid,
  getValueAtPosition,
  type Grid,
  movePosition,
  type Position,
  type Vector,
} from '../../../utils/grids'
import { BOX, EMPTY, OBSTACLE } from './constants'
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

const moveBox = (gridState: GridState, move: Vector): GridState => {
  const { grid, position } = gridState

  let lookahead = position.slice() as Position
  const boxPosition = movePosition(lookahead, move)

  while (true) {
    lookahead = movePosition(lookahead, move)
    switch (getValueAtPosition(grid, lookahead)) {
      case EMPTY: {
        const movedBoxGrid = swapGridValues(grid, boxPosition, lookahead)
        return {
          grid: swapGridValues(movedBoxGrid, position, boxPosition),
          position: boxPosition,
        }
      }
      case BOX:
        continue
      case OBSTACLE:
      default:
        return gridState
    }
  }
}

const moveRobot = (gridState: GridState, move: Vector): GridState => {
  const { grid, position: current } = gridState
  const next = movePosition(current, move)

  switch (getValueAtPosition(grid, next)) {
    case EMPTY:
      return { grid: swapGridValues(grid, current, next), position: next }
    case BOX:
      return moveBox(gridState, move)
    case OBSTACLE:
    default:
      return gridState
  }
}

export const part1 = (startState: GridState, moves: Vector[]) => {
  let current = {
    grid: copyGrid(startState.grid),
    position: startState.position.slice() as Position,
  }

  for (const move of moves) {
    current = moveRobot(current, move)
  }

  const score = findPositionsInGrid(current.grid, x => x === BOX)
    .map(box => box[0] * 100 + box[1])
    .reduce((total, box) => total + box, 0)

  return score
}
