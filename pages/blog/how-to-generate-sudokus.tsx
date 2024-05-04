import { NextPage } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import { useCallback, useRef, useState } from "react"

export const METADATA = {
  title: "How to generate Sudokus & rate their difficulties",
  date: "2024-04-27",
  slug: "how-to-generate-sudokus",
}

type SudokuGrid = number[][]

const SUDOKU_1: SudokuGrid = [
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

const isSudokuFilled = (sudoku: SudokuGrid): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) return false
    }
  }
  return true
}

const isSudokuValid = (sudoku: SudokuGrid): boolean => {
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
const solveSudokuV1 = async (
  stack: SudokuGrid[],
  cb: (sudokus: SudokuGrid[]) => Promise<void>,
): Promise<SudokuGrid | null> => {
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
        return solveSudokuV1([...newSudokus, ...rest], cb)
      }
    }
  }

  return solveSudokuV1(rest, cb)
}

const solveSudokuV2 = async (
  stack: SudokuGrid[],
  cb: (sudokus: SudokuGrid[]) => Promise<void>,
): Promise<SudokuGrid | null> => {
  if (stack.length === 0) return null
  await cb(stack)

  const [sudoku, ...rest] = stack

  const isFilled = isSudokuFilled(sudoku)
  const isValid = isSudokuValid(sudoku)

  if (isFilled && isValid) return sudoku
  if (!isValid || isFilled) return solveSudokuV2(rest, cb)

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
        return solveSudokuV2([...newSudokus, ...rest], cb)
      }
    }
  }

  return solveSudokuV2(rest, cb)
}

const solveSudokuV3 = async (
  stack: SudokuGrid[],
  cb: (sudokus: SudokuGrid[]) => Promise<void>,
): Promise<SudokuGrid | null> => {
  if (stack.length === 0) return null
  await cb(stack)

  const [sudoku, ...rest] = stack

  const isFilled = isSudokuFilled(sudoku)
  const isValid = isSudokuValid(sudoku)

  if (isFilled && isValid) return sudoku
  if (!isValid || isFilled) return solveSudokuV3(rest, cb)

  const emptyCoordinates = []
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] === 0) {
        emptyCoordinates.push([i, j])
      }
    }
  }

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

  return solveSudokuV3([...newSudokus, ...rest], cb)
}

const SudokuPreview = ({
  sudoku,
  size,
}: {
  size: number
  sudoku: SudokuGrid
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
          const makeBold = [3, 6].includes(y)
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
          const makeBold = [3, 6].includes(x)
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
              return n !== 0 ? (
                <div
                  key={x}
                  style={{
                    position: "absolute",
                    left: xSection * (x + 0.5) + "%",
                    top: ySection * (y + 0.5) + "%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {n}
                </div>
              ) : null
            })}
          </div>
        )
      })}
    </div>
  )
}

