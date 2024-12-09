export type Position = [number, number]

export const EMPTY = '.'

export const ORTHOGONAL_DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
] as Position[]

export const isInGrid = <T>(grid: T[][], position: Position) =>
  position[0] >= 0 &&
  position[0] < grid?.length &&
  position[1] >= 0 &&
  position[1] < grid[0]?.length

export const movePosition = (position: Position, movement: [number, number]) =>
  [position[0] + movement[0], position[1] + movement[1]] as Position

export const getValueAtPosition = <T>(grid: T[][], position: Position) =>
  grid?.[position[0]]?.[position[1]]

export const findPositionsInGrid = <T>(
  grid: T[][],
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
