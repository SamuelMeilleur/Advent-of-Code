#!/bin/bash

if [[ $# -lt 2 ]] ;
then
  year="$(ls src/solutions/ -1 | sort | tail -n 1)"
  puzzle="$(ls src/solutions/$year -1 | sort | tail -n 1)"
else
  year=$1
  puzzle=day$2
fi

clear
echo $year - $puzzle
yarn tsx src/solutions/$year/$puzzle/index.ts
