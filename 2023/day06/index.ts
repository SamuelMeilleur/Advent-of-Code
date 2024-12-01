/**
 * Advent of Code 2023 
 * Day 06
 * https://adventofcode.com/2023/day/6
 */
import data from './input'

interface Race {
  time: number,
  distance: number
}

const calculateWins = (race: Race) => {
  let wins = 0
  for (var i = 1; i < race.time; i++) {
    if (race.distance < (race.time - i) * i) {
      wins += 1
    }
  }
  return wins
}

const [times, distances] = data
  .split('\n')
  .map(line => line
    .split(':')[1]
    .trimStart()
    .split(/\s+/)
    .map(Number)
  )

// Part 1
const races = times.map((time, i) => ({
  time,
  distance: distances[i]
}))

const product = races
  .map(race => calculateWins(race))
  .reduce((acc, value) => acc * value, 1)

console.log(`Part 1: ${product}`)


// Part 2
const [time, distance] = [times, distances]
  .map(arr => arr.map(String).join(''))
  .map(Number)

const wins = calculateWins({
  time,
  distance
})
console.log(`Part 2: ${wins}`)
