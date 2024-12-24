import { type Graph, type NodeID } from './types'

export const createGraph = (): Graph => {
  const graph = {
    nodes: new Set<NodeID>(),
    edges: new Map<NodeID, Set<NodeID>>(),
  }
  return graph
}

export const addNode = (graph: Graph, node: NodeID) => {
  graph.nodes.add(node)
}

export const addEdge = (graph: Graph, node1: NodeID, node2: NodeID) => {
  if (!graph.nodes.has(node1))
    throw Error(`Cannot add edge to unexistant node: ${node1}`)
  if (!graph.nodes.has(node2))
    throw Error(`Cannot add edge to unexistant node: ${node2}`)

  const node1Edges = (graph.edges.get(node1) ?? new Set()).add(node2)
  const node2Edges = (graph.edges.get(node2) ?? new Set()).add(node1)

  graph.edges.set(node1, node1Edges)
  graph.edges.set(node2, node2Edges)
}

export const removeEdge = (graph: Graph, node1: NodeID, node2: NodeID) => {
  graph.edges.get(node1)?.delete(node2)
  graph.edges.get(node2)?.delete(node1)
}

export const removeNode = (graph: Graph, node: NodeID) => {
  if (!graph.nodes.delete(node)) return

  const nodeEdges = graph.edges.get(node)
  const others = Array.from(nodeEdges?.values() ?? [])

  others.forEach(other => graph.edges.get(other)?.delete(node))
  nodeEdges?.clear()
}
