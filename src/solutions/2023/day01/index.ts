/**
 * Advent of Code 2023
 * Day 01
 * https://adventofcode.com/2023/day/1
 */
import { DIGITS, digitsRegExp } from './constants'
import data from './input'

const extractCalibrationValue = (digits: string[]) =>
  parseInt(`${digits.at(0)}${digits.at(-1)}`)

const lines = data.split('\n')

// Part 1
const answer1 = lines
  .map(line => extractCalibrationValue(line.replace(/\D/g, '').split('')))
  .reduce((acc, value) => acc + value, 0)
console.log(`Part 1: ${answer1}`)

// Part 2
const extractDigits = (line: string) =>
  [...line.matchAll(digitsRegExp)].map(
    ([_, value]) => DIGITS[value as keyof typeof DIGITS] ?? value,
  )

const answer2 = lines
  .map(line => extractCalibrationValue(extractDigits(line)))
  .reduce((acc, value) => acc + value, 0)
console.log(`Part 2: ${answer2}`)
