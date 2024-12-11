/**
 * Advent of Code 2023
 * Day 09
 * https://adventofcode.com/2023/day/9
 */
import data from './input'

// const data =
//   `0 3 6 9 12 15
// 1 3 6 10 15 21
// 10 13 16 21 30 45`

const extrapolate = (history: Array<number[]>, previous = false) =>
  history
    .map(line => line.at(previous ? 0 : -1))
    .reduceRight((sum, value) => (previous ? value - sum : sum + value), 0)

const series = data.split('\n').map(line => line.split(' ').map(Number))

// Part 1
let predictions: number[] = []
for (const serie of series) {
  const history: Array<number[]> = []
  let current = [...serie]
  while (current.some(x => x !== 0)) {
    history.push(current)
    let differences: number[] = []
    for (var i = 0; i < current.length - 1; i++) {
      differences.push(current[i + 1] - current[i])
    }
    current = differences
  }
  history.push(current)
  predictions.push(extrapolate(history))
}

let sum = predictions.reduce((sum, value) => sum + value, 0)
console.log(`Part 1: ${sum}`)

// Part 2
const extrapolatePrevious = (history: Array<number[]>) =>
  history.map(line => line.at(0)).reduceRight((sum, value) => value - sum, 0)

predictions = []
for (const serie of series) {
  const history: Array<number[]> = []
  let current = [...serie]
  while (current.some(x => x !== 0)) {
    history.push(current)
    let differences: number[] = []
    for (var i = 0; i < current.length - 1; i++) {
      differences.push(current[i + 1] - current[i])
    }
    current = differences
  }
  history.push(current)
  predictions.push(extrapolatePrevious(history))
}

sum = predictions.reduce((sum, value) => sum + value, 0)
console.log(`Part 2: ${sum}`)
