import { describe } from 'node:test'
import {
  copyGrid,
  findPositionsInGrid,
  getValueAtPosition,
  type Grid,
  isInGrid,
  isSamePosition,
  movePosition,
  type Position,
} from '../index'

describe('isInGrid', () => {
  const testGrids = [
    {
      grid: [['']],
    },
    {
      grid: [
        [null, null],
        [null, null],
      ],
    },
    {
      grid: new Array(100).fill([0]),
    },
  ]

  it('should return true if position is greater than 0 but less than grid bounds', () => {
    testGrids.forEach(({ grid }) => {
      expect(isInGrid(grid, [0, 0])).toBe(true)
      expect(isInGrid(grid, [grid.length - 1, grid[0].length - 1])).toBe(true)
    })
  })

  it('should return false if position is less than 0', () => {
    testGrids.forEach(({ grid }) => {
      expect(isInGrid(grid, [-1, 0])).toBe(false)
      expect(isInGrid(grid, [0, -1])).toBe(false)
    })
  })

  it('should return false if position is greater than grid bounds', () => {
    testGrids.forEach(({ grid }) => {
      expect(isInGrid(grid, [grid.length, 0])).toBe(false)
      expect(isInGrid(grid, [0, grid[0].length])).toBe(false)
    })
  })

  it('should return false if grid is empty', () => {
    expect(isInGrid([], [0, 0])).toBe(false)
  })
})

describe('movePosition', () => {
  it('should move position by the given values', () => {
    const position = [23, 55] as Position
    expect(movePosition(position, [0, 0])).toEqual(position)
    expect(movePosition(position, [-23, -55])).toEqual([0, 0])
    expect(movePosition(position, [1, 1])).toEqual([24, 56])
    expect(movePosition(position, [100, 100])).toEqual([123, 155])
  })
})

describe('getValueAtPosition', () => {
  const testGrid = new Array(2)
    .fill(0)
    .map(() => ['', null, 0, [1, 2]])
    .map((x, i) => (i % 2 === 1 ? x.reverse() : x))

  it('should return the value at the given position in the grid if present', () => {
    expect(getValueAtPosition(testGrid, [0, 0])).toBe('')
    expect(getValueAtPosition(testGrid, [0, 1])).toBe(null)
    expect(getValueAtPosition(testGrid, [0, 2])).toBe(0)
    expect(getValueAtPosition(testGrid, [0, 3])).toEqual([1, 2])

    expect(getValueAtPosition(testGrid, [1, 3])).toBe('')
    expect(getValueAtPosition(testGrid, [1, 2])).toBe(null)
    expect(getValueAtPosition(testGrid, [1, 1])).toBe(0)
    expect(getValueAtPosition(testGrid, [1, 0])).toEqual([1, 2])
  })

  it('should return undefined if given position is not in the grid', () => {
    expect(getValueAtPosition(testGrid, [2, 0])).toBeUndefined()
    expect(getValueAtPosition(testGrid, [-1, 0])).toBeUndefined()
  })
})

describe('findPositionsInGrid', () => {
  const testGrid = new Array(3).fill([0, 1, 2]) as Grid<number>

  it('should return all positions in grid where value matches predicate', () => {
    // predicate -> isEven
    expect(findPositionsInGrid(testGrid, x => x % 2 === 0)).toEqual([
      [0, 0],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
    ])

    // predicate -> isOdd
    expect(findPositionsInGrid(testGrid, x => x % 2 === 1)).toEqual([
      [0, 1],
      [1, 1],
      [2, 1],
    ])
  })

  it('should return empty array if no value matches predicate', () => {
    // no matches
    expect(findPositionsInGrid(testGrid, x => x === 3)).toEqual([])

    // empty grid
    expect(findPositionsInGrid([] as Grid<number>, x => x % 2 === 0)).toEqual([])
  })
})

describe('isSamePosition', () => {
  it('return true if both positions are the same', () => {
    expect(isSamePosition([0, 0], [0, 0])).toBe(true)
    expect(isSamePosition([-10, -80], [-10, -80])).toBe(true)
    expect(isSamePosition([100, 90], [100, 90])).toBe(true)
  })

  it('should return false if different', () => {
    expect(isSamePosition([0, 0], [0.0001, 0])).toBe(false)
    expect(isSamePosition([-10, -80], [-10, -81])).toBe(false)
    expect(isSamePosition([100, 90], [0, 0])).toBe(false)
  })
})

describe('copyGrid', () => {
  const testGrid: Grid<number | null> = new Array(3)
    .fill([1, 2, 3])
    .map((row, index) => row.map((x: number) => x * (index + 1)))

  it('should return a new grid with the same rows (deep copy)', () => {
    const copy = copyGrid(testGrid)
    expect(copy).toEqual([
      [1, 2, 3],
      [2, 4, 6],
      [3, 6, 9],
    ])

    testGrid[0][0] = null
    expect(copy[0][0]).not.toBeNull()
    expect(copy[0][0]).toBe(1)
  })
})
