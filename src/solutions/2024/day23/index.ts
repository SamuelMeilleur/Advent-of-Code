/**
 * Advent of Code 2024
 * Day 23
 * https://adventofcode.com/2024/day/23
 */
import { addEdge, addNode, createGraph, type Graph } from '../../../utils/graph'
import data from './input'

type ID = string
type Lan = ID[]

const buildNetwork = (connections: [ID, ID][]) => {
  const network = connections.reduce<Graph>((graph, [id1, id2]) => {
    addNode(graph, id1)
    addNode(graph, id2)
    addEdge(graph, id1, id2)
    return graph
  }, createGraph())

  return network
}

const findLans = (
  network: Graph,
  current: ID,
  lan: Lan = [],
  visited = new Set<ID>(),
): Lan[] => {
  visited.add(current)

  const lans: Lan[] = []
  const index = lan.findIndex(id => id === current)
  if (index !== -1) return lans.concat([lan.slice(index).sort()])
  if (lan.length >= 3) return lans

  for (const next of network.edges.get(current) ?? []) {
    if (next === lan.at(-1)) continue
    if (visited.has(next)) continue
    lans.push(...findLans(network, next, lan.slice().concat(current)))
  }

  return lans
}

const removeDuplicates = (lans: Lan[]) =>
  Array.from(new Set(lans.map(lan => lan.toString())), lan => lan.split(','))

// Part 1
const connections = data.split('\n').map(line => line.split('-')) as [ID, ID][]
const network = buildNetwork(connections)

const lans = removeDuplicates(
  Array.from(network.nodes.values()).flatMap(node => findLans(network, node)),
).filter(lan => lan.length === 3)

const result = Array.from(lans.values()).filter(lan =>
  lan.some(id => id.startsWith('t')),
).length
console.log(`Part 1: ${result}`)

// Part 2
let largest: ID[] = []
const visited: Set<ID> = new Set()
for (const [i, lan] of lans.entries()) {
  if (visited.has(lan.toString())) continue

  const current = new Set(lan)
  for (const next of lans.slice(i + 1)) {
    const allConnected = next
      .filter(id => !current.has(id))
      .every(id =>
        Array.from(current.values()).every(other =>
          network.edges.get(id)?.has(other),
        ),
      )
    if (allConnected) {
      visited.add(next.toString())
      next.forEach(id => current.add(id))
    }
  }
  if (current.size > largest.length) {
    largest = Array.from(current.values())
  }
}

console.log(`Part 2: ${largest.sort().join(',')}`)
