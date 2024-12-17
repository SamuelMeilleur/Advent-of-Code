import { executeInstruction, Instructions } from '../instructions'
import { type Registers } from '../index'

describe('instructions', () => {
  describe('executeInstruction', () => {
    const REGISTERS = [48, 1, 0] as const

    it('should execute opcode adv', () => {
      let registers = REGISTERS.slice() as Registers
      expect(executeInstruction(0, Instructions.adv, 5, registers, [])).toBe(2)
      expect(registers).toEqual([24, 1, 0])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.adv, 6, registers, [])
      expect(registers).toEqual([48, 1, 0])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.adv, 2, registers, [])
      expect(registers).toEqual([12, 1, 0])
    })

    it('should execute opcode bxl', () => {
      let registers = REGISTERS.slice() as Registers
      expect(executeInstruction(2, Instructions.bxl, 5, registers, [])).toBe(4)
      expect(registers).toEqual([48, 4, 0])

      registers = REGISTERS.slice() as Registers
      executeInstruction(2, Instructions.bxl, 1, registers, [])
      expect(registers).toEqual([48, 0, 0])
    })

    it('should execute opcode bst', () => {
      let registers = REGISTERS.slice() as Registers
      executeInstruction(4, Instructions.bst, 4, registers, [])
      expect(registers).toEqual([48, 0, 0])

      registers = REGISTERS.slice() as Registers
      executeInstruction(2, Instructions.bst, 3, registers, [])
      expect(registers).toEqual([48, 3, 0])

      registers = [24, 12, 1]
      executeInstruction(2, Instructions.bst, 5, registers, [])
      expect(registers).toEqual([24, 4, 1])
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

      registers[0] = 0
      expect(
        executeInstruction(pointer, Instructions.jnz, 4, registers, []),
      ).toBe(pointer + 2)
    })

    it('should execute opcode bxc', () => {
      let registers = [0, 8, 3] as Registers
      executeInstruction(0, Instructions.bxc, Math.random(), registers, [])
      expect(registers).toEqual([0, 11, 3])

      registers = [0, 8, 15] as Registers
      executeInstruction(0, Instructions.bxc, Math.random(), registers, [])
      expect(registers).toEqual([0, 7, 15])
    })

    it('should execute opcode out', () => {
      const outputs: number[] = []
      let registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.out, 2, registers, outputs)
      expect(registers).toEqual([48, 1, 0])
      expect(outputs).toEqual([2])

      executeInstruction(0, Instructions.out, 1, registers, outputs)
      expect(outputs).toEqual([2, 1])

      executeInstruction(0, Instructions.out, 4, registers, outputs)
      expect(outputs).toEqual([2, 1, 0])
    })

    it('should execute opcode bdv', () => {
      let registers = REGISTERS.slice() as Registers
      expect(executeInstruction(0, Instructions.bdv, 5, registers, [])).toBe(2)
      expect(registers).toEqual([48, 24, 0])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.bdv, 6, registers, [])
      expect(registers).toEqual([48, 48, 0])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.bdv, 2, registers, [])
      expect(registers).toEqual([48, 12, 0])
    })

    it('should execute opcode cdv', () => {
      let registers = REGISTERS.slice() as Registers
      expect(executeInstruction(0, Instructions.cdv, 5, registers, [])).toBe(2)
      expect(registers).toEqual([48, 1, 24])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.cdv, 6, registers, [])
      expect(registers).toEqual([48, 1, 48])

      registers = REGISTERS.slice() as Registers
      executeInstruction(0, Instructions.cdv, 2, registers, [])
      expect(registers).toEqual([48, 1, 12])

      registers = [49, 1, 0] as Registers
      executeInstruction(0, Instructions.cdv, 2, registers, [])
      expect(registers).toEqual([49, 1, 12])
    })
  })
})
