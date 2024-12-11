/**
 * Advent of Code 2024
 * Day 10
 * https://adventofcode.com/2024/day/10
 */
import {
  findPositionsInGrid,
  getValueAtPosition,
  movePosition,
  ORTHOGONAL_DIRECTIONS,
  type Position,
} from '../../../utils/grid'
import data from './input'

const TRAILHEAD = 0
const SUMMIT = 9

// returns a map of all positions at a same elevation (map-key)
const computeElevationsMap = (grid: number[][]) =>
  grid
    .flatMap((line, i) =>
      line.map((height, j) => [height, [i, j]] as [number, Position]),
    )
    .reduce(
      (map, [elevation, position]) =>
        map.set(elevation, (map.get(elevation) ?? []).concat([position])),
      new Map<number, Position[]>(),
    )

// returns list of accessible summits from given position (map-key)
const getAccessibleSummits = (grid: number[][]) => {
  const elevationMap = computeElevationsMap(grid)
  const summits = elevationMap
    .get(SUMMIT)
    .reduce(
      (map, trailend) => map.set(trailend.toString(), [trailend.toString()]),
      new Map<string, string[]>(),
    )

  for (let height = SUMMIT - 1; height >= TRAILHEAD; height--) {
    for (const position of elevationMap.get(height)) {
      for (const direction of ORTHOGONAL_DIRECTIONS) {
        const neighbourPosition = movePosition(position, direction)
        if (getValueAtPosition(grid, neighbourPosition) !== height + 1) continue

        const neighbourAccesses = summits.get(neighbourPosition.toString())
        if (neighbourAccesses != null) {
          summits.set(
            position.toString(),
            (summits.get(position.toString()) ?? []).concat(neighbourAccesses),
          )
        }
      }
    }
  }
  return summits
}

const elevationGrid = data.split('\n').map(line => line.split('').map(Number))

const summitsByPosition = getAccessibleSummits(elevationGrid)
const trailheads = findPositionsInGrid(elevationGrid, x => x === TRAILHEAD)

// Part 1
let score = trailheads
  .map(trailhead => summitsByPosition.get(trailhead.toString()))
  .map(summits => new Set(summits).size)
  .reduce((sum, value) => sum + value, 0)

console.log(`Part 1: ${score}`)

// Part 2
score = trailheads
  .map(trailhead => summitsByPosition.get(trailhead.toString())?.length)
  .reduce((sum, value) => sum + value, 0)

console.log(`Part 2: ${score}`)
