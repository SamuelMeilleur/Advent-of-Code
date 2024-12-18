import { executeInstruction } from '../instructions'
import { Instructions, type Registers } from '../types'

describe('instructions', () => {
  describe('executeInstruction', () => {
    const REGISTERS = [48n, 1n, 0n] as const

    it('should execute opcode adv', () => {
      let registers = REGISTERS.slice() as Registers
      expect(executeInstruction(0, Instructions.adv, 5, registers, [])).toBe(2)
      expect(registers).toEqual([24n, 1n, 0n])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.adv, 6, registers, [])
      expect(registers).toEqual([48n, 1n, 0n])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.adv, 2, registers, [])
      expect(registers).toEqual([12n, 1n, 0n])
    })

    it('should execute opcode bxl', () => {
      let registers = REGISTERS.slice() as Registers
      expect(executeInstruction(2, Instructions.bxl, 5, registers, [])).toBe(4)
      expect(registers).toEqual([48n, 4n, 0n])

      registers = REGISTERS.slice() as Registers
      executeInstruction(2, Instructions.bxl, 1, registers, [])
      expect(registers).toEqual([48n, 0n, 0n])
    })

    it('should execute opcode bst', () => {
      let registers = REGISTERS.slice() as Registers
      executeInstruction(4, Instructions.bst, 4, registers, [])
      expect(registers).toEqual([48n, 0n, 0n])

      registers = REGISTERS.slice() as Registers
      executeInstruction(2, Instructions.bst, 3, registers, [])
      expect(registers).toEqual([48n, 3n, 0n])

      registers = [24n, 12n, 1n]
      executeInstruction(2, Instructions.bst, 5, registers, [])
      expect(registers).toEqual([24n, 4n, 1n])
    })

    it('should execute opcode jnz', () => {
      let registers = REGISTERS.slice() as Registers
      const pointer = Math.floor(Math.random() * 1000)
      expect(
        executeInstruction(pointer, Instructions.jnz, 4, registers, []),
      ).toBe(4)
      expect(registers).toEqual(registers)

      expect(
        executeInstruction(pointer, Instructions.jnz, 32, registers, []),
      ).toBe(32)

      registers[0] = 0n
      expect(
        executeInstruction(pointer, Instructions.jnz, 4, registers, []),
      ).toBe(pointer + 2)
    })

    it('should execute opcode bxc', () => {
      let registers = [0n, 8n, 3n] as Registers
      executeInstruction(0, Instructions.bxc, Math.random(), registers, [])
      expect(registers).toEqual([0, 11, 3])

      registers = [0n, 8n, 15n] as Registers
      executeInstruction(0, Instructions.bxc, Math.random(), registers, [])
      expect(registers).toEqual([0, 7, 15])
    })

    it('should execute opcode out', () => {
      const outputs: number[] = []
      let registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.out, 2, registers, outputs)
      expect(registers).toEqual([48n, 1n, 0n])
      expect(outputs).toEqual([2])

      executeInstruction(0, Instructions.out, 1, registers, outputs)
      expect(outputs).toEqual([2, 1])

      executeInstruction(0, Instructions.out, 4, registers, outputs)
      expect(outputs).toEqual([2, 1, 0])
    })

    it('should execute opcode bdv', () => {
      let registers = REGISTERS.slice() as Registers
      expect(executeInstruction(0, Instructions.bdv, 5, registers, [])).toBe(2)
      expect(registers).toEqual([48n, 24n, 0n])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.bdv, 6, registers, [])
      expect(registers).toEqual([48n, 48n, 0n])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.bdv, 2, registers, [])
      expect(registers).toEqual([48n, 12n, 0n])
    })

    it('should execute opcode cdv', () => {
      let registers = REGISTERS.slice() as Registers
      expect(executeInstruction(0, Instructions.cdv, 5, registers, [])).toBe(2)
      expect(registers).toEqual([48n, 1n, 24n])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.cdv, 6, registers, [])
      expect(registers).toEqual([48n, 1n, 48n])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.cdv, 2, registers, [])
      expect(registers).toEqual([48n, 1n, 12n])

      registers = [49n, 1n, 0n] as Registers
      executeInstruction(0, Instructions.cdv, 2, registers, [])
      expect(registers).toEqual([49n, 1n, 12n])
    })
  })
})
