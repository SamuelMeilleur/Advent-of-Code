/**
 * Advent of Code 2024
 * Day 17
 * https://adventofcode.com/2024/day/17
 */
import data from './input'
import { executeInstruction, Instructions } from './instructions'

export type Registers = [number, number, number]
export type Pointer = number
type Program = number[]

const executeProgram = (program: Program, registers: Registers): string => {
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

const [registers, program] = data.split('\n\n').map(part =>
  part
    .split('\n')
    .flatMap(line => line.split(': ')[1].split(','))
    .map(Number),
) as [Registers, Program]

// Part 1
const output = executeProgram(program, registers)
console.log(`Part 1: ${output}`)
