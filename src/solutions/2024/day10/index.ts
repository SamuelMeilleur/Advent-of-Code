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
  type Position
} from "../../../../utils/grid"
import data from './input'

const TRAILHEAD = 0
const TRAILEND = 9

// returns a map of all positions at a given elevation (map-key)
const computeElevationsMap = (grid: number[][]) => grid
  .flatMap((line, i) => (
    line.map((height, j) => (
      [height, [i, j]] as [number, Position]
    ))
  ))
  .reduce((map, [elevation, position]) => (
    map.set(elevation, [...(map.get(elevation) ?? []), position])
  ), new Map<number, Position[]>())


const getAccessibleTrailends = (grid: number[][]) => {
  const elevationMap = computeElevationsMap(grid)
  const accessibleTrailEnds = elevationMap
    .get(TRAILEND)
    .reduce((map, trailend) => (
      map.set(trailend.toString(), [trailend.toString()])
    ), new Map<string, string[]>())

  for (let h = TRAILEND - 1; h >= TRAILHEAD; h--) {
    for (const position of elevationMap.get(h)) {
      for (const direction of ORTHOGONAL_DIRECTIONS) {
        const neighbour = movePosition(position, direction)
        const neighbourAccesses = accessibleTrailEnds.get(neighbour.toString())
        if (getValueAtPosition(grid, neighbour) !== h + 1
          || neighbourAccesses == null) {
          continue
        }

        accessibleTrailEnds.set(
          position.toString(),
          (accessibleTrailEnds.get(position.toString()) ?? []).concat(neighbourAccesses)
        )
      }
    }
  }

  return accessibleTrailEnds
}

const elevationGrid = data
  .split('\n')
  .map(line => line.split('').map(Number))

const trailheads = findPositionsInGrid(elevationGrid, height => height === TRAILHEAD)


// Part 1 
const getTrailScore = (grid: number[][]) => {
  const accessesMap = getAccessibleTrailends(grid)
  return (trailhead: Position) => accessesMap
    .get(trailhead.toString())
    .reduce((set, trailend) => set.add(trailend), new Set())
    .size
}

let score = trailheads
  .map(getTrailScore(elevationGrid))
  .reduce((sum, accesses) => sum + accesses, 0)

console.log(`Part 1: ${score}`)


// Part 2
const getTrailRating = (grid: number[][]) => {
  const accessesMap = getAccessibleTrailends(grid)
  return (trailhead: Position) => accessesMap
    .get(trailhead.toString()).length
}

score = trailheads
  .map(getTrailRating(elevationGrid))
  .reduce((sum, accesses) => sum + accesses, 0)

console.log(`Part 2: ${score}`)
