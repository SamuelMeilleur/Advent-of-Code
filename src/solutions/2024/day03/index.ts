/**
 * Advent of Code 2024
 * Day 03
 * https://adventofcode.com/2024/day/3
 */
import data from './input'

const MULTIPLY = 'mul'
const DO = 'do'
const DONT = "don't"

type Program = string
const executeProgram = (program: Program, regExp: RegExp) => {
  let shouldSkip = false
  return [...program.matchAll(regExp)].reduce((sum, [match, ...operands]) => {
    if (match.startsWith(DONT)) {
      shouldSkip = true
      return sum
    }
    if (match.startsWith(DO)) {
      shouldSkip = false
      return sum
    }
    if (shouldSkip) {
      return sum
    }
    return sum + Number(operands[0]) * Number(operands[1])
  }, 0)
}

const OPERANDS = '\\((\\d+),(\\d+)\\)'

// Part 1
let regExp = new RegExp(`${MULTIPLY}${OPERANDS}`, 'g')
let sum = executeProgram(data, regExp)

console.log(`Part 1: ${sum}`)

// Part 2
regExp = new RegExp(`(?:${MULTIPLY}${OPERANDS}|${DONT}\\(\\)|${DO}\\(\\))`, 'g')
sum = executeProgram(data, regExp)

console.log(`Part 2: ${sum}`)
