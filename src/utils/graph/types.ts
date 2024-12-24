export type NodeID = string

export type Graph = {
  nodes: Set<NodeID>
  edges: Map<NodeID, Set<NodeID>>
}
