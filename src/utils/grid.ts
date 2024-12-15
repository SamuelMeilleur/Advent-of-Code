export type Vector = [number, number]
export type Position = Vector
export type Grid<T> = T[][]

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
export type DirectionName = keyof typeof Direction

type Directions = {
  [key in DirectionName]: Vector
}
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
) =>
  grid
    .reduce(
      (positions, line, i) => [
        ...positions,
        line.reduce(
          (matches, value, j) =>
            predicate(value) ? [...matches, [i, j]] : matches,
          [],
        ),
      ],
      [] as Position[],
    )
    .flat()
    .filter(position => position.length > 0) as Position[]

export const isSamePosition = (positionA: Position, positionB: Position) =>
  positionA[0] === positionB[0] && positionA[1] === positionB[1]

export const copyGrid = <T>(grid: Grid<T>): Grid<T> =>
  grid.map(row => row.slice())
