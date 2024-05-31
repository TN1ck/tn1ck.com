import { sortBy, groupBy, flatten } from "lodash-es"
import { SudokuGrid } from "./common"

export const isSudokuFilled = (sudoku: SudokuGrid): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) return false
    }
  }
  return true
}

export const isSudokuValid = (sudoku: SudokuGrid): boolean => {
  // Check rows.
  for (let i = 0; i < 9; i++) {
    const row = sudoku[i]
    const set = new Set(row)
    set.delete(0)
    if (set.size !== row.filter((n) => n !== 0).length) return false
  }

  // Check columns.
  for (let i = 0; i < 9; i++) {
    const column = sudoku.map((row) => row[i])
    const set = new Set(column)
    set.delete(0)
    if (set.size !== column.filter((n) => n !== 0).length) return false
  }

  // Check squares.
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const square = []
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          square.push(sudoku[i * 3 + k][j * 3 + l])
        }
      }
      const set = new Set(square)
      set.delete(0)
      if (set.size !== square.filter((n) => n !== 0).length) return false
    }
  }

  return true
}

// Most simple solver. Basically a brute force.
export function bruteForceStrategy(sudoku: SudokuGrid): SudokuGrid[] {
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
        return newSudokus
      }
    }
  }

  return []
}

// Slightly better, we skip the invalid sudokus.
export function withValidCheckStrategy(sudoku: SudokuGrid): SudokuGrid[] {
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
        return newSudokus
      }
    }
  }

  return []
}

function dfs(
  stack: SudokuGrid[],
  getNeighbours: (sudoku: SudokuGrid) => SudokuGrid[],
): [SudokuGrid | null, SudokuGrid[]] {
  if (stack.length === 0) return [null, []]

  const [sudoku, ...rest] = stack

  const isFilled = isSudokuFilled(sudoku)
  const isValid = isSudokuValid(sudoku)

  if (isFilled && isValid) return [sudoku, []]

  const newSudokus = getNeighbours(sudoku)

  return dfs([...newSudokus, ...rest], getNeighbours)
}

export function minimumRemainingValueStrategy(
  sudoku: SudokuGrid,
): SudokuGrid[] {
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

  return newSudokus
}
