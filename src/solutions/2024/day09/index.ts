/**
 * Advent of Code 2024
 * Day 09
 * https://adventofcode.com/2024/day/9
 */
import data from './input'

type Block = number[]
type Disk = Block[]

type SmartBlock = {
  id: number
  start: number
  length: number
}
type File = SmartBlock
type Blank = SmartBlock

const EMPTY = -1 as const

const fragmentDisk = (disk: Disk) => {
  const flattened = disk.flat()
  const condensed: typeof flattened = []
  let left = 0
  let right = flattened.length - 1
  while (left <= right) {
    if (flattened[right] === EMPTY) {
      right -= 1
      continue
    }
    if (flattened[left] !== EMPTY) {
      condensed.push(flattened[left])
    } else {
      condensed.push(flattened[right])
      right -= 1
    }
    left += 1
  }
  return condensed
}

const splitFilesAndBlanks = (disk: Disk) => {
  let position = 0
  return disk.reduce<[File[], Blank[]]>(
    (acc, block, index) => {
      acc[index % 2].push({
        id: block[0] ?? EMPTY,
        start: position,
        length: block.length,
      })
      position += block.length
      return acc
    },
    [[], []],
  )
}

const compressDisk = (disk: Disk) => {
  const [files, blanks] = splitFilesAndBlanks(disk)
  for (const file of files.reverse()) {
    const blank = blanks.find(
      blank => blank.start < file.start && blank.length >= file.length,
    )
    if (blank == null) continue

    file.start = blank.start
    blank.start = blank.start + file.length
    blank.length -= file.length
  }
  return files
}

const disk = data
  .split('')
  .map(Number)
  .map(
    (value, index) =>
      new Array(value).fill(index % 2 === 0 ? index / 2 : EMPTY) as Block,
  )

// Part 1
let checksum = fragmentDisk(disk).reduce(
  (sum, value, index) => (sum += value * index),
  0,
)
console.log(`Part 1: ${checksum}`)

// Part 2
checksum = compressDisk(disk).reduce(
  (sum, { id, start, length }) =>
    (sum +=
      (id * ((start + length - 1) * (start + length) - (start - 1) * start)) / 2),
  0,
)
console.log(`Part 2: ${checksum}`)
