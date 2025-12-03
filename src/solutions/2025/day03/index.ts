/**
 * Advent of Code 2025
 * Day 03
 * https://adventofcode.com/2025/day/3
 */
import data from './input'

type Battery = number
type Bank = Battery[]

const maxJoltage = (bank: Bank, num = 2) => {
  const indices = new Array<number>(num)

  for (let n = 0; n < num; n++) {
    let index = n === 0 ? 0 : indices[n - 1] + 1

    for (let i = index; i <= bank.length - num + n; i++) {
      if (bank[i] > bank[index]) {
        index = i
      }
    }

    indices[n] = index
  }

  return indices
    .map((index, pos) => bank[index] * 10 ** (num - pos - 1))
    .reduce((sum, value) => sum + value, 0)
}

// Part 1
const banks = data
  .split('\n')
  .map(line => line.split('').map(Number)) satisfies Bank[]

const part1 = banks.reduce((joltage, bank) => joltage + maxJoltage(bank), 0)
console.log(`Part 1: ${part1}`)

// Part 2
const part2 = banks.reduce((joltage, bank) => joltage + maxJoltage(bank, 12), 0)
console.log(`Part 2: ${part2}`)
