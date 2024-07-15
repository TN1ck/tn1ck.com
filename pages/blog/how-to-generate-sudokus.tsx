/* eslint-disable react/no-unescaped-entities */
import { NextPage, Metadata } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  bruteForceStrategy,
  dfsLoop,
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
  SUDOKU_HARD,
  SUDOKU_COORDINATES,
  SUDOKU_NUMBERS,
  toSimpleSudoku,
} from "../../lib/sudoku/common"
import { AC3Strategy, DomainSudoku, ac3 } from "../../lib/sudoku/ac3"
import clsx from "clsx"
import { Accordion } from "../../components/accordion"
import Link from "next/link"
import {
  checkForUniqueness,
  cloneSudoku,
  createSolvableSudoku,
  enhanceUniqueness,
  fixSudoku,
  generateRandomSudoku,
  increaseDifficultyOfSudoku,
  makeSudokuSolvable,
  makeSudokuUnique,
  simplifySudoku,
  sudokuSolverMRV,
} from "../../lib/sudoku/generate"
import {
  createSeededRandom,
  sample,
  shuffle,
} from "../../lib/sudoku/seededRandom"
import { Card } from "../../components/card"
import { TabComponent } from "../../components/tab"
import { Footnote } from "../../components/footnote"
import Head from "next/head"

export const metadata = {
  title: "Generating sudokus for fun and no profit",
  description: "A guide on how to generate sudokus of any difficulty.",
  date: "2024-06-25",
  slug: "how-to-generate-sudokus",
}

const dataAnalysis = [
  {
    name: "Brute Force w. skip",
    histogram:
      "/how-to-generate-sudokus/benchmark_bruteForceWithValidCheck.csv_histograms.png",
    qqPlot:
      "/how-to-generate-sudokus/benchmark_bruteForceWithValidCheck.csv_qq_plots.png",
    correlation:
      "/how-to-generate-sudokus/benchmark_bruteForceWithValidCheck.csv_correlation.png",
    csv: "/how-to-generate-sudokus/benchmark_bruteForceWithValidCheck.csv",
  },
  {
    name: "Minimum Remaining Value",
    histogram:
      "/how-to-generate-sudokus/benchmark_minimumRemainingValue.csv_histograms.png",
    qqPlot:
      "/how-to-generate-sudokus/benchmark_minimumRemainingValue.csv_qq_plots.png",
    correlation:
      "/how-to-generate-sudokus/benchmark_minimumRemainingValue.csv_correlation.png",
    csv: "/how-to-generate-sudokus/benchmark_minimumRemainingValue.csv",
  },
  {
    name: "Arc Consistency",
    histogram: "/how-to-generate-sudokus/benchmark_ac3.csv_histograms.png",
    qqPlot: "/how-to-generate-sudokus/benchmark_ac3.csv_qq_plots.png",
    correlation: "/how-to-generate-sudokus/benchmark_ac3.csv_correlation.png",
    csv: "/how-to-generate-sudokus/benchmark_ac3.csv",
  },
]

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
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => {
          // const hide = [0, 9].includes(i)
          const makeBold = [0, 3, 6, 9].includes(x)
          return (
            <div
              key={x}
              style={{
                width: "2px",
                left: `${ySection * x}%`,
                top: 0,
                position: "absolute",
                transform: "translateX(-50%)",
                height: `${height}%`,
                zIndex: makeBold ? 1 : 0,
                background: makeBold ? "black" : "lightgray",
              }}
            />
          )
        })}
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
                height: "2px",
                zIndex: makeBold ? 1 : 0,
                background: makeBold ? "black" : "lightgray",
              }}
              key={y}
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

