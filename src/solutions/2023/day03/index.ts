/**
 * Advent of Code 2023
 * Day 03
 * https://adventofcode.com/2023/day/3
 */
import data from './input'

const symbolRegExp = /[^\d\s\.]/g

interface Position {
  row: number
  column: number
}

interface Part extends Position {
  value: string
}

const parseSymbolsPositions = (lines: string[]) => {
  const positions: Part[] = []

  lines.forEach((line, row) => {
    for (const symbol of line.matchAll(symbolRegExp)) {
      positions.push({
        row,
        column: symbol.index,
        value: symbol[0],
      })
    }
  })

  return positions
}

const isValidPart = (part: Part, symbols: Position[]) => {
  const left = part.column
  const right = left + part.value.length - 1

  for (const symbol of symbols) {
    // Symbol must be within 1 row of Part
    if (Math.abs(symbol.row - part.row) > 1) continue

    if (right + 1 >= symbol.column && symbol.column >= left - 1) {
      return true
    }
  }

  return false
}
const lines = data.split('\n')
const symbols = parseSymbolsPositions(lines)

// Part 1
const parts = lines
  .flatMap((line, row) =>
    [...line.matchAll(/(\d+)/g)].map(part => ({
      row,
      column: part.index,
      value: part[0],
    })),
  )
  .filter(part => isValidPart(part, symbols))

const sum = parts.reduce((a, b) => a + parseInt(b.value), 0)
console.log(`Part 1: ${sum}`)

// Part 2
const calculateGearRatio = (symbol: Part, parts: Part[]) => {
  if (symbol.value !== '*') {
    return 0
  }

  const gears = parts.filter(part => isValidPart(part, [symbol]))

  return gears.length === 2
    ? parseInt(gears[0].value) * parseInt(gears[1].value)
    : 0
}

const gearRatios = symbols.reduce(
  (acc, symbol) => acc + calculateGearRatio(symbol, parts),
  0,
)
console.log(`Part 2: ${gearRatios}`)
