/**
 * Advent of Code 2024
 * Day 21
 * https://adventofcode.com/2024/day/21
 */
import { isSamePosition, movePosition, type Position } from '../../../utils/grids'
import data from './input'

type Keypad = Map<string | null, Position>
type Code = string
type Sequence = string[]

// const data = `029A
// 980A
// 179A
// 456A
// 379A`

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

const getNextInputSequence = (
  current: Position,
  target: Position,
  emptySpace?: Position,
) => {
  if (emptySpace == null) return ''

  const [i, j] = movePosition(target, current.map(value => -value) as Position)
  const isLeft = j < 0
  const horizontal = isLeft ? '<'.repeat(-j) : '>'.repeat(j)
  const vertical = i < 0 ? '^'.repeat(-i) : 'v'.repeat(i)

  if (horizontal.length === 0) return vertical
  if (vertical.length === 0) return horizontal

  if (isSamePosition(emptySpace, [current[0], target[1]])) {
    return vertical + horizontal
  }
  if (isSamePosition(emptySpace, [target[0], current[1]])) {
    return horizontal + vertical
  }

  return isLeft ? horizontal + vertical : vertical + horizontal
}

const getRobotSequence = (sequence: Sequence, keypad: Keypad) => {
  let current = keypad.get('A') as Position
  const next: string[] = []

  for (const value of sequence) {
    const target = keypad.get(value) as Position

    next.push(
      ...getNextInputSequence(current, target, keypad.get(null))
        .concat('A')
        .split(''),
    )
    current = target
  }

  return next
}

const getCodeScore = (numRobots: number) => (code: Code) => {
  const { numericKeypad, directionalKeypad } = getKeypads()
  let sequence = getRobotSequence(code.split(''), numericKeypad)
  for (let i = 0; i < numRobots; i++) {
    console.log(i + 1, sequence.length)
    sequence = getRobotSequence(sequence, directionalKeypad)
  }
  const codeNumber = Number(code.match(/\d+/)?.[0] ?? 0)
  return sequence.length * codeNumber
}

const codes: Code[] = data.split('\n')
const score = codes.map(getCodeScore(2)).reduce((sum, value) => sum + value, 0)
console.log(`Part 1: ${score}`)

/* does not work for 25 robots, need to optimize */
// score = codes.map(getCodeScore(25)).reduce((sum, value) => sum + value, 0)
// console.log(`Part 2: ${score}`)
