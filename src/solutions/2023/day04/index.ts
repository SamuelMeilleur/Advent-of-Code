/**
 * Advent of Code 2023
 * Day 04
 * https://adventofcode.com/2023/day/4
 */
import data from './input'

const calculateWinningCount = (line: string) => {
  const [winningNumbers, myNumbers] = line
    .split(/:\s+/)[1]
    .split(/\s+\|\s+/)
    .map(side => new Set(side.split(/\s+/)))

  return [...myNumbers.keys()].reduce(
    (count, number) => (winningNumbers.has(number) ? count + 1 : count),
    0,
  )
}

const lines = data.split('\n')

// Part 1
let sum = 0
lines.forEach(line => {
  const winningNumbersCount = calculateWinningCount(line)
  if (winningNumbersCount > 0) {
    sum += 2 ** (winningNumbersCount - 1)
  }
})
console.log(`Part 1: ${sum}`)

// Part 2
const scratchcards = new Map<string, number>(
  Object.entries(Array(lines.length).fill(1)),
)
lines.forEach((line, index) => {
  const winningNumbersCount = calculateWinningCount(line)
  for (let i = index + 1; i <= index + winningNumbersCount; i++) {
    scratchcards.set(
      String(i),
      scratchcards.get(String(i))! + scratchcards.get(String(index))!,
    )
  }
})

const answer = [...scratchcards.values()].reduce((acc, value) => acc + value, 0)
console.log(`Part 2: ${answer}`)
