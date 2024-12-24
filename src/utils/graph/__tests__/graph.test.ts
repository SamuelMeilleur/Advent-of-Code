import { addEdge, addNode, createGraph, removeEdge, removeNode } from '../graph'

describe('graph', () => {
  describe('createGraph', () => {
    it('should return a new graph with no nodes and edges', () => {
      const graph = createGraph()

      expect(graph).toHaveProperty('nodes')
      expect(graph).toHaveProperty('edges')
      expect(graph.nodes).toEqual(new Set())
      expect(graph.edges).toEqual(new Map())
    })
  })

  describe('addNode', () => {
    it('should add the node to the graph', () => {
      const graph = createGraph()
      addNode(graph, 'my_node')

      expect(graph.nodes.size).toBe(1)
      expect(graph.edges.size).toBe(0)
      expect(graph.nodes.has('my_node')).toBe(true)
    })
  })

  describe('addEdge', () => {
    it('should add an edge from each node to the other if both exist', () => {
      const graph = createGraph()
      addNode(graph, 'node1')
      addNode(graph, 'node2')

      addEdge(graph, 'node1', 'node2')
      expect(graph.edges.size).toBe(2)
      expect(graph.edges.get('node1')).toEqual(new Set(['node2']))
      expect(graph.edges.get('node2')).toEqual(new Set(['node1']))
    })

    it('should be able to add more than 1 edge to a node', () => {
      const graph = createGraph()
      addNode(graph, 'node1')
      addNode(graph, 'node2')
      addEdge(graph, 'node1', 'node2')

      addNode(graph, 'node3')
      addEdge(graph, 'node1', 'node3')

      expect(graph.edges.size).toBe(3)
      expect(graph.edges.get('node1')).toEqual(new Set(['node2', 'node3']))
      expect(graph.edges.get('node2')).toEqual(new Set(['node1']))
      expect(graph.edges.get('node3')).toEqual(new Set(['node1']))
    })

    it('should throw an error if the nodes of the edge do not exist', () => {
      const graph = createGraph()
      addNode(graph, 'node1')

      expect(() => addEdge(graph, 'node1', 'node2')).toThrow()
      expect(() => addEdge(graph, 'node2', 'node1')).toThrow()

      expect(graph.edges.size).toBe(0)
      expect(graph.edges.get('node1')).toBeUndefined()
      expect(graph.edges.get('node2')).toBeUndefined()
    })
  })

  describe('removeEdge', () => {
    it('should remove the edge from both nodes', () => {
      const graph = createGraph()
      addNode(graph, 'node1')
      addNode(graph, 'node2')
      addNode(graph, 'node3')

      addEdge(graph, 'node1', 'node2')
      addEdge(graph, 'node1', 'node3')

      removeEdge(graph, 'node1', 'node2')

      expect(graph.edges.get('node1')).not.toContain('node2')
      expect(graph.edges.get('node1')).toContain('node3')
    })
  })

  describe('removeNode', () => {
    it('should remove the node from the nodes of the graph', () => {
      const graph = createGraph()
      addNode(graph, 'node1')
      addNode(graph, 'node2')
      addNode(graph, 'node3')

      removeNode(graph, 'node1')

      expect(graph.nodes).not.toContain('node1')
      expect(graph.nodes.size).toBe(2)
    })

    it('should remove any edges of the node', () => {
      const graph = createGraph()
      addNode(graph, 'node1')
      addNode(graph, 'node2')
      addNode(graph, 'node3')

      addEdge(graph, 'node1', 'node2')
      addEdge(graph, 'node1', 'node3')

      removeNode(graph, 'node1')

      expect(graph.edges.get('node2')?.size).toBe(0)
      expect(graph.edges.get('node3')?.size).toBe(0)
    })

    it('should do nothing if node does not exist', () => {
      const graph = createGraph()
      addNode(graph, 'node1')

      expect(() => removeNode(graph, 'node2')).not.toThrow()
    })
  })
})
