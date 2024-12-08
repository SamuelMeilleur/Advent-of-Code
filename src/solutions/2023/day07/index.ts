/**
 * Advent of Code 2023 
 * Day 07
 * https://adventofcode.com/2023/day/7
 */
import data from './input'

enum HAND_TYPES {
  HIGH_CARD,
  PAIR,
  TWO_PAIRS,
  THREE_KIND,
  FULL_HOUSE,
  FOUR_KIND,
  FIVE_KIND,
}

interface Hand {
  hand: string,
  type: HAND_TYPES,
  bid: number,
}

const JOKER = 'J'
const CARD_VALUES = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14,
}

const findHandType = (hand: string, jokerRule = false) => {
  const cards = new Map<string, number>()
  Object.values(hand).forEach(char => {
    cards.set(char, (cards.get(char) ?? 0) + 1)
  })

  if (jokerRule) {
    const jokers = cards.get(JOKER) ?? 0
    cards.delete(JOKER)

    const [bestCard, n] = [...cards.entries()]
      .reduce((acc, [card, n]) => n > acc[1] ? [card, n] : acc, ['', 0])

    cards.set(bestCard, n + jokers)
  }

  const maxSameCard = Math.max(...cards.values())
  switch (cards.size) {
    case 1:
      return HAND_TYPES.FIVE_KIND
    case 2:
      return maxSameCard === 4 ? HAND_TYPES.FOUR_KIND : HAND_TYPES.FULL_HOUSE
    case 3:
      return maxSameCard === 3 ? HAND_TYPES.THREE_KIND : HAND_TYPES.TWO_PAIRS
    case 4:
      return HAND_TYPES.PAIR
    case 5:
    default:
      return HAND_TYPES.HIGH_CARD
  }
}

const sortHands = (hand1: Hand, hand2: Hand) => {
  const diff = hand2.type - hand1.type
  if (diff !== 0) {
    return diff
  }

  for (var i = 0; i < 5; i++) {
    const card1 = CARD_VALUES[hand1.hand[i]]
    const card2 = CARD_VALUES[hand2.hand[i]]
    if (card1 === card2) {
      continue
    }
    return card2 - card1
  }
  return 0
}

const calculateWinnings = (hands: Hand[]) =>
  hands
    .sort((a, b) => sortHands(b, a)) // descending order
    .map(({ bid }, rank) => (rank + 1) * bid)
    .reduce((sum, winning) => sum + winning, 0)


const hands = data
  .split('\n')
  .flatMap(line => line.split(/\s+/))
  .reduce((acc, value, index) => {
    if (index % 2 === 0) {
      acc.push({
        hand: value,
        type: findHandType(value),
        bid: 0
      })
    } else {
      acc[acc.length - 1].bid = parseInt(value)
    }
    return acc;
  }, [] as Hand[])

// Part 1
const winnings = calculateWinnings(hands)
console.log(`Part 1: ${winnings}`)


// Part 2
CARD_VALUES[JOKER] = 1
const jokerHands = hands
  .map(hand => ({
    ...hand,
    type: findHandType(hand.hand, true)
  }))
  .sort((a, b) => sortHands(b, a)) // descending order

const winnings2 = calculateWinnings(jokerHands)
console.log(`Part 2: ${winnings2}`)
