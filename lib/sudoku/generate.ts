import {
  SUDOKU_NUMBERS,
  SUDOKU_COORDINATES,
  SQUARE_TABLE,
  SudokuGrid,
  isSudokuValid,
} from "./common"
import { flatten } from "lodash-es"
import { sample, shuffle } from "./seededRandom"
import { dfsLoop, minimumRemainingValueStrategy } from "./sudokus"
import { AC3Strategy } from "./ac3"

export enum DIFFICULTY {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  EXPERT = "expert",
  EVIL = "evil",
}

const DIFFICULTY_MAPPING = {
  [DIFFICULTY.EASY]: 3,
  [DIFFICULTY.MEDIUM]: 20,
  [DIFFICULTY.HARD]: 50,
  [DIFFICULTY.EXPERT]: 200,
  [DIFFICULTY.EVIL]: 500,
}

const sudokuSolver = (
  sudoku: SudokuGrid,
): { solvedSudoku: SudokuGrid | null; iterations: number } => {
  return dfsLoop([sudoku], AC3Strategy, 0)
}

export const sudokuSolverMRV = (
  sudoku: SudokuGrid,
): { solvedSudoku: SudokuGrid | null; iterations: number } => {
  return dfsLoop([sudoku], minimumRemainingValueStrategy, 0)
}

/**
 * Checks that there is only one solution for the sudoku.
 *
 * This works by iterating over all cells and if an empty one is encountered,
 * we set numbers from 1-9 and make sure that only one yields a solution.
 */
export function checkForUniqueness(
  sudoku: SudokuGrid,
  solver = sudokuSolver,
): boolean {
  let rowIndex = 0
  for (const row of sudoku) {
    let colIndex = 0
    for (const col of row) {
      // if it's 0, we try every number and if it's still solvable
      // with two different numbers it's not unique
      if (col === 0) {
        let timesSolved = 0
        for (const num of SUDOKU_NUMBERS) {
          const newSudoku = cloneSudoku(sudoku)
          newSudoku[rowIndex][colIndex] = num
          if (!isSudokuValid(newSudoku)) {
            continue
          }

          const { solvedSudoku } = solver(newSudoku)
          if (solvedSudoku !== null) {
            timesSolved++
          }
          if (timesSolved > 1) {
            return false
          }
        }
      }
      colIndex++
    }
    rowIndex++
  }
  return true
}

/**
 * Enhances the uniqueness of a sudoku.
 *
 * Whenever a number is encountered that would lead to two different solutions,
 * one number is set and the new sudoku is returned.
 *
 * When uniqueness could not be increased, returns the same sudoku.
 */
export function enhanceUniqueness(
  sudoku: SudokuGrid,
  randomFn: () => number,
): SudokuGrid {
  const randomRows = randomIndexes(randomFn)
  for (const row of randomRows) {
    const randomColumns = randomIndexes(randomFn)
    for (const col of randomColumns) {
      const num = sudoku[row][col]
      // We hit a 0, that means we can check for how many sudoku numbers it could be solved.
      if (num === 0) {
        let timesSolved = 0
        for (const num of SUDOKU_NUMBERS) {
          const newSudoku = cloneSudoku(sudoku)
          newSudoku[row][col] = num

          const { solvedSudoku } = sudokuSolver(newSudoku)
          if (solvedSudoku !== null) {
            timesSolved++
            if (timesSolved > 1) {
              return newSudoku
            }
          }
        }
      }
    }
  }
  return sudoku
}

/**
 * Simplify the sudoku.
 *
 * Basically set a number that is not set yet.
 */
