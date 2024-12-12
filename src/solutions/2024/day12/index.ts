/**
 * Advent of Code 2024
 * Day 12
 * https://adventofcode.com/2024/day/12
 */
import data from './input'
import { createZones, type Zone } from './zone'

const grid = data.split('\n').map(line => line.split(''))
const zones = createZones(grid)

// Part 1
let price = zones
  .map(zone => zone.edges.length * zone.positions.length)
  .reduce((sum, value) => sum + value, 0)

console.log(`Part 1: ${price}`)

// Part 2
const countSides = (zone: Zone): number => {
  let sides = 0
  const edges = zone.edges.map(edge => ({ ...edge, seen: false }))
  for (const [index, edge] of edges.entries()) {
    edge.seen = true
    const adjecentEdges = [edges[index - 1], edges[index + 1]]
    const isNewSide = adjecentEdges
      .filter(other => {
        if (edge.side !== other?.side) return false
        const dy = Math.abs(other.position[0] - edge.position[0])
        const dx = Math.abs(other.position[1] - edge.position[1])
        switch (edge.side) {
          case 'UP':
          case 'DOWN':
            return dy === 0 && dx === 1
          case 'LEFT':
          case 'RIGHT':
            return dy === 1 && dx === 0
        }
      })
      .every(edge => !edge.seen)
    if (isNewSide) sides += 1
  }
  return sides
}

price = zones
  .map(zone => countSides(zone) * zone.positions.length)
  .reduce((sum, value) => sum + value, 0)

console.log(`Part 2: ${price}`)
