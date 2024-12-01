/**
 * Advent of Code 2023
 * Day 10
 * https://adventofcode.com/2023/day/10
 */
// import util from 'util'
// import data from './input'

// const data =
//   `.F----7F7F7F7F-7....
// .|F--7||||||||FJ....
// .||.FJ||||||||L7....
// FJL7L7LJLJ||LJ.L-7..
// L--J.L7...LJS7F-7L7.
// ....F-J..F7FJ|L7L7L7
// ....L7.F7||L7|.L7L7|
// .....|FJLJ|FJ|F7|.LJ
// ....FJL-7.||.||||...
// ....L---J.LJ.LJLJ...`

// const data =
//   `..........
// .S------7.
// .|F----7|.
// .||....||.
// .||....||.
// .|L-7F-J|.
// .|..||..|.
// .L--JL--J.
// ..........`

const CELLS = {
  START: 'S',
  GROUND: '.',
  IN_LOOP: 'I'
}

enum Directions {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
}

type Move = [0, -1] | [0, 1] | [1, 0] | [-1, 0]
const MOVES: Record<Directions, Move> = {
  [Directions.NORTH]: [-1, 0],
  [Directions.SOUTH]: [1, 0],
  [Directions.EAST]: [0, 1],
  [Directions.WEST]: [0, -1],
}

const pipes = ['|', '-', 'L', 'J', '7', 'F'] as const
type Pipe = typeof pipes[number]

const PIPES_MOVES: Record<Pipe, Move[]> = {
  '|': [MOVES.NORTH, MOVES.SOUTH],
  '-': [MOVES.WEST, MOVES.EAST],
  'L': [MOVES.NORTH, MOVES.EAST],
  'J': [MOVES.NORTH, MOVES.WEST],
  '7': [MOVES.SOUTH, MOVES.WEST],
  'F': [MOVES.SOUTH, MOVES.EAST],
}

type Position = [number, number]

const makeMove = (position: Position, direction: Move) =>
  position.map((coord, index) => coord + direction[index]) as Position

const getNextPositions = (position: Position, grid: string[][]) => {
  const [x, y] = position
  const [d1, d2] = PIPES_MOVES[grid[x][y]]

  return [makeMove([x, y], d1), makeMove([x, y], d2)]
}

const isValidStartPipe = (pipe: Position, grid: string[][]) =>
  getNextPositions(pipe, grid)
    .some(([x, y]) => grid[x][y] === CELLS.START)

const isOutOfBounds = ([x, y]: Position, grid: string[][]) =>
  (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length)

const grid = data.split('\n').map(line => line.split(''))
const start = grid.map((row, i) => {
  const col = row.findIndex((cell) => cell === CELLS.START)
  return col !== -1 ? [i, col] : null
}).find(Boolean) as Position

// Part 1 
let path: Position[]
const startingPipes = Object.values(MOVES)
  .map(move => makeMove(start, move))
  .filter(([x, y]) => !isOutOfBounds([x, y], grid) && pipes.includes(grid[x][y] as Pipe))

for (const pipe of startingPipes) {
  if (!isValidStartPipe(pipe, grid)) {
    continue
  }

  let [x, y] = pipe
  let prev = start
  path = [pipe]
  while (pipes.includes(grid[x][y] as Pipe)) {
    const [m1, m2] = getNextPositions([x, y], grid)
    const next = prev.toString() !== m1.toString() ? m1 : m2

    prev = [x, y] as Position
    [x, y] = next
    path.push(next)

    if (isOutOfBounds(next, grid)) {
      break
    }
  }

  if (grid[x][y] === CELLS.START) {
    break
  }
}
console.log(`Part 1: ${path.length / 2}`)


// Part 2
const filterPipes = (pipes: Pipe[], direction: Directions) => {
  switch (direction) {
    case Directions.NORTH:
    case Directions.SOUTH:
      return pipes.filter(pipe => pipe !== '|')

    case Directions.EAST:
    case Directions.WEST:
      return pipes.filter(pipe => pipe !== '-')
    default:
      return pipes
  }
}


const isInLoop = (position: Position, grid: string[][]) => {
  let isIn = false
  for (const [direction, move] of Object.entries(MOVES)) {
    let [x, y] = position
    let seenPipes: Pipe[] = []

    if (position[0] === 3 && position[1] === 3) {
      console.log(direction)
    }

    while (!isOutOfBounds([x, y], grid)) {
      if (position[0] === 3 && position[1] === 3) {
        console.log([x, y], seenPipes)
      }

      if (pipes.includes(grid[x][y] as Pipe)) {
        seenPipes.push(grid[x][y] as Pipe)
      }

      [x, y] = makeMove([x, y], move)
    }

    seenPipes = filterPipes(seenPipes, direction as Directions)

    if (seenPipes.length % 2 === 0) {
      return false
    } else {
      isIn = true
    }
  }

  return isIn
}

for (var i = 0; i < grid.length; i++) {
  for (var j = 0; j < grid[0].length; j++) {
    if (path.every(([x, y]) => x !== i || j !== y)) {
      grid[i][j] = CELLS.GROUND
    }
  }
}

for (var i = 0; i < grid.length; i++) {
  for (var j = 0; j < grid[0].length; j++) {
    if (pipes.includes(grid[i][j] as Pipe)) {
      continue
    }
    if (isInLoop([i, j], grid)) {
      grid[i][j] = CELLS.IN_LOOP
    }
  }
}

const output = grid.reduce((acc, line) => acc + line.join(' ') + '\n', '')
console.log(output)
