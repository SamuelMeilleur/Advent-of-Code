import { type Grid, type Position, type Vector } from '../../../utils/grids'

export type Direction = '<' | '>' | '^' | 'v'

export type Moves = {
  [key in Direction]: Vector
}

export type GridState = {
  grid: Grid<string>
  position: Position
}