const SudokuSolver = ({
  sudokuToSolve,
  solver,
}: {
  sudokuToSolve: SudokuGrid
  solver: (
    sudokus: SudokuGrid[],
    cb: (sudokus: SudokuGrid[]) => Promise<void>,
  ) => Promise<SudokuGrid | null>
}) => {
  const [sudoku, setSudoku] = useState<SudokuGrid>(sudokuToSolve)
  const [timeoutValue, setTimeoutValue] = useState<number>(0)
  const [iterations, setIterations] = useState<number>(0)
  const ref = useRef({
    cancel: false,
  })

  const callback = useCallback(
    async (sudokus: SudokuGrid[]): Promise<void> => {
      setIterations((i) => i + 1)
      if (ref.current.cancel) {
        console.log("CANCEL!")
        throw new Error("Cancelled")
      } else {
        console.log("Solved 1")
        setSudoku(sudokus[0])
        await new Promise<void>((resolve) => setTimeout(resolve, timeoutValue))
      }
    },
    [setSudoku, timeoutValue],
  )

  const solveSudokuLocal = useCallback(async () => {
    try {
      const result = await solver([sudokuToSolve], callback)
      if (result === null) {
        alert("No solution found")
      } else {
        console.log("Solved 2")
        setSudoku(result)
      }
    } catch {
      console.log("Cancelled")
      setSudoku(sudokuToSolve)
    }
  }, [setSudoku, solver, callback, sudokuToSolve])

  return (
    <div>
      <SudokuPreview sudoku={sudoku} size={300} />
      <button
        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={() => {
          ref.current.cancel = true
          setTimeout(() => {
            ref.current.cancel = false
            setIterations(0)
            setSudoku(sudokuToSolve)
            solveSudokuLocal()
          }, 100)
        }}
      >
        {"Solve"}
      </button>
      <button
        className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
        onClick={() => {
          ref.current.cancel = true
          setTimeout(() => {
            ref.current.cancel = false
            setSudoku(sudokuToSolve)
            setIterations(0)
          }, 100)
        }}
      >
        {"Cancel"}
      </button>
      <input
        className="w-20 border border-gray-300 rounded-md p-1"
        min={1}
        max={1000}
        value={timeoutValue}
        onChange={(e) => setTimeoutValue(parseInt(e.target.value))}
      />
      <div>Iterations: {iterations}</div>
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
          prime ministers, as{" "}
          <a href="https://www.bbc.com/news/technology-32591984">
            Singapurs prime minister famously wrote one in C++
          </a>
          . In this article we go a few steps beyond: Writing a program to
          generate Sudokus.
        </p>
        <p>
          The main problem that one faces when generating a sudoku is to assign
          the difficulty rating for a human solver. As we don't want to manually
          verify every Sudoku we generate, we need an automatic way for us to
          group a newly generated Sudoku according to its difficulty. The
          "standard" Sudoku solver one writes, uses the most of the time a depth
          first search to brute force the Sudoku. One could think that e.g. the
          number of iterations needed might be a valid metric for difficultyness
          here, but it is not when we simply try it out. I have a list of 200?
          Sudokus with already grouped difficulties, let's see how well the
          metric performs. TODO: Add cool algorithm TODO: Rate the difficulty.
        </p>
        <ul>
          <li>
            Fill the Sudoku grid with random numbers and empty fields, bias
            towards empty fields
          </li>
          <li>
            Remove any numbers that do not fulfil the Sudoku criteria. This is
            now a solveable Sudoku, but not a unique one.
          </li>
          <li>
            Make the Sudoku unique: As long the Sudoku is not unique, we can
            find an empty spot and fill it with two different numbers, we still
            find a solution. We improve the uniqueness by filling spots like
            this with a random choice of either number that lead still to a
            solution.
          </li>
          <li>We have a new Sudoku!</li>
        </ul>
        <p>
          At this point we already generated a new Sudoku, the only thing we can
          now is trying to adjust the difficulty. We can make it easier by
          filling some spots and make it harder by removing a number and have it
          still solvable (if possible). This step is only necessary if you aim
          for a certain difficulty grade. But this approach doesn't guarantee
          that every sudoku will abide to a certain difficulty.
        </p>
        <h3>Generating a Sudoku with a specific difficulties</h3>
        So we generated a Sudoku, but how can we programmitically find out how
        difficult it is to solve? We want a function, that given a Sudoku will
        return us a difficulty rating. I rely here on the paper "Rating and
        generating Sudoku puzzles based on constraint satisfaction problems." by
        Fatemi, Bahare, Seyed Mehran Kazemi, and Nazanin Mehrasa.{" "}
        <a href="#footnotes">
          <sup>1</sup>
        </a>
        <p>
          (They also describe a method for generation, but it has multiple
          issues which I address <a href="#criticism">below</a>). Their
          technique simplified is to count the number of times the algorithm has
          recursively descend and proxy that number to the difficulty. To know
          the appropriate values for each difficulty level, they manually solve
          Sudokus and give them a difficulty rating to then count how many calls
          each difficulty group took on average. The paper closes by showing
          that their generated Sudokus are rated by humans with the desired
          difficulty class, at least on average.
        </p>
        <p>
          Most sudoku solvers would be a terrible proxy for this though, as your
          standard depth-first brute force approach is not at all how a human
          solves a sudoku. The solver the paper proposes is in how it works,
          much closer to a human. It formulates sudoku as a Constraint
          Satisfaction Problems (short CSP) and uses Domain splitting and Arc
          consistency. Sudoku formulated as an CSP sees every cell as a variable
          where each variable can have any between 1 to 9, or mathematically
          defined, any value of the the set{" "}
          <code>{`{1, 2, 3, 4, 5, 6, 7, 8, 9}`}</code>, this set is also known
          as its <i>domain</i>. The constraints are then derived from the
          winning condition, no row, column or square can have any more than
          once. So how we do solve this CSP?
        </p>
        <p>
          We represent the Sudoku as an array of array of numbers, namely{" "}
          <code>type SudokuGrid = number[][]</code> (We'll use TypeScript for
          the code examples). To simplify this constrain check, we can create a
          function called `isSudokuSolved(sudoku: number[][])`. A depth first
          search based solver could now rely on this method to solve any sudoku:
        </p>
        <CodeBlock language="typescript">TODO</CodeBlock>
        <h3>Brute force version</h3>
        <SudokuSolver sudokuToSolve={SUDOKU_1} solver={solveSudokuV1} />
        <h3>A bit better</h3>
        <SudokuSolver sudokuToSolve={SUDOKU_1} solver={solveSudokuV2} />
        <h3>Minimum remaining value</h3>
        <SudokuSolver sudokuToSolve={SUDOKU_1} solver={solveSudokuV3} />
        <p>
          The first optimization we do is to use a technique called "Minimum
          remaining value". This is a heuristic we can use to not search
          blindly, but fill the least troublesome cells first. This is something
          a human would do as well - fill or work on the cells with least
          options.
        </p>
        <h3 id="criticism">Algorithm as described by the paper</h3>
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
          valid configuration like this. I'm not entirely sure if they meant to
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
