/**
 * Advent of Code 2024
 * Day 17
 * https://adventofcode.com/2024/day/17
 */
import data from './input'
import { executeInstruction } from './instructions'
import type { Instructions, Program, Registers } from './types'

const executeProgram = (program: Program, registers: Registers) => {
  const outputs: number[] = []
  let pointer = 0

  while (pointer < program.length) {
    pointer = executeInstruction(
      pointer,
      program[pointer] as Instructions,
      program[pointer + 1],
      registers,
      outputs,
    )
  }

  return outputs.join(',')
}

const inputs = data
  .split('\n\n')
  .map(part => part.split('\n').flatMap(line => line.split(': ')[1].split(',')))

const registers = inputs[0].map(BigInt) as Registers
const program = inputs[1].map(Number) as Program

// Part 1
const output = executeProgram(program, registers)
console.log(`Part 1: ${output}`)

// Part 2
const reverseProgram = (program: Program, previousA = 0n): bigint => {
  for (let n = 0n; n < 8n; n++) {
    const guessRegisterA = (previousA << 3n) + n
    const output = executeProgram(program, [guessRegisterA, 0n, 0n])

    if (!program.join(',').endsWith(output)) continue
    if (output === program.join(',')) return guessRegisterA

    try {
      const validRegisterA = reverseProgram(program, guessRegisterA)
      if (validRegisterA != null) {
        return validRegisterA
      }
    } catch {
      continue
    }
  }

  return null
}

const initialRegistry = reverseProgram(program)
console.log(`Part 2: ${initialRegistry}`)
