type Grid<T = string> = T[][]

type Vector = [number, number]
type Position = Vector

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

type DirectionName = keyof typeof Direction

type Directions = {
  [key in DirectionName]: Vector
}

export type { Grid, Vector, Position, Directions, DirectionName }
export { Direction }
