/**
 * Advent of Code 2024
 * Day 08
 * https://adventofcode.com/2024/day/8
 */
import data from './input'
import { type Position, EMPTY, isInGrid } from '../../../../utils/grid'

const grid = data
  .split('\n')
  .map(line => line.split(''))

const [WIDTH, HEIGHT] = [grid[0].length, grid.length]

const antennas = grid
  .reduce((acc, row, i) =>
    row.reduce((acc, cell, j) => (
      cell !== EMPTY
        ? acc.set(cell, [...(acc.get(cell) ?? []), [i, j]])
        : acc
    ), acc), new Map<string, Position[]>())

const getAntennaPairs = (antennas: Position[]) =>
  antennas.flatMap((antenna, i, antennas) =>
    antennas.slice(i + 1).map((antenna2) => [antenna, antenna2] as [Position, Position]))

const findNodes = (nodeFindingMethod: (antennaPair: [Position, Position]) => Position[]) =>
  (antennas: Position[]) => getAntennaPairs(antennas).flatMap((pair) => nodeFindingMethod(pair))

// Part 1
const findNodesPair = (antennaPair: [Position, Position]) => {
  const [[y1, x1], [y2, x2]] = antennaPair
  const [dy, dx] = [y2 - y1, x2 - x1]

  return [[y2 + dy, x2 + dx], [y1 - dy, x1 - dx]] as [Position, Position]
}

let nodes = [...antennas.values()]
  .flatMap(findNodes(findNodesPair))
  .filter(position => isInGrid(position, WIDTH, HEIGHT))
  .reduce((set, position) => set.add(position.toString()), new Set<string>())

console.log(`Part 1: ${nodes.size}`)


// Part 2
const findNodesLine = (antennaPair: [Position, Position]) => {
  let [[y1, x1], [y2, x2]] = antennaPair
  const [dy, dx] = [y2 - y1, x2 - x1]

  const nodes: Position[] = []
  while (isInGrid([y1, x1], WIDTH, HEIGHT)) {
    nodes.push([y1, x1]);
    [y1, x1] = [y1 - dy, x1 - dx]
  }

  while (isInGrid([y2, x2], WIDTH, HEIGHT)) {
    nodes.push([y2, x2]);
    [y2, x2] = [y2 + dy, x2 + dx]
  }

  return nodes
}

nodes = [...antennas.values()]
  .flatMap(findNodes(findNodesLine))
  .filter(position => isInGrid(position, WIDTH, HEIGHT))
  .reduce((set, position) => set.add(position.toString()), new Set<string>())

console.log(`Part 2: ${nodes.size}`)
