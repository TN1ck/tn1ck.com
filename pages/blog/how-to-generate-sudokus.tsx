/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  bruteForceStrategy,
  minimumRemainingValueStrategy,
  withValidCheckStrategy,
} from "../../lib/sudoku/sudokus"
import {
  SUDOKU_EASY,
  SUDOKU_EVIL,
  SUDOKU_MEDIUM,
  SUDOKU_EVIL_2,
  SudokuGrid,
  isSudokuFilled,
  isSudokuValid,
  toDomainSudoku,
} from "../../lib/sudoku/common"
import { AC3Strategy, DomainSudoku, ac3 } from "../../lib/sudoku/ac3"
import clsx from "clsx"
import { runBenchmarks } from "../../lib/sudoku/benchmark"
import { Accordion } from "../../components/accordion"

export const METADATA = {
  title: "How to generate Sudokus & rate their difficulties (WIP)",
  date: "2024-04-27",
  slug: "how-to-generate-sudokus",
}

const SudokuPreview = ({
  sudoku,
  notes,
  size,
}: {
  size: number
  sudoku: SudokuGrid
  notes?: DomainSudoku
}) => {
  const height = 100
  const width = 100
  const xSection = height / 9
  const ySection = width / 9
  return (
    <div
      className="relative"
      style={{
        height: size,
        width: size,
      }}
    >
      <div>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => {
          // const hide = [0, 9].includes(i)
          const makeBold = [0, 3, 6, 9].includes(y)
          return (
            <div
              style={{
                width: `${width}%`,
                top: `${xSection * y}%`,
                position: "absolute",
                transform: "translateY(-50%)",
                height: "1px",
                background: makeBold ? "black" : "lightgray",
              }}
              key={y}
            />
          )
        })}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => {
          // const hide = [0, 9].includes(i)
          const makeBold = [0, 3, 6, 9].includes(x)
          return (
            <div
              key={x}
              style={{
                width: "1px",
                left: `${ySection * x}%`,
                top: 0,
                position: "absolute",
                transform: "translateX(-50%)",
                height: `${height}%`,
                background: makeBold ? "black" : "gray",
              }}
            />
          )
        })}
      </div>
      {sudoku.map((row, y) => {
        return (
          <div key={y}>
            {row.map((n, x) => {
              const cellNotes = notes && notes[y][x]
              const alert = cellNotes?.length === 0
              return (
                <div key={x}>
                  <div
                    style={{
                      position: "absolute",
                      left: xSection * (x + 0.5) + "%",
                      top: ySection * (y + 0.5) + "%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {n === 0 ? "" : n}
                  </div>
                  {cellNotes && sudoku[y][x] === 0 ? (
                    <div
                      className={clsx({
                        "bg-red-600": alert,
                      })}
                      style={{
                        height: `${xSection}%`,
                        width: `${ySection}%`,
                        position: "absolute",
                        left: xSection * x + "%",
                        top: ySection * y + "%",
                      }}
                    >
                      <div
                        className="w-full h-full flex flex-wrap"
                        style={{
                          padding: "10%",
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((n) => {
                          return (
                            <div
                              className="flex items-center justify-center"
                              key={n}
                              style={{
                                fontSize: 6,
                                height: "33.333%",
                                width: "33.333%",
                              }}
                            >
                              {cellNotes && cellNotes.includes(n) ? n : " "}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

const SudokuApplet = ({
  strategy,
  showNotes,
  getNotes,
}: {
  strategy: (sudoku: SudokuGrid) => {
    newSudokus: SudokuGrid[]
    iterations: number
  }
  showNotes: boolean
  getNotes?: (sudoku: SudokuGrid) => DomainSudoku
}) => {
  const SUDOKUS = [
    {
      name: "Easy sudoku",
      sudoku: SUDOKU_EASY,
    },
    {
      name: "Medium sudoku",
      sudoku: SUDOKU_MEDIUM,
    },
    {
      name: "Evil sudoku",
      sudoku: SUDOKU_EVIL,
    },
  ]

  const [selection, setSelection] = useState(SUDOKUS[0].name)
  const selectedSudoku = SUDOKUS.find((s) => s.name === selection)!

  return (
    <div>
      <div className="flex mb-4 border-b-2 border-b-gray-500">
        {SUDOKUS.map((s, i) => {
          return (
            <button
              className={clsx(
                "py-2 px-4 hover:bg-blue-500 hover:text-white text-sm border-transparent",
                {
                  "rounded-r-none rounded-tl-md": i === 0,
                  "rounded-l-none rounded-tr-md": i === SUDOKUS.length - 1,
                  "border-r-black border": i !== SUDOKUS.length - 1,
                  "bg-blue-500 text-white": s.name === selection,
                  "bg-gray-200": s.name !== selection,
                },
              )}
              key={s.name}
              onClick={() => setSelection(s.name)}
            >
              {s.name}
            </button>
          )
        })}
      </div>
      <div>
        <SudokuSolverDomain
          strategy={strategy}
          showNotes={showNotes}
          sudokuToSolve={selectedSudoku.sudoku}
          getNotes={getNotes}
        />
      </div>
    </div>
  )
}

const SudokuSolverDomain = ({
  sudokuToSolve,
  strategy,
  showNotes,
  getNotes,
}: {
  sudokuToSolve: SudokuGrid
  strategy: (sudoku: SudokuGrid) => {
    newSudokus: SudokuGrid[]
    iterations: number
  }
  showNotes: boolean
  getNotes?: (sudoku: SudokuGrid) => DomainSudoku
}) => {
  const [history, setHistory] = useState<SudokuGrid[]>([])
  const [sudoku, setSudoku] = useState<SudokuGrid>(sudokuToSolve)
  const [stack, setStack] = useState<SudokuGrid[]>([sudokuToSolve])
  const [timeoutValue, setTimeoutValue] = useState<number>(10)
  const [iterations, setIterations] = useState<number>(0)

  const [running, setRunning] = useState(false)

  const reset = useCallback(() => {
    setRunning(false)
    setIterations(0)
    setHistory([])
    setSudoku(sudokuToSolve)
    setStack([sudokuToSolve])
  }, [
    setRunning,
    setIterations,
    setHistory,
    setSudoku,
    setStack,
    sudokuToSolve,
  ])

  useEffect(() => {
    reset()
  }, [sudokuToSolve, reset])

  const step = useCallback(
    (timeout: number) => {
      const [current, ...rest] = stack
      setSudoku(current)
      setHistory([current, ...history])
      if (isSudokuFilled(current) && isSudokuValid(current)) {
        setStack([sudokuToSolve])
        setRunning(false)
        return
      }
      setTimeout(() => {
        const { newSudokus, iterations: strategyIterations } = strategy(current)
        setIterations(iterations + strategyIterations)
        setStack([...newSudokus, ...rest])
      }, timeout)
    },
    [
      history,
      setHistory,
      stack,
      setStack,
      setRunning,
      strategy,
      setIterations,
      iterations,
      sudokuToSolve,
    ],
  )

  useEffect(() => {
    if (!running) {
      return
    }
    setTimeout(() => {
      step(timeoutValue)
    })
  }, [step, timeoutValue, running])

  return (
    <div>
      <div></div>
      <div className="flex justify-between">
        <div className="pr-4">
          <div className="flex gap-2">
            <button
              className="w-24 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => {
                setRunning(!running)
              }}
            >
              {running ? "Pause" : "Solve"}
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-red-600"
              onClick={reset}
            >
              {"Reset"}
            </button>
            <button
              className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => {
                step(0)
              }}
            >
              {"Step"}
            </button>
          </div>
          <div className="mt-4">
            <label htmlFor="timeout">Time between each step (ms)</label>
            <input
              className="w-20 border border-gray-300 rounded-md p-1"
              min={1}
              id="timout"
              max={1000}
              value={timeoutValue}
              onChange={(e) => setTimeoutValue(parseInt(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <div>Iterations: {iterations}</div>
            <div>Stack size: {stack.length}</div>
          </div>
        </div>
        <SudokuPreview
          sudoku={sudoku}
          size={300}
          notes={
            showNotes && getNotes && history.length > 0
              ? getNotes(history[0])
              : undefined
          }
        />
      </div>
    </div>
  )
}

const Hashcode: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent>
        <h1>{METADATA.title}</h1>
        <Author date={METADATA.date} />
        <p>
          Writing a Sudoku Solver is a fun challenge for every CS graduate or
          politicians, as{" "}
          <a href="https://www.bbc.com/news/technology-32591984">
            Singapurs prime minister famously wrote one in C++
          </a>
          . In this article we go a few steps beyond: Writing a program to
          generate Sudokus of any difficulty.
        </p>
        <h2>Creating a sudoku solver</h2>
        <p>
          First things first, to generate a sudoku, we first have to solve one.
          And the solver plays an integral part into the generation part as we
          will use the iterations it needed to solve a sudoku to measure the
          difficulty.
        </p>
        <p>
          Here is a step by step guide on how to create the solver we will use
          for sudoku generation. We start with the most basic brute force
          algorithm and end up with the final one, based on seeing the sudoku as
          a Constraint Satisfaction Problems (short CSP). We use a depth first
          search (short DFS) for all our different strategies here, we abstract
          this by the following function. We make it sudoku specific instead of
          completely generic for ease of use. Adding caching to prevent
          calculating the same branch multiple times is left as an exercise for
          the reader.
        </p>
        <Accordion title="Code of the depth first search">
          <CodeBlock language="typescript">
            {`function dfs(
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
}`}
          </CodeBlock>
        </Accordion>
        <h3>Brute force version</h3>
        <p>
          This is the most simple strategy to solve the sudoku: We find an empty
          spot and fill in a number between 1 - 9. We don’t do anything else.
          This is horribly slow, do not try this at home.
        </p>
        <SudokuApplet showNotes={false} strategy={bruteForceStrategy} />
        <Accordion title="Code of the brute force strategy">
          <CodeBlock language="typescript">{`function bruteForceStrategy(sudoku: SudokuGrid): SimpleSudoku[] {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
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
}`}</CodeBlock>
        </Accordion>
        <h3>Skip on invalid sudokus</h3>
        <p>
          The simplest and most substantial change we can do, is not not waiting
          until the whole Sudoku is filled, but skipping on the Sudokus that are
          already invalid.
        </p>
        <SudokuApplet showNotes={false} strategy={withValidCheckStrategy} />
        <Accordion title="Code of the improved brute force">
          <CodeBlock language="typescript">{`function withValidCheckStrategy(sudoku: SudokuGrid): SudokuGrid[] {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        const newSudokus = []
        for (let k = 1; k <= 9; k++) {
          const newSudoku = sudoku.map((row) => row.slice())
          newSudoku[i][j] = k
          // This is the change!
          if (isSudokuValid(newSudoku)) {
            newSudokus.push(newSudoku)
          }
        }
        return newSudokus
      }
    }
  }

  return []
}`}</CodeBlock>
        </Accordion>
        <h3>Minimum remaining value</h3>
        <p>
          "Minimum remaining value" is a heuristic we can use to not search
          blindly, but to select the cell next with the least amount of
          possibilities. This is something a human would do as well - fill or
          work on the cells with least options. This greatly reduces the number
          of iterations needed for the difficult sudoku. This algorithm is
          pretty solid now as it can solve even the hardest sudokus in the
          millisecond range.
        </p>
        <SudokuApplet
          showNotes={false}
          strategy={minimumRemainingValueStrategy}
        />
        <Accordion title="Code of the minimum remaining value strategy">
          <CodeBlock language="typescript">{`function getEmptyCoordinates(sudoku: SudokuGrid): [number, number][] {
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

function minimumRemainingValueStrategy(
  sudoku: SudokuGrid,
): SudokuGrid[] {
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
    if (isSudokuValid(newSudoku)) {
      newSudokus.push(newSudoku)
    }
  }

  return newSudokus
}`}</CodeBlock>
        </Accordion>
        <h3>Arc Consistency</h3>
        <p>
          The intuitive way on how Arc consistency works is that for every cell
          in the sudoku, we keep track of its possible values. We reduce the
          possible values for every cell by checking the sudoku constraints e.g.
          remove the numbers that are already have a value in the same row /
          column / square. We do this as long until no domain is changing
          anymore. This "reduction of domains using the constraints" is arc
          consistency. For very simple sudokus, this is already enough to solve
          one, for harder ones, we are left with multiple options for every
          unfilled cell. This means we have to employ a search again. We use
          then the "Minimum remaining value" strategy again to select the cell
          with the least options and create a new versions of the sudoku with
          that cell filled with the possible values. This is called "domain
          splitting" in fancy computer science terms. The number of iterations
          we count here are the times we executed the whole AC3 algorithm i.e.
          reduce the amount of possibilities as long as nothing changes. This is
          really similar on how experts solve sudokus, which means that the
          iteration count should be very good indicator for the difficulty.
        </p>
        <p>
          The applet shows the domains of the applied ac3 algorithm in unfilled
          cells. If a sudoku can not be solved, one domain will become empty,
          which is shown as red, then the algorithm will backtrack.
        </p>
        <Accordion title="Code of the Arc consistency strategy">
          <CodeBlock language="typescript">{`export type DomainSudoku = number[][][]

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
}`}</CodeBlock>
        </Accordion>
        <SudokuApplet
          showNotes={true}
          strategy={AC3Strategy}
          getNotes={(sudoku: SudokuGrid) => {
            return ac3(toDomainSudoku(sudoku)).sudoku
          }}
        />
        <h3>Rating the difficulty of sudokus</h3>
        <p>
          The main problem that one faces when generating a sudoku is to assign
          the difficulty rating for a human solver. As we don’t want to manually
          verify every Sudoku we generate, we need an automatic way for us to
          group a newly generated Sudoku according to its difficulty. All our
          sudoku solvers yield an iteration count, which we will use as our cost
          function. I'm relying here on the paper "Rating and generating Sudoku
          puzzles based on constraint satisfaction problems." by Fatemi, Bahare,
          Seyed Mehran Kazemi, and Nazanin Mehrasa.{" "}
          <a href="#footnotes">
            <sup>1</sup>
          </a>
          In the paper, they download sudokus of each difficulty section from
          websudoku.com, solve them by <s> students</s> volunteers and then ran
          their algorithm on it. They then took the average of each category and
          so they got an iteration to difficulty mapping.
        </p>
        <p>
          We will do basically the same, but actually publishing the data and
          also trying out how the "lesser" strategies work here for rating the
          difficulty. I fetched 100 sudokus from websudoku.com for each of its
          difficulty classes as well as from sudoku.com.
        </p>
        <ul></ul>
        <h3>Generating a Sudoku with a specific difficulties</h3>
        <p>
          To now generate a sudoku of a specific difficulty, we do the
          following:
        </p>
        <ol>
          <li>
            We generate a random _valid_ Sudoku. We do this by assigning
            randomly filling the coordinates of the Sudoku and removing any
            numbers that are in conflict.
          </li>
          <li>
            If the sudoku is already unique, meaning there can only be one
            solution we continue, if not we add numbers as long until it is
            unique. If we could not make it unique, go back to step 1.
          </li>
          <li>
            To generate a sudoku of a wanted difficulty, we either remove
            numbers or add numbers until the reached difficulty is reached.
          </li>
          <li>
            If we cannot delete any more numbers without making it non unique,
            meaning we reached max difficulty, but the difficulty is below the
            requested one, start at 1. again.
          </li>
          <li>
            If the call count is close to the requested value, return the
            sudoku.
          </li>
        </ol>
        <p>
          As 4. points out, generating very difficult sudokus can take quite
          some time as any generation method will struggle with the uniqueness
          constraint and has to randomly alter the sudoku.
        </p>
        <h3 id="criticism">Generation algorithm as described by the paper</h3>
        <p>
          As mentioned above, the algorithm described in the paper has some
          issues, which in effect make it <strong>very</strong> slow albeit
          still valid. Here is how they describe the algorithm:
        </p>
        <blockquote>
          We use hill climbing to generate new puzzles having a call count close
          to the call count we need. In this method, first of all, we generate
          an initial puzzle with some random numbers inside it and calculate its
          cost function. Then in each iteration, we randomly change one element
          of this solution by adding, deleting, or changing a single number and
          calculate the cost function again. After this, we check the new value
          of the cost function for this new puzzle and compare it to the
          previous one. If the cost is reduced, we accept the second puzzle as
          the new solution and otherwise we undo the change. We do this process
          until meeting the stopping criterion. The cost function for a given
          puzzle is infinity for puzzles with none or more than one solutions.
          For other puzzles, the cost is the absolute value of the current
          puzzle’s call count minus the average call count of the given
          difficulty level. For example if we want to generate an easy puzzle
          and we want to consider the values demonstrated in Table I, then the
          cost function for a puzzle having a unique solution is the absolute
          value of its call count minus 6.234043. We stop the algorithm when we
          have puzzles with costs close to zero. Depending on the level of
          accuracy we need and the number of difficulty levels we have, we can
          define the closeness of the cost function to zero.
        </blockquote>
        <p>
          When I first read it, I thought "we generate an initial puzzle with
          some random numbers inside it" would mean that I could start with a
          Sudoku grid and put random numbers in it. But one needs an already
          valid sudoku as else the hill climbing will not work as the cost
          function for an invalid configuration should return infinite. While
          theoretically it still works, it takes far too long to stumble upon a
          valid configuration like this. I’m not entirely sure if they meant to
          start with a valid Sudoku, but "initial puzzle with some random
          numbers" does not sound like it. Furthermore, "just adding, deleting
          or changing a single number" is not efficient, as again they, this can
          lead to an invalid configuration quickly, albeit the hill climbing
          will now be a bit faster, although we can easily guide the algorithm
          more here.
        </p>
        <h3>Footnotes</h3>
        <blockquote>
          FATEMI, Bahare; KAZEMI, Seyed Mehran; MEHRASA, Nazanin. Rating and
          generating Sudoku puzzles based on constraint satisfaction problems.
          International Journal of Computer and Information Engineering, 2014,
          8. Jg., Nr. 10, S. 1816-1821.{" "}
          <a href="https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=fc78d54ae5d5234c9fb229d6a2cd2ef5af181e70">
            PDF
          </a>
        </blockquote>
      </BlogContent>
    </Container>
  )
}

export default Hashcode
