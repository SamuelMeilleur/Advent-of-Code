/**
 * Advent of Code 2024
 * Day 12
 * https://adventofcode.com/2024/day/12
 */
import { Grid } from '../../../utils/grid'
import data from './input'
import { buildZone, type Zone } from './zone'

type PositionID = string

const generateZones = (grid: Grid<string>): Zone[] => {
  const seen: PositionID[] = []
  return grid.reduce<Zone[]>(
    (gridZones, row, i) =>
      gridZones.concat(
        row.reduce((zones, _, j) => {
          if (seen.includes(String([i, j]))) return zones
          const zone = buildZone(grid, [i, j])
          seen.push(...zone.positions.map(String))
          return zones.concat(zone)
        }, []),
      ),
    [],
  )
}

const grid = data.split('\n').map(line => line.split(''))
const zones = generateZones(grid)

// Part 1
let price = zones
  .map(zone => zone.perimeter * zone.positions.length)
  .reduce((sum, value) => sum + value, 0)
console.log(`Part 1: ${price}`)

// Part 2
price = zones
  .map(zone => zone.sides * zone.positions.length)
  .reduce((sum, value) => sum + value, 0)

console.log(`Part 2: ${price}`)
