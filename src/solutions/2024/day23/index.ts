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

const findLans = (network: Graph) => {
  const lans: Map<ID, Lan> = new Map()
  for (const node of network.nodes) {
    findLansRecursive(network, node).forEach(lan => lans.set(lan.toString(), lan))
  }

  return Array.from(lans.values())
}

const findLansRecursive = (network: Graph, current: ID, lan: Lan = []): Lan[] => {
  const index = lan.findIndex(id => id === current)
  if (index !== -1) {
    if (lan.length === 1) return []
    return [lan.slice(index)]
  }
  if (lan.length >= 3) return []

  const lans: Lan[] = []
  for (const next of network.edges.get(current) ?? []) {
    lans.push(...findLansRecursive(network, next, lan.slice().concat(current)))
  }

  return lans.map(lan => lan.sort())
}

const connections = data.split('\n').map(line => line.split('-')) as [ID, ID][]
const network = buildNetwork(connections)

const lans = findLans(network)

const result = lans
  .filter(lan => lan.length === 3)
  .filter(lan => lan.some(id => id.startsWith('t'))).length
console.log(`Part 1: ${result}`)
