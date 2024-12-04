/**
 * Advent of Code 2024
 * Day 03
 * https://adventofcode.com/2024/day/3
 */
import data from './input'

// Part 1
let sum = [...data.matchAll(/mul\((\d+),(\d+)\)/g)]
  .map(match => parseInt(match[1]) * parseInt(match[2]))
  .reduce((total, mul) => total + mul, 0)

console.log(sum)


// Part 2
const matches = [...data.matchAll(/(?:mul\((\d+),(\d+)\)|don\'t\(\)|do\(\))/g)]

let skipNext = false
sum = 0
for (const match of matches) {
  if (match[0] === 'do()') {
    skipNext = false
    continue
  } else if (match[0] === 'don\'t()') {
    skipNext = true
    continue
  }

  if (!skipNext) {
    sum += parseInt(match[1]) * parseInt(match[2])
  }
}

console.log(sum)
