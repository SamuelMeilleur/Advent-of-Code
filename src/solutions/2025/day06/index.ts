/**
 * Advent of Code 2025
 * Day 06
 * https://adventofcode.com/2025/day/6
 */
import { zip } from 'lodash-es'
import data from './input'

const identities = {
  '*': 1,
  '+': 0,
}
type Operator = keyof typeof identities

// Part 1
const problems = zip(
  ...data.split('\n').map(line => line.split(/\s+/g).filter(Boolean)),
)
const part1 = problems
  .map(problem => {
    const operation = problem.pop() as Operator
    return problem.reduce((sum, value) => {
      if (operation === '*') return (sum *= Number(value))
      else return (sum += Number(value))
    }, identities[operation])
  })
  .reduce((count, value) => (count += value), 0)
console.log(`Part 1: ${part1}`)

// Part 2
const lines = data.split('\n')
const operators = lines.pop() as string
const problems2: Array<number | null> = []
for (let i = 0; i < operators!.length; i++) {
  let value = ''
  for (let j = 0; j < lines.length; j++) {
    value += lines[j][i] ?? ''
  }
  problems2.push(value.trim() !== '' ? Number(value) : null)
}

let i = 0
const part2 = operators
  .split('')
  .filter(x => x.trim())
  .map(operator => {
    let count = identities[operator as Operator]
    while (problems2[i] != null) {
      const value = problems2[i++] as number
      if (operator === '*') count *= value
      else count += value
    }
    i += 1
    return count
  })
  .reduce((count, value) => (count += value), 0)

console.log(`Part 2: ${part2}`)
