/**
 * Advent of Code 2023 
 * Day 01
 * https://adventofcode.com/2023/day/1
 */
import { DIGITS, digitsRegExp } from '../../utils/constants';
import data from './input';

const extractCalibrationValue = (digits: string[]) =>
  parseInt(`${digits.at(0)}${digits.at(-1)}`)


const lines = data.split('\n')

// Part 1
const answer1 = lines
  .map(line =>
    extractCalibrationValue(
      line.replace(/\D/g, '').split('')
    ))
  .reduce((a, b) => a + b, 0)
console.log(`Part 1: ${answer1}`)


// Part 2
const extractDigits = (line: string) =>
  [...line.matchAll(digitsRegExp)].map(([_, value]) => DIGITS[value] ?? value)

const answer2 = lines
  .map(line => extractCalibrationValue(extractDigits(line)))
  .reduce((a, b) => a + b, 0)
console.log(`Part 2: ${answer2}`)
