/**
 * Advent of Code 2024
 * Day 01
 * https://adventofcode.com/2024/day/1
 */
import zip from 'lodash-es/zip'
import data from './input'

const [list1, list2] = data.split(/\s+/).reduce<[number[], number[]]>(
  (lists, value, index) => {
    lists[index % 2].push(parseInt(value))
    return lists
  },
  [[], []],
)

// Part 1
const distance = zip(list1.sort(), list2.sort())
  .map(([value1, value2]) => Math.abs(value1 - value2))
  .reduce((total, distance) => total + distance, 0)

console.log(`Part 1: ${distance}`)

// Part 2
const score = list1
  .map(value => value * list2.filter(value2 => value2 === value).length)
  .reduce((total, score) => total + score, 0)

console.log(`Part 2: ${score}`)
