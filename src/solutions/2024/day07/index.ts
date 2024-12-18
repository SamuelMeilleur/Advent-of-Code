/**
 * Advent of Code 2024
 * Day 07
 * https://adventofcode.com/2024/day/7
 */
import data from './input'

type Equation = {
  result: number
  operands: number[]
}

enum Operation {
  ADD,
  MULTIPLY,
  CONCATENATION,
}

const reverseOperation = (
  value: number,
  operand: number,
  operation: Operation,
) => {
  switch (operation) {
    case Operation.MULTIPLY:
      return value / operand
    case Operation.ADD:
      return value - operand
    case Operation.CONCATENATION:
      return String(value).endsWith(String(operand))
        ? Number(String(value).slice(0, -String(operand).length))
        : -1
  }
}

const isValidEquation = (operations: Operation[]) => (equation: Equation) => {
  const { result, operands } = equation
  const pairs = operands.length - 1
  const combinations = operations.length ** pairs

  for (let n = 0; n < combinations; n++) {
    let current = result
    for (let i = 0; i < pairs; i++) {
      const operation = Math.floor(n / operations.length ** i) % operations.length
      current = reverseOperation(
        current,
        operands.at(-1 - i) as number,
        operation,
      )
      if (!Number.isInteger(current) || current < 0) break
    }
    if (current === operands[0]) {
      return true
    }
  }

  return false
}

// Part 1
const equations: Equation[] = data
  .split('\n')
  .map(equation => equation.split(/(?::\s|\s)/).map(Number))
  .map(([result, ...operands]) => ({ result, operands }))

let result = equations
  .filter(isValidEquation([Operation.MULTIPLY, Operation.ADD]))
  .reduce((sum, equation) => sum + equation.result, 0)

console.log(`Part 1: ${result}`)

// Part 2
result = equations
  .filter(
    isValidEquation([Operation.MULTIPLY, Operation.ADD, Operation.CONCATENATION]),
  )
  .reduce((sum, equation) => sum + equation.result, 0)

console.log(`Part 2: ${result}`)
