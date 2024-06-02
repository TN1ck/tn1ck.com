import { flatten, groupBy, sortBy } from "lodash-es"
import { DomainSudoku } from "./ac3"

export type SudokuGrid = number[][]

export function toSimpleSudoku(grid: DomainSudoku): SudokuGrid {
  return grid.map((row) => {
    return row.map((cells) => {
      return cells.length === 1 ? cells[0] : 0
    })
  })
}

export function toDomainSudoku(grid: SudokuGrid): DomainSudoku {
  return grid.map((row) => {
    return row.map((c) => {
      return c === 0 ? SUDOKU_NUMBERS : [c]
    })
  })
}
// Easy sudoku
export const SUDOKU_EASY: SudokuGrid = [
  [0, 1, 0, 0, 0, 0, 6, 7, 4],
  [0, 8, 9, 7, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 6, 3, 8, 0, 0],
  [0, 2, 8, 0, 0, 0, 7, 6, 0],
  [0, 0, 0, 1, 0, 0, 4, 3, 0],
  [0, 0, 6, 9, 2, 0, 0, 1, 8],
  [0, 6, 0, 2, 3, 5, 0, 0, 0],
  [2, 0, 0, 4, 0, 8, 1, 0, 6],
  [5, 7, 0, 0, 0, 0, 0, 0, 0],
]

// Medium sudoku
export const SUDOKU_MEDIUM: SudokuGrid = [
  [6, 3, 0, 0, 0, 0, 0, 5, 0],
  [2, 0, 5, 3, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 6, 9, 0, 0],
  [0, 7, 0, 6, 9, 0, 5, 0, 0],
  [0, 0, 0, 0, 1, 3, 7, 4, 0],
  [0, 0, 2, 0, 0, 0, 0, 3, 0],
  [3, 1, 0, 9, 8, 4, 0, 7, 5],
  [7, 2, 9, 0, 3, 5, 0, 8, 6],
  [0, 0, 4, 0, 0, 0, 0, 9, 1],
]

// Evil sudoku
export const SUDOKU_EVIL: SudokuGrid = [
  [0, 6, 0, 0, 0, 0, 0, 0, 4],
  [0, 5, 0, 0, 6, 1, 0, 8, 0],
  [0, 1, 0, 0, 9, 0, 0, 0, 3],
  [2, 0, 0, 0, 8, 0, 0, 0, 7],
  [0, 0, 0, 6, 0, 4, 0, 0, 0],
  [9, 0, 0, 7, 0, 0, 0, 4, 0],
  [0, 9, 0, 0, 7, 0, 5, 0, 0],
  [3, 0, 0, 0, 1, 0, 0, 0, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const SUDOKU_1_SOLVED: SudokuGrid = [
  [3, 1, 5, 8, 9, 2, 6, 7, 4],
  [6, 8, 9, 7, 4, 1, 3, 2, 5],
  [7, 4, 2, 5, 6, 3, 8, 9, 1],
  [1, 2, 8, 3, 5, 4, 7, 6, 9],
  [9, 5, 7, 1, 8, 6, 4, 3, 2],
  [4, 3, 6, 9, 2, 7, 5, 1, 8],
  [8, 6, 1, 2, 3, 5, 9, 4, 7],
  [2, 9, 3, 4, 7, 8, 1, 5, 6],
  [5, 7, 4, 6, 1, 9, 2, 8, 3],
]

export const SUDOKU_EVIL_2: SudokuGrid = [
  [0, 0, 0, 0, 3, 0, 0, 0, 9],
  [0, 0, 0, 0, 0, 5, 0, 6, 0],
  [0, 0, 0, 0, 0, 7, 5, 0, 8],
  [0, 0, 6, 0, 0, 0, 0, 0, 0],
  [3, 2, 0, 0, 0, 0, 6, 0, 0],
  [0, 0, 0, 0, 8, 0, 0, 5, 4],
  [0, 3, 0, 0, 5, 0, 0, 0, 0],
  [8, 1, 0, 9, 4, 3, 0, 0, 0],
  [9, 0, 0, 0, 0, 8, 0, 0, 0],
]

export const SUDOKU_COORDINATES = [0, 1, 2, 3, 4, 5, 6, 7, 8]
export const SUDOKU_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const SQUARE_TABLE = (function () {
  const cells: Array<[number, number]> = flatten(
    SUDOKU_COORDINATES.map((x) => {
      return SUDOKU_COORDINATES.map((y) => {
        return [x, y] as [number, number]
      })
    }),
  )
  const grouped = groupBy(cells, ([x, y]) => {
    return Math.floor(y / 3) * 3 + Math.floor(x / 3)
  })
  // we sort them, so we can use an optimization
  const squares = sortBy(Object.keys(grouped), (k) => k).map((k) =>
    sortBy(grouped[k], ([x, y]) => `${y}-${x}`),
  )
  return squares
})()

export function squareIndex(x: number, y: number) {
  return Math.floor(y / 3) * 3 + Math.floor(x / 3)
}

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

export function parseSudoku(sudoku: string): SudokuGrid {
  // check if the input-data is correct
  const inputDataIsCorrectDomain = sudoku.split("").every((char) => {
    return (
      ["\n", "_"].concat(SUDOKU_NUMBERS.map((n) => String(n))).indexOf(char) >=
      0
    )
  })

  if (!inputDataIsCorrectDomain) {
    throw new Error("The input data is incorrect, only _, \n and 1...9 allowed")
  }

  const lines = sudoku.split("\n")

  if (lines.length !== 9) {
    throw new Error(`Wrong number of lines! Only 9 allowed: ${sudoku}`)
  }

  return lines.map((line) => {
    const characters = line.split("")
    if (characters.length !== 9) {
      throw new Error(
        `Wrong number of characters in line! Only 9 allowed: ${line} - ${sudoku}`,
      )
    }
    return characters.map((c) => {
      const number = c === "_" ? 0 : Number(c)
      return number
    })
  })
}

export function stringifySudoku(grid: SudokuGrid) {
  return grid
    .map((row) => {
      return row.map((c) => (c === 0 ? "_" : "" + c)).join("")
    })
    .join("\n")
}
