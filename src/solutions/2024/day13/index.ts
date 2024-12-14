/**
 * Advent of Code 2024
 * Day 13
 * https://adventofcode.com/2024/day/13
 */
import type { Vector, Position } from '../../../utils/grid'
import data from './input'

type Movement = Vector
type Machine = {
  buttonA: Movement
  buttonB: Movement
  target: Position
}

const A_COST = 3
const B_COST = 1

const getMachineCost = (machine: Machine) => {
  const [Ax, Ay] = machine.buttonA
  const [Bx, By] = machine.buttonB
  const [Tx, Ty] = machine.target

  const b = (Ty * Ax - Tx * Ay) / (By * Ax - Bx * Ay)
  const a = (Ty - By * b) / Ay

  if (Number.isInteger(a) && Number.isInteger(b)) {
    return a * A_COST + b * B_COST
  }

  return 0
}

const machines = data
  .split('\n\n')
  .map(machine =>
    machine
      .split('\n')
      .map(line => [...line.matchAll(/\d+/g)].map(Number) as Movement | Position),
  )
  .reduce<Machine[]>((machines, [A, B, prize]) => {
    machines.push({
      buttonA: A,
      buttonB: B,
      target: prize,
    })
    return machines
  }, [])

// Part 1
let cost = machines.map(getMachineCost).reduce((sum, cost) => sum + cost, 0)
console.log(`Part 1: ${cost}`)

// Part 2
const ERROR = 10000000000000
cost = machines
  .map(machine => ({
    ...machine,
    target: machine.target.map(x => x + ERROR),
  }))
  .map(getMachineCost)
  .reduce((sum, cost) => sum + cost, 0)
console.log(`Part 2: ${cost}`)