export function simplifySudoku(
  sudoku: SudokuGrid,
  randomFn: () => number,
): SudokuGrid {
  const solvedSudoku = sudokuSolver(sudoku).solvedSudoku
  if (solvedSudoku === null) {
    throw new Error("Sudoku is not solvable.")
  }
  const randomRows = randomIndexes(randomFn)
  for (const row of randomRows) {
    const randomColumns = randomIndexes(randomFn)
    for (const column of randomColumns) {
      if (sudoku[row][column] === 0) {
        const newSudoku = cloneSudoku(sudoku)
        newSudoku[row][column] = solvedSudoku[row][column]
        return newSudoku
      }
    }
  }
  return sudoku
}

const isCoordinate = (item: number[] | undefined): item is number[] => {
  return item !== undefined
}

function generateCoordinateList(sudoku: SudokuGrid): number[][] {
  const coordinates = sudoku.map((row, i) => {
    return row.map((n, c) => (n !== 0 ? [i, c] : undefined))
  })
  const coordinatesWithNumbers = flatten(coordinates).filter(isCoordinate)
  return coordinatesWithNumbers
}

function randomIndexes(randomFn: () => number) {
  return shuffle(SUDOKU_COORDINATES, randomFn)
}

function fixRows(sudoku: SudokuGrid, randomFn: () => number) {
  const xIndexes = randomIndexes(randomFn)
  for (let x of xIndexes) {
    const wrongNumbers = Array(9).map(() => false)
    const yIndexes = randomIndexes(randomFn)
    for (let y of yIndexes) {
      const number = sudoku[x][y]
      if (number !== 0 && wrongNumbers[number]) {
        sudoku[x][y] = 0
      }
      wrongNumbers[number] = true
    }
  }
}

function fixColumns(sudoku: SudokuGrid, randomFn: () => number) {
  const xIndexes = randomIndexes(randomFn)
  for (let x of xIndexes) {
    const wrongNumbers = Array(9).map(() => false)
    const yIndexes = randomIndexes(randomFn)
    for (let y of yIndexes) {
      const number = sudoku[y][x]
      if (number !== 0 && wrongNumbers[number]) {
        sudoku[y][x] = 0
      }
      wrongNumbers[number] = true
    }
  }
}

/**
 * Removes all numbers that make the sudoku invalid.
 */
function fixGrid(sudoku: SudokuGrid, randomFn: () => number) {
  const indexes = randomIndexes(randomFn)
  for (let s = 0; s < 9; s++) {
    const wrongNumbers = Array(9).map(() => false)
    const square = SQUARE_TABLE[s]
    for (let xy of indexes) {
      const [x, y] = square[xy]
      const number = sudoku[x][y]
      if (number !== 0 && wrongNumbers[number]) {
        sudoku[x][y] = 0
      }
      wrongNumbers[number] = true
    }
  }
}

export function fixSudoku(sudoku: SudokuGrid, randomFn: () => number) {
  fixGrid(sudoku, randomFn)
  fixColumns(sudoku, randomFn)
  fixRows(sudoku, randomFn)
}

/**
 * Generate a random sudoku.
 */
export function generateRandomSudoku(randomFn: () => number): SudokuGrid {
  const randomSudoku = SUDOKU_NUMBERS.map(() => {
    return shuffle(
      SUDOKU_NUMBERS.map((n) => {
        return randomFn() > 0.8 ? n : 0
      }),
      randomFn,
    )
  })
  fixSudoku(randomSudoku, randomFn)
  return randomSudoku
}

export function cloneSudoku(sudoku: SudokuGrid): SudokuGrid {
  return [...sudoku.map((r) => [...r])]
}

const RELATIVE_DRIFT = 20
// this is mostly needed for the esay difficulty, because the iterations needed there
// are too low that the relative drift would do anything
const ABSOLUTE_DRIFT = 3

