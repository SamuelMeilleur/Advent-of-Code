import { DirectionVectors } from '../../../utils/grids'
import type { Moves } from './types'

export const MOVES = {
  '<': DirectionVectors.Left,
  '>': DirectionVectors.Right,
  '^': DirectionVectors.Up,
  'v': DirectionVectors.Down,
} as Moves

export const ROBOT = '@'
export const OBSTACLE = '#'
export const BOX = 'O'
export const BOX_LEFT = '['
export const BOX_RIGHT = ']'
export const EMPTY = '.'
