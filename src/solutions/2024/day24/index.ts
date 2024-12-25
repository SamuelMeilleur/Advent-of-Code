/**
 * Advent of Code 2024
 * Day 24
 * https://adventofcode.com/2024/day/24
 */
import data from './input'

type Wire = string
enum Gates {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
}

type Connection = {
  wire1: Wire
  wire2: Wire
  gate: Gates
  output: Wire
}

const splitWiresAndConnections = (data: string) => {
  const splitData = data.split('\n\n').map(part => part.split('\n'))
  const wires = splitData[0].reduce<Map<Wire, number>>((wires, line) => {
    const [name, value] = line.split(': ')
    return wires.set(name, Number(value))
  }, new Map())

  const connections = splitData[1].reduce<Connection[]>((acc, line) => {
    const [wire1, gate, wire2, output] = line.replace('->', '').split(/\s+/)

    return acc.concat({
      wire1,
      gate: Gates[gate as keyof typeof Gates],
      wire2,
      output,
    })
  }, [])

  return {
    wires,
    connections,
  }
}

const computeGateOutput = (value1: number, value2: number, gate: Gates) => {
  switch (gate) {
    case Gates.AND:
      return value1 & value2
    case Gates.OR:
      return value1 | value2
    case Gates.XOR:
      return value1 ^ value2
  }
}

const calculateWire = (
  wire: Wire,
  connections: Connection[],
  wires: Map<Wire, number>,
) => {
  if (wires.has(wire)) return wires.get(wire) as number

  const { wire1, wire2, gate } = connections.find(
    x => x.output === wire,
  ) as Connection

  const [value1, value2] = [wire1, wire2].map(wire =>
    calculateWire(wire, connections, wires),
  )

  const output = computeGateOutput(value1, value2, gate)
  wires.set(wire, output)
  return output
}

const computeFullOutput = (
  initialWires: Map<Wire, number>,
  connections: Connection[],
) => {
  const wires = new Map<Wire, number>(initialWires)
  connections.forEach(({ output }) => calculateWire(output, connections, wires))

  return Array.from(wires.entries())
    .filter(([id]) => id.startsWith('z'))
    .sort(([id1], [id2]) => (id1 < id2 ? 1 : -1))
    .map(([_, value]) => value)
    .join('')
}

const getInputValue = (input: 'x' | 'y', wires: Map<Wire, number>) =>
  parseInt(
    Array.from(wires.entries())
      .filter(([id]) => id.startsWith(input))
      .sort(([id1], [id2]) => (id1 < id2 ? 1 : -1))
      .map(([_, value]) => value)
      .join(''),
    2,
  )

// Part 1
const { wires, connections } = splitWiresAndConnections(data)
const output = computeFullOutput(wires, connections)
console.log(`Part 1: ${parseInt(output, 2)}`)

// Part 2
const swapBadConnections = (
  badConnections: Connection[],
  connections: Connection[],
) => {
  for (const connection of badConnections) {
    const { wire1, wire2, gate, output } = connection
    if (gate !== Gates.XOR) continue

    const queue = [wire1, wire2]
    while (queue.length > 0) {
      const wire = queue.pop() as Wire

      const { wire1, wire2 } = connections.find(x => x.output === wire) ?? {}
      if (wire1 != null && wire2 != null) {
        queue.unshift(wire1, wire2)
        continue
      }

      const outputBit = wire.replace(/(x|y)/, 'z')
      const other = badConnections.find(x => x.output === outputBit) as Connection
      ;[other.output, connection.output] = [output, other.output]
      break
    }
  }
}

const badConnections = connections.filter(({ wire1, gate, output }) => {
  if (output.startsWith('z')) {
    return gate !== Gates.XOR && output !== 'z45'
  }
  return gate === Gates.XOR && !wire1.startsWith('x') && !wire1.startsWith('y')
})

swapBadConnections(badConnections, connections)

const newOutput = computeFullOutput(wires, connections)
const target = getInputValue('x', wires) + getInputValue('y', wires)
const [badBit] = (BigInt(target) ^ BigInt(parseInt(newOutput, 2)))
  .toString(2)
  .split('')
  .reverse()
  .map((bit, index) => (bit === '1' ? index.toString() : ''))
  .filter(Boolean)

const swaps = badConnections
  .concat(connections.filter(({ wire1 }) => wire1.endsWith(badBit)))
  .map(({ output }) => output)
  .sort()
  .join(',')

console.log(`Part 2: ${swaps}`)
