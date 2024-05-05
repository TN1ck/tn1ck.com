import { flatten, groupBy, sortBy } from "lodash-es"

export type SimpleSudoku = number[][]
export type DomainSudoku = number[][][]

export function toSimpleSudoku(grid: DomainSudoku): SimpleSudoku {
  return grid.map((row) => {
    return row.map((cells) => {
      return cells.length === 1 ? cells[0] : 0
    })
  })
}

export function toDomainSudoku(grid: SimpleSudoku): DomainSudoku {
  return grid.map((row) => {
    return row.map((c) => {
      return c === 0 ? SUDOKU_NUMBERS : [c]
    })
  })
}
// Easy sudoku
export const SUDOKU_1: SimpleSudoku = [
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
export const SUDOKU_3: SimpleSudoku = [
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
export const SUDOKU_2: SimpleSudoku = [
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

const SUDOKU_1_SOLVED: SimpleSudoku = [
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

export const SUDOKU_UNSOLVABLE: SimpleSudoku = [
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
