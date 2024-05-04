import { sortBy, groupBy, flatten } from "lodash-es"

export type SimpleSudoku = number[][]

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

const isSudokuFilled = (sudoku: SimpleSudoku): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) return false
    }
  }
  return true
}

const isSudokuValid = (sudoku: SimpleSudoku): boolean => {
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
export const dfsBruteForce = async (
  stack: SimpleSudoku[],
  cb: (sudokus: SimpleSudoku[]) => Promise<void>,
): Promise<SimpleSudoku | null> => {
  if (stack.length === 0) return null
  await cb(stack)

  const [sudoku, ...rest] = stack

  const isFilled = isSudokuFilled(sudoku)
  const isValid = isSudokuValid(sudoku)

  if (isFilled && isValid) return sudoku

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
        return dfsBruteForce([...newSudokus, ...rest], cb)
      }
    }
  }

  return dfsBruteForce(rest, cb)
}

export const dfsWithValidCheck = async (
  stack: SimpleSudoku[],
  cb: (sudokus: SimpleSudoku[]) => Promise<void>,
): Promise<SimpleSudoku | null> => {
  if (stack.length === 0) return null
  await cb(stack)

  const [sudoku, ...rest] = stack

  const isFilled = isSudokuFilled(sudoku)
  const isValid = isSudokuValid(sudoku)

  if (isFilled && isValid) return sudoku
  if (!isValid || isFilled) return dfsWithValidCheck(rest, cb)

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
        return dfsWithValidCheck([...newSudokus, ...rest], cb)
      }
    }
  }

  return dfsWithValidCheck(rest, cb)
}

const getEmptyCoordinates = (sudoku: SimpleSudoku): [number, number][] => {
  const emptyCoordinates: [number, number][] = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        emptyCoordinates.push([i, j])
      }
    }
  }
  return emptyCoordinates
}

export const dfsMinimumRemainingValue = async (
  stack: SimpleSudoku[],
  cb: (sudokus: SimpleSudoku[]) => Promise<void>,
): Promise<SimpleSudoku | null> => {
  if (stack.length === 0) return null
  await cb(stack)

  const [sudoku, ...rest] = stack

  const isFilled = isSudokuFilled(sudoku)
  const isValid = isSudokuValid(sudoku)

  if (isFilled && isValid) return sudoku
  if (!isValid || isFilled) return dfsMinimumRemainingValue(rest, cb)

  const emptyCoordinates = getEmptyCoordinates(sudoku)

  // For every coordinate, calculate the number of possibilities.
  const possibilities = emptyCoordinates.map(([i, j]) => {
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
    return [i, j, 9 - set.size]
  })

  // Sort by the number of possibilities.
  const sortedPossibilities = possibilities.sort((a, b) => a[2] - b[2])

  // We take the first coordinate with the least possibilities.
  const [i, j] = sortedPossibilities[0]
  const newSudokus = []
  for (let k = 1; k <= 9; k++) {
    const newSudoku = sudoku.map((row) => row.slice())
    newSudoku[i][j] = k
    newSudokus.push(newSudoku)
  }

  return dfsMinimumRemainingValue([...newSudokus, ...rest], cb)
}

export type DomainSudoku = number[][][]

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

function removeValuesFromDomain(
  domain1: number[],
  domain2: number[],
): [number[], boolean] {
  let change = false
  // this is an optimization:
  // AC3 checks if there is a value in domain1 that
  // does not comply the constraint with at least one value in domain2.
  // But because the constraint is inequality, the case happens only
  // when the domain2 is just one variable. The <= is just a safe-check.
  if (domain2.length <= 1) {
    const index = domain1.indexOf(domain2[0])
    if (index !== -1) {
      domain1 = domain1.slice()
      domain1.splice(index, 1)
      change = true
    }
  }
  return [domain1, change]
}

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

/**
 * For more information see the paper
 * Rating and Generating Sudoku Puzzles Based On Constraint Satisfaction Problems
 * by Bahare Fatemi, Seyed Mehran Kazemi, Nazanin Mehrasa
 */
export async function solveGridAC3(
  stack: DomainSudoku[],
  cb: (sudokus: DomainSudoku[]) => Promise<void>,
): Promise<SimpleSudoku | null> {
  if (stack.length === 0) {
    return null
  }
  await cb(stack)

  const [grid, ...rest] = stack

  const rows = grid

  // add row column constraints
  for (let y = 0; y < 9; y++) {
    const row = rows[y]
    for (let x = 0; x < 9; ) {
      let domain1 = row[x]
      let change = false
      // I tried to be clever and tried not to compare cells twice
      // but this is will falsify the algorithm
      for (let xx = 0; xx < 9; xx++) {
        if (xx === x) {
          continue
        }
        const domain2 = row[xx]
        const result = removeValuesFromDomain(domain1, domain2)
        domain1 = result[0]
        change = result[1]
        row[x] = domain1
      }

      for (let yy = 0; yy < 9; yy++) {
        if (yy === y) {
          continue
        }
        const domain2 = rows[yy][x]
        const result = removeValuesFromDomain(domain1, domain2)
        domain1 = result[0]
        change = change || result[1]
        row[x] = domain1
      }

      const square = SQUARE_TABLE[squareIndex(x, y)]
      for (let c = 0; c < 9; c++) {
        const s = square[c]
        const [xx, yy] = s
        if (xx === x && yy === y) {
          continue
        }
        const domain2 = rows[yy][xx]
        const result = removeValuesFromDomain(domain1, domain2)
        domain1 = result[0]
        change = change || result[1]
        row[x] = domain1
      }

      if (change || domain1.length === 0) {
        if (domain1.length === 0) {
          return solveGridAC3(rest, cb)
        }
        // we loop again and simulate the adding of the edges
      } else {
        x++
      }
    }
  }

  const isFilled = grid.every((row) => {
    return row.every((cells) => {
      return cells.length === 1
    })
  })

  // Every domain is length 1, we found a solution!
  if (isFilled) {
    return toSimpleSudoku(grid)
  }

  // No solution found yet. We create a list of all cells that have more than 1 solution as x/y coordinates.
  const possibleRowAndCells = grid.reduce(
    (current: Array<[number, number]>, row, index) => {
      const possibleCells = row.reduce(
        (currentCells: Array<[number, number]>, cells, cellIndex) => {
          if (cells.length > 1) {
            return currentCells.concat([[index, cellIndex]])
          }
          return currentCells
        },
        [],
      )
      return current.concat(possibleCells)
    },
    [],
  )
  // We sort the possible cells to have the ones with the least possibilities be first.
  // This is called "Minimum remaining value" and is a very good heuristic. It is similar to how
  // humans solve Sudokus.
  const sortedPossibleRowAndCells = sortBy(
    possibleRowAndCells,
    ([rowIndex, cellIndex]) => {
      return grid[rowIndex][cellIndex].length
    },
  )
  // Take the best cell and create a new grid for every possibility the cell has.
  const [rowIndex, cellIndex] = sortedPossibleRowAndCells[0]
  const cell = grid[rowIndex][cellIndex]
  const newGrids = cell.map((n) => {
    return grid.map((row, r) => {
      if (r === rowIndex) {
        return row.map((cells, c) => {
          if (c === cellIndex) {
            return [n]
          }
          return [...cells]
        })
      }
      return [...row]
    })
  })
  // The new stack is put first and we recursively descend.
  const newStack = newGrids.concat(rest)
  return solveGridAC3(newStack, cb)
}
