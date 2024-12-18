import {
  Direction,
  type DirectionName,
  DirectionVectors,
  getValueAtPosition,
  type Grid,
  isInGrid,
  isSamePosition,
  movePosition,
  type Position,
  type Vector,
} from '../../../utils/grids'

type Side = DirectionName
type Edge = {
  side: Side
  position: Position
}
type Zone = {
  type: string
  perimeter: number
  sides: number
  positions: Position[]
}
type EdgeID = string

const computeEdges = (position: Position, neighbors: Position[]): Edge[] =>
  Object.entries(DirectionVectors)
    .map(([direction, vector]) => ({
      side: direction as Side,
      position: movePosition(position, vector),
    }))
    .filter(edge =>
      // only keep edges in directions with no neighbors
      neighbors.every(neighbor => !isSamePosition(edge.position, neighbor)),
    )

const getEdgeID = (edge: Edge): EdgeID => `${edge.side}_${edge.position}`

const sortEdges = (edges: Edge[]): Edge[] =>
  edges.sort((A, B) => {
    if (A.side !== B.side) {
      return Direction[A.side] - Direction[B.side]
    }
    const dy = A.position[0] - B.position[0]
    const dx = A.position[1] - B.position[1]
    switch (Direction[A.side]) {
      case Direction.Up:
      case Direction.Down:
        return dy !== 0 ? dy : dx
      case Direction.Left:
      case Direction.Right:
        return dx !== 0 ? dx : dy
    }
  })

const countSides = (edges: Edge[]): number => {
  const seen: Set<EdgeID> = new Set()
  return sortEdges(edges).reduce<number>((sides, edge, index, edges) => {
    seen.add(getEdgeID(edge))
    const adjecentEdges = edges.slice(index - 1, index + 2).filter(other => {
      if (edge.side !== other?.side) return false
      const dy = Math.abs(other.position[0] - edge.position[0])
      const dx = Math.abs(other.position[1] - edge.position[1])
      switch (Direction[edge.side]) {
        case Direction.Up:
        case Direction.Down:
          return dy === 0 && dx === 1
        case Direction.Left:
        case Direction.Right:
          return dy === 1 && dx === 0
      }
    })
    return adjecentEdges.every(other => !seen.has(getEdgeID(other)))
      ? sides + 1
      : sides
  }, 0)
}

const buildZone = (grid: Grid<string>, start: Position): Zone => {
  const type = getValueAtPosition(grid, start)
  const zone = {
    type,
    perimeter: 0,
    sides: 0,
    positions: [],
  } as Zone

  const edges: Edge[] = []
  const queue = [start]
  while (queue.length > 0) {
    const position = queue.pop() as Vector
    zone.positions.push(position)

    const neighbors = Object.values(DirectionVectors)
      .map(direction => movePosition(position, direction))
      .filter(
        neighbor =>
          isInGrid(grid, neighbor) && getValueAtPosition(grid, neighbor) === type,
      )

    edges.push(...computeEdges(position, neighbors))
    zone.perimeter += 4 - neighbors.length

    const nextPositions = neighbors.filter(
      position =>
        zone.positions.every(seen => !isSamePosition(position, seen)) &&
        queue.every(seen => !isSamePosition(position, seen)),
    )
    queue.push(...nextPositions)
  }

  zone.sides = countSides(edges)
  return zone
}

export { buildZone, type Zone }
