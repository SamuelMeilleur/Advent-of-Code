/**
 * Advent of Code 2024
 * Day 21
 * https://adventofcode.com/2024/day/21
 */
import memoize from 'lodash-es/memoize'
import { isSamePosition, movePosition, type Position } from '../../../utils/grids'
import data from './input'

type Keypad = Map<string | null, Position>
type Code = string
type Sequence = string[]

const getKeypads = () => {
  const numericRows = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [null, '0', 'A'],
  ]
  const directionRows = [
    [null, '^', 'A'],
    ['<', 'v', '>'],
  ]

  const numericKeypad: Keypad = new Map(
    numericRows.flatMap((row, i) =>
      row.map((num, j) => [num, [i, j]] as [string, Position]),
    ),
  )
  const directionalKeypad: Keypad = new Map(
    directionRows.flatMap((row, i) =>
      row.map((num, j) => [num, [i, j]] as [string, Position]),
    ),
  )

  return {
    numericKeypad,
    directionalKeypad,
  }
}

const getNextSubsequence = (
  current: Position,
  target: Position,
  keypad: Keypad,
) => {
  const empty = keypad.get(null) as Position
  const [i, j] = movePosition(target, current.map(value => -value) as Position)

  const horizontal = j < 0 ? '<'.repeat(-j) : '>'.repeat(j)
  const vertical = i < 0 ? '^'.repeat(-i) : 'v'.repeat(i)

  if (horizontal.length === 0) return vertical
  if (vertical.length === 0) return horizontal

  if (isSamePosition(empty, [current[0], target[1]])) {
    return vertical + horizontal
  }
  if (isSamePosition(empty, [target[0], current[1]])) {
    return horizontal + vertical
  }

  // prioritize left first, right last
  return j < 0 ? horizontal + vertical : vertical + horizontal
}

const getNextRobotSequence = (sequence: Sequence, keypad: Keypad) => {
  let current = keypad.get('A') as Position
  const nextSequence = sequence.map(input => {
    const target = keypad.get(input) as Position
    const subsequence = getNextSubsequence(current, target, keypad)
    current = target

    return subsequence.concat('A')
  })

  return nextSequence
}

const getSequenceLength = memoize(
  (sequence: Sequence, numRobots: number, keypad: Keypad): number => {
    if (numRobots === 0) return sequence.join('').split('').length

    let length = 0
    for (const inputs of sequence) {
      const commands = getNextRobotSequence(inputs.split(''), keypad)
      length += getSequenceLength(commands, numRobots - 1, keypad)
    }
    return length
  },
  (sequence: Sequence, numRobots: number) => `${sequence.join('')}_${numRobots}`,
)

const getCodeComplexity = (numRobots: number) => (code: Code) => {
  const { numericKeypad, directionalKeypad } = getKeypads()
  const sequence = getNextRobotSequence(code.split(''), numericKeypad)
  const length = getSequenceLength(sequence, numRobots, directionalKeypad)

  return Number(code.replace(/\D/, '')) * length
}

// Part 1
const codes: Code[] = data.split('\n')

let score = codes.map(getCodeComplexity(2)).reduce((sum, value) => sum + value, 0)
console.log(`Part 1: ${score}`)

// Part 2
score = codes.map(getCodeComplexity(25)).reduce((sum, value) => sum + value, 0)
console.log(`Part 2: ${score}`)
