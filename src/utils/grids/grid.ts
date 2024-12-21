import type { Directions, Grid, Position } from './types'

export const DirectionVectors = {
  Up: [-1, 0],
  Down: [1, 0],
  Left: [0, -1],
  Right: [0, 1],
} as Directions

export const isInGrid = <T>(grid: Grid<T>, position: Position) =>
  position[0] >= 0 &&
  position[0] < grid?.length &&
  position[1] >= 0 &&
  position[1] < grid[0]?.length

export const movePosition = (position: Position, movement: [number, number]) =>
  [position[0] + movement[0], position[1] + movement[1]] as Position

export const getValueAtPosition = <T>(grid: Grid<T>, position: Position) =>
  grid?.[position[0]]?.[position[1]]

export const findPositionsInGrid = <T>(
  grid: Grid<T>,
  predicate: (arg0: T) => boolean,
): Position[] =>
  grid.flatMap((row, i) =>
    row
      .map((value, j) => (predicate(value) ? ([i, j] as Position) : null))
      .filter(Boolean),
  ) as Position[]

export const isSamePosition = (positionA: Position, positionB: Position) =>
  positionA?.[0] === positionB?.[0] && positionA?.[1] === positionB?.[1]

export const copyGrid = <T>(grid: Grid<T>): Grid<T> =>
  grid.map(row => row.slice())

export const getNeighbors = (position: Position) =>
  Object.values(DirectionVectors).map(vector => movePosition(position, vector))

export const getManhattanDistance = (positionA: Position, positionB: Position) =>
  Math.abs(positionA[0] - positionB[0]) + Math.abs(positionA[1] - positionB[1])
