/**
 * Advent of Code 2024
 * Day 16
 * https://adventofcode.com/2024/day/16
 */
import {
  Direction,
  type DirectionName,
  DirectionVectors,
  findPositionsInGrid,
  getValueAtPosition,
  type Grid,
  movePosition,
  type Position,
} from '../../../utils/grids'
import data from './input'

type Distance = number
type Node = {
  position: Position
  direction: Direction
  distance: Distance
  prevs: Node[]
}
type NodeID = string
type Path = string[]

const START = 'S'
const END = 'E'
const WALL = '#'

const getNodeID = (node: Node) => `${node.position}_${node.direction}`

const getClosestNode = (nodes: Map<NodeID, Node>): Node =>
  Array.from(nodes.values()).reduce<Node>(
    (best, node) => (node.distance < best.distance ? node : best),
    { distance: Infinity } as Node,
  )

const getNextNodes = (current: Node) => {
  const { position, direction, distance } = current
  const nextDirections = [Direction.Up, Direction.Down].includes(direction)
    ? [Direction.Left, Direction.Right]
    : [Direction.Up, Direction.Down]

  return nextDirections
    .map(next => ({
      position: position,
      direction: next,
      distance: distance + 1000,
    }))
    .concat({
      position: movePosition(
        position,
        DirectionVectors[Direction[direction] as DirectionName],
      ),
      direction: direction,
      distance: distance + 1,
    })
    .map(node => ({
      ...node,
      prevs: [current],
    }))
}

const updateNodesMap = (nodes: Node[], map: Map<NodeID, Node>) => {
  for (const node of nodes) {
    const id = getNodeID(node)
    const existing = map.get(id)
    if (existing == null) {
      map.set(id, node)
      continue
    }
    if (existing.distance === node.distance) {
      existing.prevs.push(...node.prevs)
    }
    const entry = existing.distance <= node.distance ? existing : node
    map.set(id, entry)
  }
}

const findPath = (grid: Grid<string>, start: Position) => {
  const visited: Set<NodeID> = new Set()
  const startNode = {
    position: start,
    direction: Direction.Right,
    distance: 0,
    prevs: [],
  }
  const unvisited: Map<NodeID, Node> = new Map([
    [getNodeID(startNode), startNode],
  ])

  while (unvisited.size > 0) {
    const current = getClosestNode(unvisited)
    const { position } = current

    unvisited.delete(getNodeID(current))
    visited.add(getNodeID(current))

    if (getValueAtPosition(grid, position) === END) {
      return current
    }

    const nextNodes = getNextNodes(current).filter(
      node =>
        getValueAtPosition(grid, node.position) !== WALL &&
        !visited.has(getNodeID(node)),
    )
    updateNodesMap(nextNodes, unvisited)
  }

  return undefined
}

const grid = data.split('\n').map(row => row.split(''))

// Part 1
const start = findPositionsInGrid(grid, x => x === START).flat() as Position
const pathNode = findPath(grid, start)
console.log(`Part 1: ${pathNode?.distance}`)

// Part 2
const buildPaths = (node?: Node): Path[] => {
  if (node == null) return []
  const position = String(node.position)
  if (node.prevs.length === 0) return [[position]]

  const paths = node.prevs.flatMap(prev =>
    buildPaths(prev).map(path => path.concat(position)),
  )

  return paths
}

const tiles = new Set(buildPaths(pathNode).flat()).size
console.log(`Part 2: ${tiles}`)
