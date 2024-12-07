/**
 * Advent of Code 2024
 * Day 07
 * https://adventofcode.com/2024/day/7
 */
import data from './input'

interface Equation {
  result: number,
  operands: number[]
}

enum Operation {
  ADD,
  MULTIPLY,
  CONCATENATION,
}

const computeOperation = (operand1: number, operand2: number, operation: Operation) => {
  switch (operation) {
    case Operation.ADD:
      return operand1 + operand2
    case Operation.MULTIPLY:
      return operand1 * operand2
    case Operation.CONCATENATION:
      return Number(String(operand1) + operand2)
    default:
      return operand1
  }
}

const isValidEquation = (operationsNumber: number) => (equation: Equation) => {
  const { operands } = equation
  const pairs = operands.length - 1
  const combinations = operationsNumber ** pairs

  for (let n = 0; n < combinations; n++) {
    let result = operands[0]
    for (let i = 0; i < pairs; i++) {
      const operation = Math.floor(n / operationsNumber ** i) % operationsNumber
      result = computeOperation(result, operands[i + 1], operation)
    }
    if (result === equation.result) {
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
  .filter(isValidEquation(2))
  .reduce((sum, equation) => sum + equation.result, 0)

console.log(`Part 1: ${result}`)


// Part 2
result = equations
  .filter(isValidEquation(3))
  .reduce((sum, equation) => sum + equation.result, 0)

console.log(`Part 2: ${result}`)
