import { sortBy } from "lodash-es"
import {
  SQUARE_TABLE,
  SudokuGrid,
  squareIndex,
  toDomainSudoku,
  toSimpleSudoku,
} from "./common"
import { isSudokuFilled, isSudokuValid } from "./sudokus"

export type DomainSudoku = number[][][]

// AC3 algorithm. Returns the reduced domain sudoku and if it is solvable.
export function ac3(sudoku: DomainSudoku): {
  sudoku: DomainSudoku
  solvable: boolean
} {
  sudoku = sudoku.map((r) => r.map((c) => c.slice()))
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
      for (let x = 0; x < 9; x++) {
        let domain1 = sudoku[y][x]

        // The coordinates of the cells that have a constraint with the
        // the current cell.
        const coordinates: [number, number][] = []
        // Cells in the same row.
        for (let xx = 0; xx < 9; xx++) {
          if (xx === x) {
            continue
          }
          coordinates.push([y, xx])
        }

        // Cells in the same column.
        for (let yy = 0; yy < 9; yy++) {
          if (yy === y) {
            continue
          }
          coordinates.push([yy, x])
        }

        // Cells in the same square.
        const square = SQUARE_TABLE[squareIndex(x, y)]
        for (let c = 0; c < 9; c++) {
          const s = square[c]
          const [xx, yy] = s
          if (xx === x && yy === y) {
            continue
          }
          coordinates.push([yy, xx])
        }

        for (const [yy, xx] of coordinates) {
          const domain2 = sudoku[yy][xx]

          // If domain2 consists of only one number, remove it from domain1.
          //
          // This is an optimization of AC3:
          // AC3 checks if there is a value in domain1 that
          // does not comply the constraint with at least one value in domain2.
          // But because the constraint for sudoku is inequality, the case happens only
          // when the domain2 is just one variable.
          let changed = false
          if (domain2.length === 1) {
            const index = domain1.indexOf(domain2[0])
            if (index !== -1) {
              domain1.splice(index, 1)
              changed = true
            }
          }

          change = change || changed
          sudoku[y][x] = domain1
        }

        // A domain became empty (e.g. no value works for a cell), we can't solve this Sudoku,
        // continue with the next one.
        if (domain1.length === 0) {
          return { sudoku, solvable: false }
        }
      }
    }
    if (!change) {
      break
    }
  }

  return { sudoku, solvable: true }
}

// Solve the sudoku by using a constraint using ac3 and minimum remaining value.
export function AC3Strategy(sudoku: SudokuGrid): SudokuGrid[] {
  const domainSudoku = toDomainSudoku(sudoku)
  const { solvable, sudoku: reducedDomainSudoku } = ac3(domainSudoku)
  if (!solvable) {
    return []
  }
  // If we already solved the sudoku at this point, return it.
  const simpleSudoku = toSimpleSudoku(reducedDomainSudoku)
  if (isSudokuFilled(simpleSudoku) && isSudokuValid(simpleSudoku)) {
    return [simpleSudoku]
  }

  // No solution found yet. We create a list of all cells that have more than 1 solution as x/y coordinates.
  const emptyCellCoordinates: [number, number][] = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (reducedDomainSudoku[i][j].length > 1) {
        emptyCellCoordinates.push([i, j])
      }
    }
  }

  if (!emptyCellCoordinates) {
    return []
  }

  // We sort the possible cells to have the ones with the least possibilities be first.
  // This is called "Minimum remaining value" and is a very good heuristic.
  const sortedPossibleRowAndCells = sortBy(
    emptyCellCoordinates,
    ([rowIndex, cellIndex]) => {
      return reducedDomainSudoku[rowIndex][cellIndex].length
    },
  )

  // Take the best cell and create a new grid for every possibility the cell has.
  const [rowIndex, cellIndex] = sortedPossibleRowAndCells[0]
  const cell = reducedDomainSudoku[rowIndex][cellIndex]
  const newGrids = cell.map((n) => {
    const sudokuCopy = simpleSudoku.map((r) => r.slice())
    sudokuCopy[rowIndex][cellIndex] = n

    return sudokuCopy as SudokuGrid
  })

  return newGrids
}
