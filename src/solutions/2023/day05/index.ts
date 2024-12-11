/**
 * Advent of Code 2023
 * Day 05
 * https://adventofcode.com/2023/day/5
 */
import data from './input'

const lines = data
  .replace(/[^\d\n\s]/g, '')
  .split('\n\n')
  .map(line =>
    line
      .trimStart()
      .split('\n')
      .map(entries => entries.split(' ')),
  )
const seeds = lines.shift().at(0)

// Part 1
let smallestLocation = Number.MAX_VALUE
for (const seed of seeds) {
  let current = parseInt(seed)
  lines.forEach(mappings => {
    for (const range of mappings) {
      const [dest, source, length] = range

      if (
        current >= parseInt(source) &&
        current < parseInt(source) + parseInt(length)
      ) {
        current = current + (parseInt(dest) - parseInt(source))
        return
      }
    }
  })
  smallestLocation = Math.min(current, smallestLocation)
}
console.log(`Part 1: ${smallestLocation}`)

// Part 2
const seedsRanges: Array<[number, number]> = []
for (let i = 0; i < seeds.length; i += 2) {
  const start = parseInt(seeds[i])
  const size = parseInt(seeds[i + 1])
  seedsRanges.push([start, start + size])
}

for (const mappings of lines) {
  const mappedRanges: typeof seedsRanges = []

  while (seedsRanges.length > 0) {
    const [start, end] = seedsRanges.pop()

    let isMapped = false
    for (const mapping of mappings) {
      const [dest, source, length] = mapping.map(x => parseInt(x))
      const overlap = {
        left: Math.max(start, source),
        right: Math.min(end, source + length),
      }

      if (start >= overlap.right || end <= overlap.left) continue

      isMapped = true
      mappedRanges.push([
        dest + overlap.left - source,
        dest + overlap.right - source,
      ])
      if (overlap.left > start) {
        seedsRanges.push([start, overlap.left])
      }
      if (overlap.right < end) {
        seedsRanges.push([overlap.right, end])
      }
      break
    }
    if (!isMapped) {
      mappedRanges.push([start, end])
    }
  }
  seedsRanges.push(...mappedRanges)
}

smallestLocation = Number.MAX_VALUE
for (const [location, _] of seedsRanges) {
  smallestLocation = Math.min(location, smallestLocation)
}

console.log(`Part 2: ${smallestLocation}`)
