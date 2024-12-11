/**
 * Advent of Code 2024
 * Day 08
 * https://adventofcode.com/2024/day/8
 */
import { type Position, EMPTY, isInGrid } from '../../../utils/grid'
import data from './input'

const grid = data.split('\n').map(line => line.split(''))

const antennas = grid.reduce(
  (acc, row, i) =>
    row.reduce(
      (acc, cell, j) =>
        cell !== EMPTY ? acc.set(cell, [...(acc.get(cell) ?? []), [i, j]]) : acc,
      acc,
    ),
  new Map<string, Position[]>(),
)

const getAntennaPairs = (antennas: Position[]) =>
  antennas.flatMap((antenna, i, antennas) =>
    antennas
      .slice(i + 1)
      .map(antenna2 => [antenna, antenna2] as [Position, Position]),
  )

const findNodes =
  (nodeFindingMethod: (antennaPair: [Position, Position]) => Position[]) =>
  (antennas: Position[]) =>
    getAntennaPairs(antennas).flatMap(pair => nodeFindingMethod(pair))

// Part 1
const findNodesPair = (antennaPair: [Position, Position]) => {
  const [[y1, x1], [y2, x2]] = antennaPair
  const [dy, dx] = [y2 - y1, x2 - x1]

  return [
    [y2 + dy, x2 + dx],
    [y1 - dy, x1 - dx],
  ] as [Position, Position]
}

let nodes = [...antennas.values()]
  .flatMap(findNodes(findNodesPair))
  .filter(position => isInGrid(grid, position))
  .reduce((set, position) => set.add(position.toString()), new Set<string>())

console.log(`Part 1: ${nodes.size}`)

// Part 2
const findNodesLine =
  (grid: string[][]) => (antennaPair: [Position, Position]) => {
    let [[y1, x1], [y2, x2]] = antennaPair
    const [dy, dx] = [y2 - y1, x2 - x1]

    const nodes: Position[] = []
    while (isInGrid(grid, [y1, x1])) {
      nodes.push([y1, x1])
      ;[y1, x1] = [y1 - dy, x1 - dx]
    }

    while (isInGrid(grid, [y2, x2])) {
      nodes.push([y2, x2])
      ;[y2, x2] = [y2 + dy, x2 + dx]
    }

    return nodes
  }

nodes = [...antennas.values()]
  .flatMap(findNodes(findNodesLine(grid)))
  .reduce((set, position) => set.add(position.toString()), new Set<string>())

console.log(`Part 2: ${nodes.size}`)
