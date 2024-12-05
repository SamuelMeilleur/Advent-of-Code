/**
 * Advent of Code 2024
 * Day 05
 * https://adventofcode.com/2024/day/5
 */
import data from './input'


const isValidUpdate = (pages: number[], rules: Record<number, number[]>) =>
  pages.every((page, index) =>
    rules[page] == null ||
    pages
      .slice(index + 1)
      .every(nextPage => !rules[page].includes(nextPage))
  )

const [rules, updates] = data
  .split(/\n{2}/).map(input => input
    .split('\n').map(line => line
      .split(/(?:\||,)/).map(Number)))

const priorPagesMapping: Record<number, number[]> = rules
  .reduce((map, [precedingPage, page]) => ({
    ...map,
    [page]: map[page]?.concat(precedingPage) ?? [precedingPage]
  }), {})


// Part 1
let result = updates
  .filter(pages => isValidUpdate(pages, priorPagesMapping))
  .map(pages => pages[Math.floor(pages.length / 2)])
  .reduce((sum, page) => sum + page, 0)

console.log(`Part 1: ${result}`)


// Part 2
result = updates
  .filter(pages => !isValidUpdate(pages, priorPagesMapping))
  .map(pages => pages
    .sort((a, b) => {
      if (priorPagesMapping[a]?.includes(b)) return 1
      if (priorPagesMapping[b]?.includes(a)) return -1
      return 0
    })
  )
  .map(pages => pages[Math.floor(pages.length / 2)])
  .reduce((sum, page) => sum + page, 0)

console.log(`Part 2: ${result}`)
