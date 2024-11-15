/**
 * Advent of Code 2023
 * Day 08
 * https://adventofcode.com/2023/day/8
 */
import data from './input'

const START = 'AAA';
const END = 'ZZZ'
const DIRECTIONS = {
  L: 0,
  R: 1,
}

const lines = data.split(/\n+/)
const instructions = lines.shift().split('') as Array<'L' | 'R'>

const network = new Map<string, [string, string]>()
lines.map(node => {
  const [_, id, left, right] = [...node.match(/(\w{3}) = \((\w{3}), (\w{3})\)/)]
  network.set(id, [left, right])
})

// Part 1
let current = START;
let steps = 0;
while (current !== END) {
  for (const instruction of instructions) {
    current = network.get(current)[DIRECTIONS[instruction]]
    steps += 1
  }
}
console.log(`Part 1: ${steps}`)


// Part 2
const nodes = [...network.keys()]
  .join(' ')
  .match(/\w{2}A /g)
  .map(node => node.trim())

const loopLengths = []
for (let node of nodes) {
  let length = 0;
  while (node.match(/\w{2}Z/) == null) {
    for (const instruction of instructions) {
      node = network.get(node)[DIRECTIONS[instruction]]
      length += 1
    }
  }
  loopLengths.push(length)
}

function gcd(a: number, b: number) {
  // Euclidean algorithm
  while (b != 0) {
    [b, a] = [a % b, b]
  }
  return a;
}

function lcm(a: number, b: number) {
  return (a * b / gcd(a, b));
}

function lcmm(args: number[]) {
  if (args.length == 2) {
    return lcm(args[0], args[1]);
  }

  return lcm(args.shift(), lcmm(args));
}

console.log(`Part 2: ${lcmm(loopLengths)}`)
