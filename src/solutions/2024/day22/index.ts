/**
 * Advent of Code 2024
 * Day 22
 * https://adventofcode.com/2024/day/22
 */
import data from './input'

// const data = `1
// 2
// 3
// 2024`

type SequenceID = string

const SECRETS_COUNT = 2000

const mix = (value: number, secret: number) => value ^ secret
const prune = (secret: number) => secret % 16777216
const calculateNextSecret = (secret: number) => {
  let next = prune(mix(prune(secret * 64), secret))
  next = prune(mix(prune(next) >> 5, next))
  next = prune(mix(prune(next * 2048), next))

  return next
}

const getMostBananas = (sequencesMaps: Map<SequenceID, number>[]) => {
  let mostBananas = 0
  const cache: Set<SequenceID> = new Set()
  for (let i = 0; i < sequencesMaps.length; i++) {
    for (const [sequence] of sequencesMaps[i].entries()) {
      if (cache.has(sequence)) continue

      const bananas = sequencesMaps
        .slice(i)
        .map(sequences => sequences.get(sequence))
        .filter(Boolean)
        .reduce<number>((sum, count) => sum + count!, 0)

      mostBananas = Math.max(bananas, mostBananas)
      cache.add(sequence)
    }
  }

  return mostBananas
}

// Part 1
const initialSecrets = data.split('\n').map(Number)
const secrets = initialSecrets.map(secret => {
  for (let i = 0; i < SECRETS_COUNT; i++) {
    secret = calculateNextSecret(secret)
  }
  return secret
})

let result = secrets.reduce((sum, secret) => sum + secret, 0)
console.log(`Part 1: ${result}`)

// Part 2
const priceChanges = initialSecrets.map(secret => {
  const priceChanges: { price: number; change: number }[] = []
  for (let i = 0; i < SECRETS_COUNT; i++) {
    const next = calculateNextSecret(secret)
    priceChanges.push({
      price: next % 10,
      change: (next % 10) - (secret % 10),
    })
    secret = next
  }
  return priceChanges
})

const sequencesMaps = priceChanges.map(list => {
  const window = list.slice(0, 4).map(({ change }) => change)
  const map: Map<SequenceID, number> = new Map()
  for (let i = 4; i <= list.length; i++) {
    const id = String(window)
    if (!map.has(id)) map.set(id, list[i - 1].price)

    window.shift()
    window.push(list[i]?.change)
  }

  return map
})

result = getMostBananas(sequencesMaps)
console.log(`Part 2: ${result}`)