const SudokuSolverDomain = ({
  sudokuToSolve,
  strategy,
  showNotes,
  getNotes,
}: {
  sudokuToSolve: SudokuGrid
  strategy: (sudoku: SudokuGrid) => SudokuGrid[]
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
    // Easy hack to wait for the next render cycle.
    setTimeout(() => {
      setIterations(0)
      setHistory([])
      setSudoku(sudokuToSolve)
      setStack([sudokuToSolve])
    })
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
        const newSudokus = strategy(current)
        setIterations(iterations + 1)
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
      <div className="block sm:flex justify-between">
        <div className="sm:pr-4">
          <div className="flex gap-2">
            <button
              className="w-24 py-2 px-4 bg-orange-200 text-black border border-black rounded-md hover:bg-orange-300"
              onClick={() => {
                setRunning(!running)
              }}
            >
              {running ? "Pause" : "Solve"}
            </button>
            <button
              className="py-2 px-4 bg-slate-200 text-black border border-black rounded-md hover:bg-red-600"
              onClick={reset}
            >
              {"Reset"}
            </button>
            <button
              className="py-2 px-4 bg-slate-200 text-black border border-black rounded-md hover:bg-slate-300"
              onClick={() => {
                step(0)
              }}
            >
              {"Step"}
            </button>
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="timeout">
              Time between each step (ms)
            </label>
            <input
              className="w-20 border border-black rounded-md p-1"
              min={1}
              id="timout"
              max={1000}
              value={timeoutValue}
              onChange={(e) =>
                setTimeoutValue(
                  e.target.value !== "" ? parseInt(e.target.value) : 0,
                )
              }
            />
          </div>
          <div className="mt-4">
            <div>Iterations: {iterations}</div>
            <div>Stack size: {stack.length}</div>
          </div>
        </div>
        <div className="flex-shrink-0 mt-4 sm:mt-0 -mx-4 sm:mx-0 flex justify-center">
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
    </div>
  )
}

