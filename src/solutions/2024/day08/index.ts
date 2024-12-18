/**
 * Advent of Code 2024
 * Day 08
 * https://adventofcode.com/2024/day/8
 */
import { type Grid, type Position, isInGrid } from '../../../utils/grids'
import data from './input'

type Frequency = string
type AntennaPair = [Position, Position]
type AntennaID = string

const EMPTY = '.' as const

const grid = data.split('\n').map(line => line.split(''))
const antennas = grid.reduce<Map<Frequency, Position[]>>(
  (acc, row, i) =>
    row.reduce(
      (acc, cell, j) =>
        cell !== EMPTY ? acc.set(cell, [...(acc.get(cell) ?? []), [i, j]]) : acc,
      acc,
    ),
  new Map(),
)

const getAntennaPairs = (antennas: Position[]) =>
  antennas.flatMap((antenna, i, antennas) =>
    antennas.slice(i + 1).map(antenna2 => [antenna, antenna2] as AntennaPair),
  )

const findNodes =
  (nodeFindingMethod: (antennaPair: AntennaPair) => Position[]) =>
  (antennas: Position[]) =>
    getAntennaPairs(antennas).flatMap(pair => nodeFindingMethod(pair))

const findNodesPair = (antennaPair: AntennaPair) => {
  const [[y1, x1], [y2, x2]] = antennaPair
  const [dy, dx] = [y2 - y1, x2 - x1]

  return [
    [y2 + dy, x2 + dx],
    [y1 - dy, x1 - dx],
  ] as AntennaPair
}

const findNodesLine =
  (grid: Grid<string>) => (antennaPair: [Position, Position]) => {
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

// Part 1
let nodes = [...antennas.values()]
  .flatMap(findNodes(findNodesPair))
  .filter(position => isInGrid(grid, position))
  .reduce<Set<AntennaID>>(
    (set, position) => set.add(position.toString()),
    new Set(),
  )

console.log(`Part 1: ${nodes.size}`)

// Part 2
nodes = [...antennas.values()]
  .flatMap(findNodes(findNodesLine(grid)))
  .reduce<
    Set<AntennaID>
  >((set, position) => set.add(position.toString()), new Set())

console.log(`Part 2: ${nodes.size}`)
