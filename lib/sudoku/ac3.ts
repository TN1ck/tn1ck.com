import { sortBy } from "lodash-es"
import {
  DomainSudoku,
  SQUARE_TABLE,
  SimpleSudoku,
  squareIndex,
  toSimpleSudoku,
} from "./common"

// If domain2 consists of only one number, remove it from domain1.
//
// This is an optimization of AC3:
// AC3 checks if there is a value in domain1 that
// does not comply the constraint with at least one value in domain2.
// But because the constraint for sudoku is inequality, the case happens only
// when the domain2 is just one variable. The <= is just a safe-check.
function removeValuesFromDomain(
  domain1: number[],
  domain2: number[],
): [number[], boolean] {
  let change = false
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

  // Loop until no changes are made to any domain of any cell.
  while (true) {
    let change = false
    // Add constraints (unique numbers in row / column / square).
    //
    // We do this by iterating over every cell and checking that cell with
    // all other cells in the same row / column / square and remove every
    // value from its domain that is in conflict with another one.
    // E.g.
    // Initially the cell is unfilled and has all possible values in its domain 1 - 9.
    // We then check the row and see that the numbers 1,4 are taken,
    // so we remove them, leaving us with 2,3,5,6,7,8,9.
    // We then check the columns and see that 2,5,6 are taken, so we end up with 3,7,8,9.
    // We then check the squares and see that 5 is taken, so we end up with 2 and 6.
    //
    // If the domain of any cell changed during this, we do this again for every cell,
    // as the change of one domain can lead to the change of another.
    for (let y = 0; y < 9; y++) {
      const row = rows[y]
      for (let x = 0; x < 9; x++) {
        let domainCell1 = row[x]

        // Cells in the same row.
        for (let xx = 0; xx < 9; xx++) {
          if (xx === x) {
            continue
          }
          const domainCell2 = row[xx]
          const result = removeValuesFromDomain(domainCell1, domainCell2)
          domainCell1 = result[0]
          change = change || result[1]
          row[x] = domainCell1
        }

        // Cells in the same column.
        for (let yy = 0; yy < 9; yy++) {
          if (yy === y) {
            continue
          }
          const domainCell2 = rows[yy][x]
          const result = removeValuesFromDomain(domainCell1, domainCell2)
          domainCell1 = result[0]
          change = change || result[1]
          row[x] = domainCell1
        }

        // Cells in the same square.
        const square = SQUARE_TABLE[squareIndex(x, y)]
        for (let c = 0; c < 9; c++) {
          const s = square[c]
          const [xx, yy] = s
          if (xx === x && yy === y) {
            continue
          }
          const domainCell2 = rows[yy][xx]
          const result = removeValuesFromDomain(domainCell1, domainCell2)
          domainCell1 = result[0]
          change = change || result[1]
          row[x] = domainCell1
        }

        // A domain became empty (e.g. no value works for a cell), we can't solve this Sudoku,
        // continue with the next one.
        if (domainCell1.length === 0) {
          return solveGridAC3(rest, cb)
        }
      }
    }
    if (!change) {
      break
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