export function increaseDifficultyOfSudoku(
  sudoku: SudokuGrid,
  randomFn: () => number,
): SudokuGrid {
  const costs = sudokuSolver(sudoku).iterations
  let coordinateList = generateCoordinateList(sudoku)
  while (coordinateList.length > 0) {
    const sampleXY = sample(coordinateList, randomFn)
    const [x, y] = sampleXY
    coordinateList = coordinateList.filter(([cx, cy]) => cx !== x && cy !== y)
    const newSudoku = cloneSudoku(sudoku)
    newSudoku[x][y] = 0
    const newCosts = sudokuSolver(newSudoku).iterations
    if (newCosts >= costs && checkForUniqueness(newSudoku)) {
      return newSudoku
    }
  }
  return sudoku
}

export function makeSudokuSolvable(
  sudoku: SudokuGrid,
  randomFn: () => number,
): SudokuGrid {
  sudoku = cloneSudoku(sudoku)
  while (sudokuSolver(sudoku).solvedSudoku === null) {
    const randomX = sample(SUDOKU_COORDINATES, randomFn)
    const randomY = sample(SUDOKU_COORDINATES, randomFn)
    sudoku[randomX][randomY] =
      randomFn() > 0.8 ? sample(SUDOKU_NUMBERS, randomFn) : 0
    fixSudoku(sudoku, randomFn)
  }
  return sudoku
}

export function createSolvableSudoku(randomFn: () => number): SudokuGrid {
  let sudoku = generateRandomSudoku(randomFn)
  return makeSudokuSolvable(sudoku, randomFn)
}

export function makeSudokuUnique(
  sudoku: SudokuGrid,
  randomFn: () => number,
): [SudokuGrid, boolean] {
  sudoku = cloneSudoku(sudoku)
  while (!checkForUniqueness(sudoku)) {
    const newBestSudoku = enhanceUniqueness(sudoku, randomFn)
    if (newBestSudoku === sudoku) {
      console.log("Max uniqueness reached")
      break
    }
    sudoku = newBestSudoku
  }

  return [sudoku, checkForUniqueness(sudoku)]
}

export function generateSudoku(
  difficulty: DIFFICULTY,
  randomFn: () => number,
): SudokuGrid {
  const iterationGoal = DIFFICULTY_MAPPING[difficulty]

  /**
   * returns the percentage of how close we are to the iteration goal
   */
  function rateIterationsRelative(cost: number): number {
    if (cost === Infinity) {
      return cost
    }
    return Math.abs(cost / iterationGoal - 1) * 100
  }

  /**
   * returns the absolute difference to the iteration goal
   */
  function rateCostsAbsolute(cost: number): number {
    return Math.abs(cost - iterationGoal)
  }

  /**
   * returns if the costs are close enough to the requested difficulty level
   */
  function validIterations(cost: number): boolean {
    return (
      rateIterationsRelative(cost) < RELATIVE_DRIFT ||
      rateCostsAbsolute(cost) < ABSOLUTE_DRIFT
    )
  }

  let unique = false
  let sudoku: SudokuGrid = []
  while (!unique) {
    // 1. create a random, solvable sudoku.
    sudoku = createSolvableSudoku(randomFn)
    // 2. make it unique.
    ;[sudoku, unique] = makeSudokuUnique(sudoku, randomFn)
  }

  let currentIterations = sudokuSolver(sudoku).iterations
  while (!validIterations(currentIterations)) {
    let newSudoku: SudokuGrid = []
    // Too difficult, make it easier.
    if (currentIterations > iterationGoal) {
      newSudoku = simplifySudoku(sudoku, randomFn)
    }
    // Too easy, make it more difficult.
    if (currentIterations < iterationGoal) {
      newSudoku = increaseDifficultyOfSudoku(sudoku, randomFn)
    }
    const newIterations = sudokuSolver(newSudoku).iterations
    if (currentIterations === newIterations) {
      console.log("Reached maximum simplicity / difficulty with this sudoku.")
      break
    }
    sudoku = newSudoku
    currentIterations = newIterations
  }
  console.log(
    `Needed ${currentIterations} to generate this sudoku. Goal was ${iterationGoal}.`,
  )
  return sudoku
}

export default generateSudoku
