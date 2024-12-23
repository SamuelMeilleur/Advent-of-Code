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
const sequencesCount = initialSecrets
  .map(secret => {
    const prices: { price: number; change: number }[] = []
    for (let i = 0; i < SECRETS_COUNT; i++) {
      const next = calculateNextSecret(secret)
      prices.push({
        price: next % 10,
        change: (next % 10) - (secret % 10),
      })
      secret = next
    }
    return prices
  })
  .reduce<Map<SequenceID, number>>((acc, prices) => {
    const seen: Set<SequenceID> = new Set()
    for (let i = 0; i <= prices.length - 4; i++) {
      const window = prices.slice(i, i + 4).map(({ change }) => change)
      const id = String(window)
      if (!seen.has(id)) {
        seen.add(id)
        acc.set(id, prices[i + 3].price + (acc.get(id) ?? 0))
      }
    }
    return acc
  }, new Map())

result = Array.from(sequencesCount.values()).reduce<number>(
  (most, count) => Math.max(most, count),
  0,
)
console.log(`Part 2: ${result}`)
