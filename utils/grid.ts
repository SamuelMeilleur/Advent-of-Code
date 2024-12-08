export type Position = [number, number]

export const EMPTY = '.'

export const isInGrid = (position: Position, width: number, height: number) =>
  position[0] >= 0 && position[0] < height &&
  position[1] >= 0 && position[1] < width

export const moveInGrid = (position: Position, movement: [number, number]) =>
  [position[0] + movement[0], position[1] + movement[1]]
