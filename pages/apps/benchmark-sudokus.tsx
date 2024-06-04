import { NextPage } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { bin } from "d3"
import {
  BenchmarkResult,
  resultsToCsv,
  runBenchmarks,
} from "../../lib/sudoku/benchmark"
import { useState } from "react"
import { AC3Strategy as ac3Strategy } from "../../lib/sudoku/ac3"
import {
  withValidCheckStrategy as bruteForceWithValidCheckStrategy,
  minimumRemainingValueStrategy,
} from "../../lib/sudoku/sudokus"

export const METADATA = {
  title: "Benchmark sudokus",
  date: "2024-06-01",
  slug: "benchmark-sudokus",
}

const downloadCSV = (csvStringRaw: string, name: string) => {
  console.log(csvStringRaw, name)
  const link = document.createElement("a")

  link.href = URL.createObjectURL(
    new Blob([csvStringRaw], { type: "text/csv" }),
  )
  link.download = name
  link.click()
}

const STRATEGIES = [
  {
    identifier: "ac3",
    name: "Arc consistency",
    strategy: ac3Strategy,
  },
  {
    identifier: "bruteForceWithValidCheck",
    name: "Brute force with valid check",
    strategy: bruteForceWithValidCheckStrategy,
  },
  {
    identifier: "minimumRemainingValue",
    name: "Minimum Remaining Value",
    strategy: minimumRemainingValueStrategy,
  },
]

const BenchmarkSudokus = () => {
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState<string>(STRATEGIES[0].identifier)
  const currentStrategy = STRATEGIES.find((st) => st.identifier === strategy)!

  return (
    <div className="grid gap-4 mt-8">
      <div>
        <label className="block" htmlFor="strategy">
          The strategy to benchmark
        </label>
        <select
          className="border border-gray-300 px-4 py-2 rounded-md"
          id="strategy"
          name="strategy"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          {STRATEGIES.map((st) => {
            return (
              <option key={st.identifier} value={st.identifier}>
                {st.name}
              </option>
            )
          })}
        </select>
      </div>
      <div className="flex gap-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={async () => {
            setLoading(true)
            const result = await runBenchmarks(
              currentStrategy.identifier,
              currentStrategy.strategy,
            )
            const csv = resultsToCsv(result!)
            downloadCSV(csv, `benchmark_${result?.identifier}.csv`)
            setLoading(false)
          }}
        >
          {loading ? "Running..." : "Start Benchmark and download"}
        </button>
      </div>
    </div>
  )
}

const BenchmarkSudokusPage: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent>
        <h1>{METADATA.title}</h1>
        <Author date={METADATA.date} />
        <BenchmarkSudokus />
      </BlogContent>
    </Container>
  )
}

export default BenchmarkSudokusPage
