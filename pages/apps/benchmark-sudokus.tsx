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

const BenchmarkSudokus = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<BenchmarkResult[]>([])

  return (
    <div>
      <button
        onClick={async () => {
          setLoading(true)
          const results = await runBenchmarks()
          setResults(results)
          setLoading(false)
        }}
      >
        {loading ? "Running..." : "Start Benchmark"}
      </button>
      <button
        disabled={loading || results.length === 0}
        onClick={() => {
          const csv = resultsToCsv(results)
          downloadCSV(csv, "benchmark_results.csv")
        }}
      >
        {"Download results"}
      </button>
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
