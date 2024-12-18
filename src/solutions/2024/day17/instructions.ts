import { Instructions, type Pointer, type Registers } from './types'

enum Registry {
  A = 0,
  B = 1,
  C = 2,
}

const getComboOperand = (operand: number, registers: Registers) => {
  if (operand < 4) return operand
  switch (operand) {
    case 4:
      return registers[Registry.A]
    case 5:
      return registers[Registry.B]
    case 6:
      return registers[Registry.C]
    case 7:
    default:
      throw Error('invalid operand combo')
  }
}

const division = (operand: number, registers: Registers) =>
  registers[Registry.A] >> BigInt(getComboOperand(operand, registers))

export const executeInstruction = (
  pointer: Pointer,
  instruction: Instructions,
  operand: number,
  registers: Registers,
  outputs: number[],
) => {
  switch (instruction) {
    case Instructions.adv:
      registers[Registry.A] = division(operand, registers)
      break
    case Instructions.bxl:
      registers[Registry.B] ^= BigInt(operand)
      break
    case Instructions.bst:
      registers[Registry.B] = BigInt(getComboOperand(operand, registers)) % 8n
      break
    case Instructions.jnz:
      if (registers[Registry.A] !== 0n) return operand
      break
    case Instructions.bxc:
      registers[Registry.B] ^= registers[Registry.C]
      break
    case Instructions.out:
      outputs.push(Number(BigInt(getComboOperand(operand, registers)) % 8n))
      break
    case Instructions.bdv:
      registers[Registry.B] = division(operand, registers)
      break
    case Instructions.cdv:
      registers[Registry.C] = division(operand, registers)
      break
  }
  return pointer + 2
}
