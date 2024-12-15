/**
 * Advent of Code 2024
 * Day 11
 * https://adventofcode.com/2024/day/11
 */
import data from './input'

type Stone = number
type Count = number

// const updateStone = (stone: Stone, count: Count) => {
//   if (stone === 0) return [[1, count]]
//   const stoneStr = String(stone)
//   if (stoneStr.length % 2 === 0)
//     return [
//       [Number(stoneStr.slice(0, stoneStr.length / 2)), count],
//       [Number(stoneStr.slice(stoneStr.length / 2)), count],
//     ]

//   return [[stone * 2024, count]]
// }

// const createStonesCountMap = (stones: [Stone, Count][]) =>
//   stones.reduce(
//     (map, [stone, count]) => map.set(stone, (map.get(stone) ?? 0) + count),
//     new Map<Stone, Count>(),
//   )

// const computeStonesCount = (stones: Stone[], steps: number) => {
//   let stonesCounts = createStonesCountMap(stones.map(stone => [stone, 1]))

//   for (let n = 0; n < steps; n++) {
//     const newStones = Array.from(
//       stonesCounts.entries(),
//       ([stone, count]) => updateStone(stone, count) as [Stone, Count][],
//     ).flat()
//     stonesCounts = createStonesCountMap(newStones)
//   }

//   return [...stonesCounts.values()].reduce((sum, count) => sum + count, 0)
// }
const cache = new Map<string, Count>()

const countStone = (stone: Stone, steps: number) => {
  const key = String([stone, steps])
  let result = cache.get(key)
  if (result != null) return result

  if (steps === 0) {
    result = 1
    cache.set(key, result)
    return result
  }
  if (stone === 0) {
    result = countStone(1, steps - 1)
    cache.set(key, result)
    return result
  }
  const stoneStr = String(stone)
  if (stoneStr.length % 2 === 0) {
    result =
      countStone(Number(stoneStr.slice(0, stoneStr.length / 2)), steps - 1) +
      countStone(Number(stoneStr.slice(stoneStr.length / 2)), steps - 1)
    cache.set(key, result)
    return result
  }

  result = countStone(stone * 2024, steps - 1)
  cache.set(key, result)
  return result
}

const computeStonesCount = (stones: Stone[], steps: number) => {
  return stones
    .map(stone => countStone(stone, steps))
    .reduce((sum, count) => sum + count, 0)
}

const stones = data.split(/\s+/).map(Number)

console.log(`Part 1: ${computeStonesCount(stones, 25)}`)
console.log(`Part 2: ${computeStonesCount(stones, 1000)}`)
