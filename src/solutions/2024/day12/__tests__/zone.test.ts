import type { Grid } from '../../../../utils/grids'
import { buildZone } from '../zone'

describe('zone', () => {
  describe('buildZone', () => {
    it('should build a correct zone - simple grid', () => {
      const grid: Grid<string> = [
        ['A', 'A', 'A', 'A'],
        ['B', 'B', 'C', 'D'],
        ['B', 'B', 'C', 'C'],
        ['E', 'E', 'E', 'C'],
      ]

      const zoneA = buildZone(grid, [0, 0])
      expect(zoneA.perimeter).toBe(10)
      expect(zoneA.sides).toBe(4)
      expect(zoneA.positions.length).toEqual(4)

      const zoneB = buildZone(grid, [1, 0])
      expect(zoneB.perimeter).toBe(8)
      expect(zoneB.sides).toBe(4)
      expect(zoneB.positions.length).toEqual(4)

      const zoneC = buildZone(grid, [1, 2])
      expect(zoneC.perimeter).toBe(10)
      expect(zoneC.sides).toBe(8)
      expect(zoneC.positions.length).toEqual(4)

      const zoneD = buildZone(grid, [1, 3])
      expect(zoneD.perimeter).toBe(4)
      expect(zoneD.sides).toBe(4)
      expect(zoneD.positions.length).toEqual(1)

      const zoneE = buildZone(grid, [3, 1])
      expect(zoneE.perimeter).toBe(8)
      expect(zoneE.sides).toBe(4)
      expect(zoneE.positions.length).toEqual(3)
    })

    it('should build a correct zone - complex grids', () => {
      const zoneA = buildZone(
        [
          ['A', 'A', 'A', 'A', 'A', 'A'],
          ['A', 'A', 'A', 'B', 'B', 'A'],
          ['A', 'A', 'A', 'B', 'B', 'A'],
          ['A', 'B', 'B', 'A', 'A', 'A'],
          ['A', 'B', 'B', 'A', 'A', 'A'],
          ['A', 'A', 'A', 'A', 'A', 'A'],
        ],
        [0, 0],
      )
      expect(zoneA.sides).toBe(12)

      const zoneE = buildZone(
        [
          ['E', 'E', 'E', 'E', 'E'],
          ['E', 'X', 'X', 'X', 'X'],
          ['E', 'E', 'E', 'E', 'E'],
          ['E', 'X', 'X', 'X', 'X'],
          ['E', 'E', 'E', 'E', 'E'],
        ],
        [0, 0],
      )
      expect(zoneE.sides).toBe(12)
      expect(zoneE.positions.length).toBe(17)
    })
  })
})
