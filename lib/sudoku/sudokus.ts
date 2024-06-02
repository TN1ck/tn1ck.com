import { sortBy, groupBy, flatten } from "lodash-es"
import { SudokuGrid, isSudokuFilled, isSudokuValid } from "./common"

// Most simple solver. Basically a brute force.
export function bruteForceStrategy(sudoku: SudokuGrid): {
  newSudokus: SudokuGrid[]
  iterations: number
} {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        // We try all numbers from 1 to 9.
        const newSudokus = []
        for (let k = 1; k <= 9; k++) {
          const newSudoku = sudoku.map((row) => row.slice())
          newSudoku[i][j] = k
          newSudokus.push(newSudoku)
        }
        return { newSudokus, iterations: 1 }
      }
    }
  }

  return { newSudokus: [], iterations: 1 }
}

// Slightly better, we skip the invalid sudokus.
export function withValidCheckStrategy(sudoku: SudokuGrid): {
  newSudokus: SudokuGrid[]
  iterations: number
} {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        // We try all numbers from 1 to 9.
        const newSudokus = []
        for (let k = 1; k <= 9; k++) {
          const newSudoku = sudoku.map((row) => row.slice())
          newSudoku[i][j] = k
          if (isSudokuValid(newSudoku)) {
            newSudokus.push(newSudoku)
          }
        }
        return { newSudokus, iterations: 1 }
      }
    }
  }

  return { newSudokus: [], iterations: 1 }
}

export function dfs(
  stack: SudokuGrid[],
  getNeighbours: (sudoku: SudokuGrid) => {
    newSudokus: SudokuGrid[]
    iterations: number
  },
  iterations: number,
): { solvedSudoku: SudokuGrid | null; iterations: number } {
  if (stack.length === 0)
    return {
      solvedSudoku: null,
      iterations,
    }

  const [sudoku, ...rest] = stack

  const isFilled = isSudokuFilled(sudoku)
  const isValid = isSudokuValid(sudoku)

  if (isFilled && isValid)
    return {
      solvedSudoku: sudoku,
      iterations,
    }

  const { newSudokus, iterations: getNeighboursIterations } =
    getNeighbours(sudoku)

  return dfs(
    [...newSudokus, ...rest],
    getNeighbours,
    iterations + getNeighboursIterations,
  )
}

export function dfsLoop(
  stack: SudokuGrid[],
  getNeighbours: (sudoku: SudokuGrid) => {
    newSudokus: SudokuGrid[]
    iterations: number
  },
  iterations: number,
): { solvedSudoku: SudokuGrid | null; iterations: number } {
  while (stack.length > 0) {
    const [sudoku, ...rest] = stack

    const isFilled = isSudokuFilled(sudoku)
    const isValid = isSudokuValid(sudoku)

    if (isFilled && isValid)
      return {
        solvedSudoku: sudoku,
        iterations,
      }

    const { newSudokus, iterations: getNeighboursIterations } =
      getNeighbours(sudoku)

    iterations += getNeighboursIterations
    stack = [...newSudokus, ...rest]
  }

  return {
    solvedSudoku: null,
    iterations,
  }
}

export function minimumRemainingValueStrategy(sudoku: SudokuGrid): {
  newSudokus: SudokuGrid[]
  iterations: number
} {
  // For every empty coordinate, calculate the number of possible values that can be filled.
  const emptyCoordinatesWithPossibleValues: [number, number, number][] = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        const row = sudoku[i]
        const column = sudoku.map((row) => row[j])
        const square = []
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            square.push(sudoku[i - (i % 3) + k][j - (j % 3) + l])
          }
        }
        const set = new Set([...row, ...column, ...square])
        set.delete(0)
        emptyCoordinatesWithPossibleValues.push([i, j, 9 - set.size])
      }
    }
  }

  // Sort by the number of possibilities.
  const sortedPossibilities = emptyCoordinatesWithPossibleValues.sort(
    (a, b) => a[2] - b[2],
  )

  // We take the first coordinate with the least possibilities.
  const [i, j] = sortedPossibilities[0]
  const newSudokus = []
  for (let k = 1; k <= 9; k++) {
    const newSudoku = sudoku.map((row) => row.slice())
    newSudoku[i][j] = k
    if (isSudokuValid(newSudoku)) {
      newSudokus.push(newSudoku)
    }
  }

  return { newSudokus, iterations: 1 }
}
