export type Registers = [bigint, bigint, bigint]

export type Pointer = number

export type Program = number[]

export enum Instructions {
  adv,
  bxl,
  bst,
  jnz,
  bxc,
  out,
  bdv,
  cdv,
}