const SudokuApplet = ({
  strategy,
  showNotes,
  getNotes,
}: {
  strategy: (sudoku: SudokuGrid) => SudokuGrid[]
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
      name: "Hard sudoku",
      sudoku: SUDOKU_HARD,
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
      <div className="flex gap-2 flex-col md:flex-row border-black border-2 p-2">
        {SUDOKUS.map((s, i) => {
          return (
            <button
              key={s.name}
              className={clsx("py-2 px-4 text-sm hover:cursor-pointer", {
                "bg-black text-white": s.name === selection,
                "bg-transparent text-black": s.name !== selection,
              })}
              onClick={() => setSelection(s.name)}
            >
              {s.name}
            </button>
          )
        })}
      </div>
      <div className="mt-8">
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

const EMPTY_SUDOKU = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const SudokuGenerator = ({
  strategy,
}: {
  strategy: (sudoku: SudokuGrid) => SudokuGrid[]
}) => {
  const [seed, setSeed] = useState(0)
  const [iterationGoal, setIterationGoal] = useState(50)
  const [timeoutTime, setTimeoutTime] = useState(10)
  const [unique, setUnique] = useState(false)
  const [solvedSudoku, setSolvedSudoku] = useState<{
    solvedSudoku: SudokuGrid | null
    iterations: number
  } | null>(null)
  const [maxReached, setMaxReached] = useState(false)

  const solveSudoku = useCallback(
    (sudoku: SudokuGrid) => {
      return dfsLoop([sudoku], strategy, 0)
    },
    [strategy],
  )

  const RELATIVE_DRIFT = 20
  const ABSOLUTE_DRIFT = 3

  const randomFn = useMemo(() => {
    return createSeededRandom(seed)
  }, [seed])

  const [stack, setStack] = useState<SudokuGrid[]>([cloneSudoku(EMPTY_SUDOKU)])
  const step = (sudoku: SudokuGrid, randomFn: () => number): SudokuGrid[] => {
    const domainSudoku = toDomainSudoku(sudoku)
    const { sudoku: newSudoku, iterations, solvable } = ac3(domainSudoku)
    if (!solvable) {
      return []
    }

    const simpleSudoku = toSimpleSudoku(newSudoku)
    if (isSudokuFilled(simpleSudoku) && isSudokuValid(simpleSudoku)) {
      return [simpleSudoku]
    }

    const emptyCellCoordinates: [number, number][] = []
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newSudoku[i][j].length > 1) {
          emptyCellCoordinates.push([i, j])
        }
      }
    }

    const sampleXY = sample(emptyCellCoordinates, randomFn)
    const [x, y] = sampleXY
    const possibleNumbers = shuffle(newSudoku[x][y], randomFn)
    const newSudokus = possibleNumbers.map((n) => {
      const sudokuCopy = cloneSudoku(sudoku)
      sudokuCopy[x][y] = n
      return sudokuCopy
    })

    return newSudokus
  }

  const validIterations = useCallback(
    (cost: number): boolean => {
      const rateIterationsRelative = (cost: number): number => {
        if (cost === Infinity) {
          return cost
        }
        return Math.abs(cost / iterationGoal - 1) * 100
      }

      const rateCostsAbsolute = (cost: number): number => {
        return Math.abs(cost - iterationGoal)
      }

      return (
        rateIterationsRelative(cost) < RELATIVE_DRIFT ||
        rateCostsAbsolute(cost) < ABSOLUTE_DRIFT
      )
    },
    [iterationGoal],
  )

  const nearToTheDifficultyStep = (sudoku: SudokuGrid): SudokuGrid => {
    let { iterations: currentIterations } = solveSudoku(sudoku)
    let newSudoku: SudokuGrid = []
    // Too difficult, make it easier.
    if (currentIterations > iterationGoal) {
      console.log("Too difficult, make it easier.")
      newSudoku = simplifySudoku(sudoku, randomFn)
    }
    // Too easy, make it more difficult.
    if (currentIterations < iterationGoal) {
      console.log("Too easy, make it more difficult.")
      newSudoku = increaseDifficultyOfSudoku(sudoku, randomFn)
    }

    return newSudoku
  }

  const reset = useCallback(() => {
    setStack([cloneSudoku(EMPTY_SUDOKU)])
    setSolvedSudoku(null)
    setUnique(false)
    setMaxReached(false)
  }, [setStack, setSolvedSudoku, setUnique])

  const sudoku = stack[0]

  const getNotes = (sudoku: SudokuGrid): DomainSudoku => {
    const domainSudoku = toDomainSudoku(sudoku)
    const { sudoku: reducedDomainSudoku } = ac3(domainSudoku)
    return reducedDomainSudoku
  }

  const uniqueAndSolved =
    solvedSudoku !== null && solvedSudoku.solvedSudoku !== null && unique

  return (
    <div>
      <div className="block sm:flex justify-between">
        <div className="pr-4">
          <div className="grid gap-2">
            <ol className="ml-4 pl-4 list-outside list-decimal">
              <li className="mb-4">
                <div className="mb-2">
                  Find a sudoku that is solvable and unique:
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={uniqueAndSolved}
                    className="py-2 px-4 bg-orange-200 border border-black text-black rounded-md hover:bg-orange-300 disabled:bg-gray-500"
                    onClick={async () => {
                      let localStack = stack
                      let localUniqueAndSolved = false
                      while (true) {
                        const [sudoku, ...rest] = localStack
                        const solvedSudoku = solveSudoku(sudoku)
                        localUniqueAndSolved =
                          checkForUniqueness(sudoku, sudokuSolverMRV) &&
                          solvedSudoku.solvedSudoku !== null
                        if (localUniqueAndSolved) {
                          setUnique(true)
                          break
                        }
                        const newStack = step(sudoku, randomFn)
                        localStack = [...newStack, ...rest]
                        setSolvedSudoku(solvedSudoku)
                        setStack(localStack)
                        await new Promise((resolve) =>
                          setTimeout(resolve, timeoutTime),
                        )
                      }
                    }}
                  >
                    {uniqueAndSolved ? "Solve (done)" : "Solve"}
                  </button>
                  <button
                    className="py-2 px-4 bg-orange-200 border border-black text-black rounded-md hover:bg-orange-300"
                    onClick={reset}
                  >
                    {"Reset"}
                  </button>
                  <button
                    disabled={uniqueAndSolved}
                    className="py-2 px-4 bg-orange-200 border border-black text-black rounded-md hover:bg-orange-300 disabled:bg-gray-500"
                    onClick={() => {
                      if (stack.length === 0) {
                        return
                      }
                      const [sudoku, ...rest] = stack
                      const newStack = step(sudoku, randomFn)
                      setStack([...newStack, ...rest])
                    }}
                  >
                    {uniqueAndSolved ? "Step (done)" : "Step"}
                  </button>
                </div>
              </li>
              <li className="">
                <div className="mb-2">
                  <div>
                    {"Decrease / increase difficulty as much as possible. "}
                  </div>
                  {!uniqueAndSolved && (
                    <span className="text-gray-500">
                      {"Disabled: Sudoku is not unique and solvable yet."}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={!uniqueAndSolved}
                    className="py-2 px-4 bg-slate-200 text-black border border-black  rounded-md hover:bg-slate-300 hover:cursor-pointer"
                    onClick={async () => {
                      let sudoku = stack[0]
                      while (true) {
                        const newSudoku = nearToTheDifficultyStep(sudoku)

                        const { solvedSudoku, iterations: newIterations } =
                          solveSudoku(newSudoku)
                        if (validIterations(newIterations)) {
                          console.log("Reached goal")
                          setMaxReached(true)
                          break
                        }

                        if (sudoku === newSudoku) {
                          setMaxReached(true)
                          console.log(
                            "Reached maximum simplicity / difficulty with this sudoku.",
                          )
                          break
                        }

                        sudoku = newSudoku
                        setStack([newSudoku])
                        setSolvedSudoku({
                          solvedSudoku,
                          iterations: newIterations,
                        })
                        console.log("New iterations", newIterations)
                        await new Promise((resolve) =>
                          setTimeout(resolve, timeoutTime),
                        )
                      }
                    }}
                  >
                    {maxReached ? "Solve (done)" : "Solve"}
                  </button>
                  <button
                    disabled={!uniqueAndSolved}
                    className="py-2 px-4 bg-slate-200 border border-black rounded-md hover:bg-slate-300 hover:cursor-pointer"
                    onClick={() => {
                      const newSudoku = nearToTheDifficultyStep(sudoku)

                      const { solvedSudoku, iterations: newIterations } =
                        solveSudoku(newSudoku)
                      if (validIterations(newIterations)) {
                        console.log("Reached goal")
                        setMaxReached(true)
                      }

                      if (sudoku === newSudoku) {
                        setMaxReached(true)
                        console.log(
                          "Reached maximum simplicity / difficulty with this sudoku.",
                        )
                      }

                      setStack([newSudoku])
                      setSolvedSudoku({
                        solvedSudoku,
                        iterations: newIterations,
                      })
                    }}
                  >
                    {maxReached ? "Step (done)" : "Step"}
                  </button>
                </div>
              </li>
            </ol>
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="timeout">
              Seed
            </label>
            <input
              className="w-20 border border-black rounded-md p-1"
              min={1}
              id="seed"
              max={1000}
              value={seed}
              onChange={(e) =>
                setSeed(e.target.value !== "" ? parseInt(e.target.value) : 0)
              }
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="timeout">
              Iteration goal (difficulty)
            </label>
            <input
              className="w-20 border border-black rounded-md p-1"
              min={1}
              id="iterationGoal"
              max={1000}
              value={iterationGoal}
              onChange={(e) =>
                setIterationGoal(
                  e.target.value !== "" ? parseInt(e.target.value) : 0,
                )
              }
            />
          </div>
          <div className="mt-4">
            <div>
              Solvable:{" "}
              {solvedSudoku !== null
                ? `Yes (${solvedSudoku.iterations} iterations)`
                : "No"}
            </div>
            <div>Unique: {unique ? "Yes" : "No"}</div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <SudokuPreview sudoku={sudoku} size={300} notes={getNotes(sudoku)} />
        </div>
      </div>
    </div>
  )
}

const Hashcode: NextPage = () => {
  return (
    <Container activeId="blog">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <BlogContent metadata={metadata}>
        <p>
          Once upon a time I decided to create a complete sudoku application as
          my grandma wanted to play some sudokus on her computer and I wasn't
          satisfied with the free offers available. The project went on for some
          years and finally lead to{" "}
          <a href="https://sudoku.tn1ck.com">sudoku.tn1ck.com</a>. While working
          on it, I went down the rabbit hole of generating sudokus of a
          specified "human perceived" difficulty and created accidentally a
          quite thorough analysis of it.
        </p>
        <h2>Creating a sudoku solver</h2>
        {/* While writing a Sudoku Solver is a
          fun challenge for every CS graduate or politicians, as{" "}
          <a href="https://www.bbc.com/news/technology-32591984">
            Singapurs prime minister famously wrote one in C++
          </a>
          . */}
        <p>
          First things first, to generate a sudoku, we first have to solve one.
          The solver plays an integral part into the generation part as we will
          use the iterations it needed to solve a sudoku to measure the
          difficulty.
        </p>
        <p>
          We will explore multiple algorithms and benchmark them against each
          other in how well we can use them to measure the difficulty of a
          sudoku. We start with the most basic brute force algorithm and end up
          with the final one, based on seeing the sudoku as a Constraint
          Satisfaction Problem (short CSP). We use a depth first search (short
          DFS) for all our different strategies here, we abstract this by the
          following function. We make it sudoku specific instead of completely
          generic for ease of use.
          <Footnote>
            Footnote: Adding caching to prevent calculating the same branch
            multiple times as well as making it stack based instead of recursive
            (JavaScript sadly has no tail call optimization) is left as an
            exercise for the reader.
          </Footnote>
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
        <div className="mt-8">
          <Card title="Brute force version">
            <div className="mb-8">
              This is the most simple strategy to solve the sudoku: We find an
              empty spot and fill in a number between 1 - 9. We don’t do
              anything else. This is horribly slow, do not try this at home.
            </div>
            <SudokuApplet showNotes={false} strategy={bruteForceStrategy} />
            <div className="mt-4">
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
            </div>
          </Card>
        </div>
        <div>
          <Card title="Skip on invalid sudokus">
            <div className="mb-8">
              The simplest and most substantial change we can do, is not not
              waiting until the whole Sudoku is filled, but skipping on the
              Sudokus that are already invalid. This solver will solve even the
              hardest sudokus in adequate time, but it still wastes a lot of
              cycles as it is not choosing the cell to fill with a value with
              any strategy.
            </div>
            <SudokuApplet showNotes={false} strategy={withValidCheckStrategy} />
            <div className="mt-4">
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
            </div>
          </Card>
        </div>
        <Card title="Minimum remaining value">
          <div className="mb-8">
            "Minimum remaining value" is a heuristic we can use to not search
            blindly, but to select the cell next with the least amount of
            possibilities. This is something a human would do as well - fill or
            work on the cells with least options. This greatly reduces the
            number of iterations needed for the difficult sudoku. This algorithm
            is pretty solid now as it can solve even the hardest sudokus in the
            millisecond range.
          </div>
          <SudokuApplet
            showNotes={false}
            strategy={minimumRemainingValueStrategy}
          />
          <div className="mt-4">
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
          </div>
        </Card>
        <Card title={"Arc Consistency"}>
          <div className="-scroll-mb-80">
            We now embark on a different way to solve the sudoku, namely framing
            it as a Constraint Satisfaction Problem to solve it and then use Arc
            Consistency to simplify the problem. A quick primer on some computer
            science terms.
          </div>
          <ul className="blog">
            <li>
              <strong>Domain</strong> - A domain is the set of possible values
              for a variable. For a sudoku, this is the numbers 1 - 9.
            </li>
            <li>
              <strong>CSP</strong> - A constraint satisfaction problem (CSP) is
              a problem defined by a set of variables, a set of domains, and a
              set of constraints. The goal is to assign a value to each variable
              such that the constraints are satisfied. For a sudoku, the
              variables are the cells, the domains are the numbers 1 - 9 and the
              constraints are that every row, column and square has to have
              unique numbers.
            </li>
            <li>
              <strong>Arc consistency</strong> - A variable is arc-consistent
              with another variable if every value in the domain of the first
              variable has a possible value in the domain of the second variable
              that satisfies the constraint between the two variables.
              <br />
              In the sudoku example, if we have two cells in the same row, one
              with the domain [1, 2, 3] and the other with the domain [2], this
              is not arc consistent as 2 is in the domain of the first cell. If
              we remove the 2 from the domain of the first cell, it becomes arc
              consistent.
            </li>
            <li>
              <strong>AC3</strong> - The AC3 algorithm is an algorithm to create
              arc consistency. The main difference from the complete naive way
              to achieve arc consistency is that we do not loop over all
              constraints again when a domain of a variable changes, but only
              the relevant variables that have a constraint with it (in sudoku
              the cells in the same row / column / square).
            </li>
          </ul>
          <p>
            For every cell in the sudoku, we keep track of its possible values.
            We reduce the possible values for every cell by checking the sudoku
            constraints e.g. remove the numbers that are already have a value in
            the same row / column / square. We do this as long until no domain
            is changing anymore. This "reduction of domains using the
            constraints" is arc consistency.
          </p>

          <p>
            For very simple sudokus, this is already enough to solve one (see
            the applet below), for harder ones, we are left with multiple
            options for every unfilled cell. This means we have to employ a
            search again. We use then the "Minimum remaining value" strategy
            again to select the cell with the least options and create a new
            versions of the sudoku with that cell filled with the possible
            values. This is called "domain splitting" in fancy computer science
            terms. We again count the number of iterations needed to solve the
            sudoku.
          </p>
          <p>
            The applet shows the domains of the applied ac3 algorithm in
            unfilled cells. If a sudoku can not be solved, one domain will
            become empty, which is shown as red, then the algorithm will
            backtrack.
          </p>
          <SudokuApplet
            showNotes={true}
            strategy={AC3Strategy}
            getNotes={(sudoku: SudokuGrid) => {
              return ac3(toDomainSudoku(sudoku)).sudoku
            }}
          />
          <div className="mt-4">
            <Accordion title="Code of the Arc consistency strategy">
              <CodeBlock language="typescript">{`// We track the possible values (its domain) for each cell.
export type DomainSudoku = number[][][]

// AC3 algorithm. Returns the reduced domain sudoku and if it is solvable.
export function ac3(sudoku: DomainSudoku): {
  sudoku: DomainSudoku
  solvable: boolean
  iterations: number
} {
  sudoku = sudoku.map((r) => r.map((c) => c.slice()))

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
  // If the domain of a cell changed during this, we put it back into the queue.
  // We use a unique list instead of a set to keep it deterministic.
  let coordinatesQueue: [number, number][] = []
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      coordinatesQueue.push([x, y])
    }
  }

  while (coordinatesQueue.length > 0) {
    let change = false
    const [x, y] = coordinatesQueue.shift()!
    let domain1 = sudoku[y][x]

    // The coordinates of the cells that have a constraint with the
    // the current cell.
    const constraintCoordinates: [number, number][] = []
    // Cells in the same row.
    for (let xx = 0; xx < 9; xx++) {
      if (xx === x) {
        continue
      }
      constraintCoordinates.push([y, xx])
    }

    // Cells in the same column.
    for (let yy = 0; yy < 9; yy++) {
      if (yy === y) {
        continue
      }
      constraintCoordinates.push([yy, x])
    }

    // Cells in the same square.
    const square = SQUARE_TABLE[squareIndex(x, y)]
    for (let c = 0; c < 9; c++) {
      const s = square[c]
      const [xx, yy] = s
      if (xx === x && yy === y) {
        continue
      }
      constraintCoordinates.push([yy, xx])
    }

    for (const [yy, xx] of constraintCoordinates) {
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
      return { sudoku, solvable: false, iterations: 1 }
    }

    // As the domain changed, we put the cell back into the list of cells that need
    // to be checked.
    if (change) {
      // If the domain of the cell changed, put it and its constraints
      // back into the queue.
      coordinatesQueue.push([x, y])
      coordinatesQueue = uniq([...coordinatesQueue, ...constraintCoordinates])
    }
  }

  return { sudoku, solvable: true, iterations: 1 }
}

// Solve the sudoku by using a constraint using ac3 and minimum remaining value.
export function AC3Strategy(sudoku: SudokuGrid): SudokuGrid[] {
  const domainSudoku = toDomainSudoku(sudoku)
  const {
    solvable,
    sudoku: reducedDomainSudoku,
    iterations,
  } = ac3(domainSudoku)
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
  // This is called "Domain splitting" in computer science.
  const [rowIndex, cellIndex] = sortedPossibleRowAndCells[0]
  const cell = reducedDomainSudoku[rowIndex][cellIndex]
  const newSudokus = cell.map((n) => {
    const sudokuCopy = simpleSudoku.map((r) => r.slice())
    sudokuCopy[rowIndex][cellIndex] = n

    return sudokuCopy as SudokuGrid
  })

  return newSudokus
}
`}</CodeBlock>
            </Accordion>
          </div>
        </Card>
        <h3>Rating the difficulty of sudokus</h3>
        <p>
          The main problem that one faces when generating a sudoku is to assign
          the difficulty rating for a human solver. As we don’t want to manually
          verify every Sudoku we generate, we need an automatic way for us to
          group a newly generated Sudoku according to its difficulty. All our
          sudoku solvers yield an iteration count, which we will use as our cost
          function. I'm relying here on the paper "Rating and generating Sudoku
          puzzles based on constraint satisfaction problems." by Fatemi, Bahare,
          Seyed Mehran Kazemi, and Nazanin Mehrasa.
          <Footnote>
            FATEMI, Bahare; KAZEMI, Seyed Mehran; MEHRASA, Nazanin. Rating and
            generating Sudoku puzzles based on constraint satisfaction problems.
            International Journal of Computer and Information Engineering, 2014,
            8. Jg., Nr. 10, S. 1816-1821.{" "}
            <a href="https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=fc78d54ae5d5234c9fb229d6a2cd2ef5af181e70">
              PDF
            </a>
          </Footnote>
          <br />
          In the paper, they download sudokus of each difficulty section from
          websudoku.com, solve them by <s> students</s> volunteers and then run
          their algorithm on it. They then took the average of each category and
          so they got an iteration to difficulty mapping.
        </p>
        <p>
          We will do basically the same, but actually publishing the data and
          also trying out how the "lesser" strategies work here for rating the
          difficulty. I fetched 100 sudokus from websudoku.com (easy, medium,
          hard, evil) for each of its difficulty classes as well as from
          sudoku.com (easy, medium, hard, expert, master, extreme).
        </p>

        <h3>How well do the solver measure human difficulty?</h3>
        <p>
          I'm not a data scientist, so take this analysis with a grain of salt
          and I'm happy for any comments / proposals on how to improve it. As I
          don't have comments here yet, you can open an issue at{" "}
          <a target="_blank" href="https://github.com/TN1ck/sudoku-analysis">
            the GitHub repository of this analysis
          </a>{" "}
          instead.
        </p>
        <p>
          This is the raw data on how many iterations each solver took to solve
          the sudokus. You can also execute it yourself{" "}
          <Link href="/apps/benchmark-sudokus">here </Link> or look at the
          source{" "}
          <a href="https://github.com/TN1ck/tn1ck.com/blob/main/pages/apps/benchmark-sudokus.tsx">
            at GitHub
          </a>
          . I skipped the most simple brute force, as it would take ages to
          compute for even medium difficult sudokus.
        </p>
        <p>
          <strong>
            For all the charts I used the logarithm on the iterations as
            especially the qq plot made it very obvious that the iterations
            count is exponential to the difficulty.
          </strong>{" "}
          Which is not surprising as solving Sudokus is famously NP hard. Any
          currently known algorithms to solve an NP hard problem takes
          exponential time.
        </p>
        <Card title={"Histograms"}>
          <div className="mb-4">
            First let's draw a histogram of each strategy and each dataset to
            get an idea of the distribution. From that we can see that they seem
            to be more or less normally distributed (with the applied
            logarithm), especially the brute force algorithm.
            <br />
            Both the minimum remaining value and arc consistency algorithm look
            the same, but only for the more difficult levels as for the easy
            ones, they always need the same number of iterations.
          </div>
          <TabComponent
            tabs={dataAnalysis.map((d) => d.name)}
            content={dataAnalysis.map((d) => (
              <img className="mt-4" key={d.name} src={d.histogram} />
            ))}
          />
        </Card>

        <Card title={"QQ plots"}>
          <div className="mb-4">
            Then we look at the QQ plots for each strategy/source/level
            combination. QQ plots are super cool to get an intuitive
            understanding on how the values are distributed. A perfect normal
            distribution would be a straight line. These lines also look pretty
            straight, but only because we used the logarithm on the iterations
            count already. For the minimum remaining value and Arc consistency,
            the lower difficulty levels look much less like a straight line, but
            the higher difficulty levels look very much like it. This is
            explained with their very low iteration count for the easy sudokus.
          </div>

          <TabComponent
            tabs={dataAnalysis.map((d) => d.name)}
            content={dataAnalysis.map((d) => (
              <img className="mt-4" key={d.name} src={d.qqPlot} />
            ))}
          />
        </Card>

        <Card title="Correlation">
          <div className="mb-4">
            We can already see that these graphs all look somewhat alike, even
            the second most basic brute force looks decently similar to our
            fancy CSP algorithm. But do the numbers agree? How much do the
            iterations correlate with the level?
          </div>
          <TabComponent
            tabs={dataAnalysis.map((d) => d.name)}
            content={dataAnalysis.map((d) => (
              <img className="mt-4" key={d.name} src={d.correlation} />
            ))}
          />

          <p>
            As we can see, they all correlate almost perfectly with the brute
            having a perfect 1.0 correlation, making it highly likely that the
            websites use the iteration count as well for their Level
            determination - and this makes the whole analysis problematic, as we
            still don't know if this is actually a good difficulty indicator for
            how a human perceives the difficulty. Actually solving sudokus by a
            human and rating them by the time to get a ground truth is left as
            an exercise by the reader (Sorry I'm not paid for this.)
          </p>
        </Card>

        <Card title="Generating a Sudoku with a specific difficulty">
          <div>
            To now generate a sudoku of a specific difficulty, we do the
            following:
          </div>
          <ol className="blog">
            <li>
              Start with an empty grid and fill it with random numbers until it
              is a valid (and unique sudoku). We backtrack when the added number
              will lead to a non solvable sudoku. Note: The uniqueness
              constraint comes automatically as we continue to fill the sudoku
              with numbers. Instead of stopping when it is unique, we could also
              stop when it is fully filled, but that wouldn't be helpful as we
              would have to delete numbers again in the next step.
            </li>
            <li>
              To generate a sudoku of a wanted difficulty, we either remove
              numbers or add numbers until the reached difficulty is reached.
            </li>
            <li>
              If we cannot delete any more numbers without making it non unique,
              meaning we reached max difficulty, but the difficulty is below the
              requested one, start at 1. again. Note: We could also backtrack or
              add numbers again, but for my personal use I found it better to
              save the sudoku with the maximum achieved difficulty and start
              over, but by adding and removing numbers, one could theoretically
              reach the requested difficulty.
            </li>
            <li>
              If the call count is close to the requested value, return the
              sudoku.
            </li>
          </ol>
          <p>
            As 3. points out, generating very difficult sudokus can take quite
            some time as any generation method will struggle with the uniqueness
            constraint and has to randomly alter the sudoku generation steps.
            Here is an applet for you to interactively run the sudoku. The code
            is not crazy optimized and we do have to do some heavy calculations,{" "}
            <strong>
              so be wary that your browser might freeze for a bit if you click
              solve
            </strong>
            .
          </p>

          <SudokuGenerator strategy={AC3Strategy} />
        </Card>

        <h3 id="criticism">Generation algorithm as described by the paper</h3>
        <p>
          As mentioned above, the algorithm described in the paper has some
          issues, which in effect make it <strong>very</strong> slow albeit
          still valid. Here is how they describe the algorithm:
        </p>
        <blockquote>
          "We use hill climbing to generate new puzzles having a call count
          close to the call count we need. In this method, first of all, we
          generate an initial puzzle with some random numbers inside it and
          calculate its cost function. Then in each iteration, we randomly
          change one element of this solution by adding, deleting, or changing a
          single number and calculate the cost function again.
          <br />
          After this, we check the new value of the cost function for this new
          puzzle and compare it to the previous one. If the cost is reduced, we
          accept the second puzzle as the new solution and otherwise we undo the
          change. We do this process until meeting the stopping criterion.
          <br />
          The cost function for a given puzzle is infinity for puzzles with none
          or more than one solutions. For other puzzles, the cost is the
          absolute value of the current puzzle’s call count minus the average
          call count of the given difficulty level. For example if we want to
          generate an easy puzzle and we want to consider the values
          demonstrated in Table I, then the cost function for a puzzle having a
          unique solution is the absolute value of its call count minus
          6.234043.
          <br />
          We stop the algorithm when we have puzzles with costs close to zero.
          Depending on the level of accuracy we need and the number of
          difficulty levels we have, we can define the closeness of the cost
          function to zero."
        </blockquote>
        <p>
          When I first read it, I thought "we generate an initial puzzle with
          some random numbers inside it" would mean that I could literally start
          with a Sudoku grid and put random numbers in it.
          <br />
          But one needs an already valid sudoku as else the hill climbing will
          not work as the cost function for an invalid configuration should
          return infinite. While theoretically it still works, it takes far too
          long to stumble upon a valid configuration like this.
        </p>
        <p>
          I’m not entirely sure if they meant to start with a valid Sudoku, but
          "initial puzzle with some random numbers" does not sound like it.
          Furthermore, "just adding, deleting or changing a single number" is
          not efficient, as again they, this can lead to an invalid
          configuration quickly, albeit the hill climbing will now be a bit
          faster, although we can easily guide the algorithm more here.
        </p>
        <p>
          I find my algorithm to be more efficient and elegant as it is guided
          by the sudokus constraints, namely we first create a solvable and
          unique sudoku, making the hill climbing afterwards easier as our cost
          function will not return infinity. Their algorithm will spend most of
          their time trying to stumble upon a valid sudoku.
        </p>
      </BlogContent>
    </Container>
  )
}

export default Hashcode
