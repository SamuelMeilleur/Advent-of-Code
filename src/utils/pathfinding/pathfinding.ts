import {
  DirectionVectors,
  getValueAtPosition,
  isInGrid,
  isSamePosition,
  movePosition,
  type Grid,
  type Position,
} from '../grids'
import type { Node, Path } from './types'

export const OBSTACLE = '#'
export const EMPTY = '.'

const buildPath = (end: Node) => {
  let current: Node | undefined = end
  const path: Path = []
  while (current != null) {
    path.unshift(current.position)
    current = current.prev
  }

  return path
}

const findPath = (grid: Grid<string>, start: Position, end: Position) => {
  const seen: Set<string> = new Set(String(start))
  const queue: Node[] = [
    {
      position: start,
    },
  ]

  while (queue.length > 0) {
    const current = queue.pop() as Node
    if (isSamePosition(current.position, end)) return buildPath(current)

    const nextNodes: Node[] = Object.values(DirectionVectors)
      .map(vector => movePosition(current.position, vector))
      .filter(
        position =>
          isInGrid(grid, position) &&
          getValueAtPosition(grid, position) !== OBSTACLE &&
          !seen.has(String(position)),
      )
      .map(position => ({
        position,
        prev: current,
      }))

    nextNodes.forEach(node => seen.add(String(node.position)))
    queue.unshift(...nextNodes)
  }

  return []
}

export { buildPath, findPath }
