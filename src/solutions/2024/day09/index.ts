/**
 * Advent of Code 2024
 * Day 09
 * https://adventofcode.com/2024/day/9
 */
import data from './input'

const EMPTY = -1

const diskBlocks = data
  .split('')
  .map(Number)
  .map((value, index) => new Array<number>(value)
    .fill(index % 2 === 0 ? index / 2 : EMPTY)
  )

// Part 1
const fragmentDisk = (disk: number[]) => {
  const condensed: typeof disk = []
  let left = 0, right = disk.length - 1
  while (left <= right) {
    if (disk[right] === EMPTY) {
      right -= 1
      continue
    }
    if (disk[left] !== EMPTY) {
      condensed.push(disk[left])
    } else {
      condensed.push(disk[right])
      right -= 1
    }
    left += 1
  }
  return condensed
}

let checksum = fragmentDisk(diskBlocks.flat())
  .reduce((sum, value, index) =>
    sum += (value * index), 0)

console.log(`Part 1: ${checksum}`)


// Part 2
interface Block {
  id: number
  start: number,
  length: number
}

const splitFilesAndBlanks = (blocks: Array<number[]>) => {
  let position = 0
  return blocks
    .reduce((acc, block, index) => {
      acc[index % 2].push({
        id: block[0] ?? EMPTY,
        start: position,
        length: block.length
      })
      position += block.length
      return acc
    }, [[], []] as [Block[], Block[]])
}

const condenseFiles = (blocks: Array<number[]>) => {
  const [files, blanks] = splitFilesAndBlanks(blocks)
  for (const file of files.reverse()) {
    const blank = blanks.find(blank => blank.start < file.start && blank.length >= file.length)
    if (blank == null) {
      continue
    }
    file.start = blank.start
    blank.start = blank.start + file.length
    blank.length -= file.length
  }
  return files
}

checksum = condenseFiles(diskBlocks)
  .reduce((sum, { id, start, length }) =>
    sum += id * ((start + length - 1) * (start + length)
      - (start - 1) * start) / 2, 0)

console.log(`Part 2: ${checksum}`)
