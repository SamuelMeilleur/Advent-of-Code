/**
 * Advent of Code 2024
 * Day 02
 * https://adventofcode.com/2024/day/2
 */
import zip from 'lodash-es/zip'
import data from './input'

type Report = number[]

const MAX_DIFFERENCE = 3
const MIN_DIFFERENCE = 1

const reports = data
  .split('\n')
  .map(line => line.split(/\s+/).map(Number)) as Report[]

const isReportSafe = (report: Report) => {
  const diffs = zip(report, report.slice(1))
    .slice(0, -1)
    .map(([level1, level2]) => level2 - level1)

  return (
    diffs.every(diff => diff >= MIN_DIFFERENCE && diff <= MAX_DIFFERENCE) ||
    diffs.every(diff => diff >= -MAX_DIFFERENCE && diff <= -MIN_DIFFERENCE)
  )
}

// Part 1
let count = reports.filter(isReportSafe).length

console.log(`Part 1: ${count}`)

// Part 2
count = reports
  .map(report =>
    report.map((_, i, array) => [...array.slice(0, i), ...array.slice(i + 1)]),
  )
  .filter(reportList => reportList.some(isReportSafe)).length

console.log(`Part 2: ${count}`)
