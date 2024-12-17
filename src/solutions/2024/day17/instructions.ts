import type { Pointer, Registers } from './index'

type Operand = number

export enum Instructions {
  adv,
  bxl,
  bst,
  jnz,
  bxc,
  out,
  bdv,
  cdv,
}

const getComboOperand = (operand: Operand, registers: Registers) => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand
    case 4:
      return registers[0]
    case 5:
      return registers[1]
    case 6:
      return registers[2]
    case 7:
    default:
      throw Error('invalid operand combo')
  }
}

const division = (operand: Operand, registers: Registers) =>
  Math.floor(registers[0] / 2 ** getComboOperand(operand, registers))

export const executeInstruction = (
  pointer: Pointer,
  instruction: Instructions,
  operand: Operand,
  registers: Registers,
  outputs: number[],
) => {
  switch (instruction) {
    case Instructions.adv:
      registers[0] = division(operand, registers)
      break
    case Instructions.bxl:
      registers[1] ^= operand
      break
    case Instructions.bst:
      registers[1] = getComboOperand(operand, registers) % 8
      break
    case Instructions.jnz:
      if (registers[0] !== 0) return operand
      break
    case Instructions.bxc:
      registers[1] ^= registers[2]
      break
    case Instructions.out:
      outputs.push(getComboOperand(operand, registers) % 8)
      break
    case Instructions.bdv:
      registers[1] = division(operand, registers)
      break
    case Instructions.cdv:
      registers[2] = division(operand, registers)
      break
  }

  return pointer + 2
}
