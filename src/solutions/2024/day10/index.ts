/**
 * Advent of Code 2024
 * Day 10
 * https://adventofcode.com/2024/day/10
 */
import {
  findPositionsInGrid,
  getValueAtPosition,
  movePosition,
  DirectionVectors,
  type Position,
  Grid,
} from '../../../utils/grid'
import data from './input'

type Elevation = number
type PositionID = string
type SummitID = string

const TRAILHEAD = 0 as const
const SUMMIT = 9 as const

const computeElevationsMap = (grid: Grid<Elevation>) =>
  grid
    .flatMap((line, i) =>
      line.map((height, j) => [height, [i, j]] as [Elevation, Position]),
    )
    .reduce<
      Map<Elevation, Position[]>
    >((map, [elevation, position]) => map.set(elevation, (map.get(elevation) ?? []).concat([position])), new Map())

const getAccessibleSummits = (grid: Grid<Elevation>) => {
  const positionsByElevation = computeElevationsMap(grid)
  const summits = positionsByElevation
    .get(SUMMIT)
    .reduce<
      Map<PositionID, SummitID[]>
    >((map, trailend) => map.set(trailend.toString(), [trailend.toString()]), new Map())

  for (let height = SUMMIT - 1; height >= TRAILHEAD; height--) {
    for (const position of positionsByElevation.get(height)) {
      for (const direction of Object.values(DirectionVectors)) {
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

const elevationGrid: Grid<Elevation> = data
  .split('\n')
  .map(line => line.split('').map(Number))
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
