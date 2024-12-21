import type { Position } from '../grids'

export type Node = {
  position: Position
  prev?: Node
}

export type Path = Position[]
