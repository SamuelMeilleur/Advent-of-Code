#!/bin/bash


if [[ $# -lt 2 ]] ;
then
  echo $'\n'"Enter selected year: "
  read year
  echo "Puzzle day #: "
  read puzzle_n
else
  year=$1
  puzzle_n=$2
fi

clear
yarn npx tsx src/$year/day$puzzle_n/index.ts

read -e -p $'\n'"Press any key to end"
