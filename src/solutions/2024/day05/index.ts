/**
 * Advent of Code 2024
 * Day 05
 * https://adventofcode.com/2024/day/5
 */
import data from './input'

type Page = number
type Update = Page[]
type Rule = [Page, Page]

const isValidUpdate = (update: Update, rules: Record<Page, Page[]>) =>
  update.every((page, index) =>
    update.slice(index + 1).every(nextPage => !rules[page]?.includes(nextPage)),
  )

const [rules, updates] = data
  .split(/\n{2}/)
  .map(input =>
    input.split('\n').map(line => line.split(/(?:\||,)/).map(Number)),
  ) as [Rule[], Update[]]

// for a given page, a list of pages that must come before it
const priorPagesMapping = rules.reduce<Record<Page, Page[]>>(
  (mapping, [precedingPage, page]) => ({
    ...mapping,
    [page]: (mapping[page] ?? []).concat(precedingPage),
  }),
  {},
)

// Part 1
let result = updates
  .filter(pages => isValidUpdate(pages, priorPagesMapping))
  .map(pages => pages[Math.floor(pages.length / 2)])
  .reduce((sum, page) => sum + page, 0)

console.log(`Part 1: ${result}`)

// Part 2
result = updates
  .filter(pages => !isValidUpdate(pages, priorPagesMapping))
  .map(pages =>
    pages.sort((a, b) => {
      if (priorPagesMapping[a]?.includes(b)) return 1
      if (priorPagesMapping[b]?.includes(a)) return -1
      return 0
    }),
  )
  .map(pages => pages[Math.floor(pages.length / 2)])
  .reduce((sum, page) => sum + page, 0)

console.log(`Part 2: ${result}`)
