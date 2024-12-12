import {
  getValueAtPosition,
  isInGrid,
  isSamePosition,
  movePosition,
  Directions,
  Position,
} from '../../../utils/grid'

export type Side = keyof typeof Directions
export type Edge = {
  side: Side
  position: Position
}
export type Zone = {
  type: string
  edges: Edge[]
  positions: Position[]
}

const SIDE_PRIORITY = Object.keys(Directions).reduce(
  (priorities, key, index) => ({
    ...priorities,
    [key]: index,
  }),
  {},
)

const getEdges = (position: Position, neighbors: Position[]): Edge[] =>
  Object.entries(Directions)
    .map(([side, direction]) => ({
      side: side as Side,
      position: movePosition(position, direction),
    }))
    .filter(edge =>
      // only keep edges in directions with no neighbors
      neighbors.every(neighbor => !isSamePosition(edge.position, neighbor)),
    )

const createZone = (grid: string[][], start: Position): Zone => {
  const type = getValueAtPosition(grid, start)
  const zone = {
    type,
    edges: [],
    positions: [],
  } as Zone
  const queue = [start]
  while (queue.length > 0) {
    const position = queue.pop()
    zone.positions.push(position)

    const neighbors = Object.values(Directions)
      .map(direction => movePosition(position, direction))
      .filter(
        neighbor =>
          isInGrid(grid, neighbor) && getValueAtPosition(grid, neighbor) === type,
      )

    zone.edges = zone.edges.concat(getEdges(position, neighbors))
    queue.push(
      ...neighbors.filter(neighbor =>
        queue
          .concat(zone.positions)
          .every(seen => !isSamePosition(neighbor, seen)),
      ),
    )
  }

  zone.edges = zone.edges.sort((A, B) => {
    if (A.side !== B.side) {
      return SIDE_PRIORITY[A.side] - SIDE_PRIORITY[B.side]
    }
    const dy = A.position[0] - B.position[0]
    const dx = A.position[1] - B.position[1]
    switch (A.side) {
      case 'UP':
      case 'DOWN':
        return dy !== 0 ? dy : dx
      case 'LEFT':
      case 'RIGHT':
        return dx !== 0 ? dx : dy
    }
  })

  return zone
}

export const createZones = (grid: string[][]) => {
  const seen = [] as string[]
  return grid.reduce(
    (zones, row, i) =>
      zones.concat(
        row.reduce((zones, _, j) => {
          if (seen.includes(String([i, j]))) return zones
          const zone = createZone(grid, [i, j])
          seen.push(...zone.positions.map(String))
          return zones.concat(zone)
        }, []),
      ),
    [] as Zone[],
  )
}
