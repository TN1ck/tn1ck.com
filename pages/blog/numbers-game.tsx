import { NextPage, Metadata } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import { Fragment, useState } from "react"

export const metadata: Metadata = {
  title: "Finding the optimal solution for the numbers game",
  description:
    "One of the games bored students play is the 'Numbers Game,' also known as 'Take Tens' or in German, 'Zahlenspiel.' I once implemented it and wrote a solver to find the minimum number of steps required to solve the game. Here is the solution.",
}

export const METADATA = {
  title: "Finding the optimal solution for the numbers game",
  date: "2017-10-31",
  slug: "numbers-game",
}

const MINIMAL_SOLUTION_STEPS = [
  [0, 9],
  [8, 17],
  [10, 11],
  [7, 12],
  [25, 26],
  [20, 29],
  [19, 21],
  [24, 27],
  [33, 42],
  [32, 34],
  [43, 44],
  [41, 45],
  [23, 50],
  [22, 28],
  [18, 30],
  [3, 39],
  [16, 31],
  [13, 40],
  [6, 14],
  [15, 35],
  [5, 36],
  [4, 37],
  [56, 65],
  [55, 57],
  [46, 64],
  [49, 51],
  [54, 58],
  [53, 59],
  [52, 60],
  [48, 61],
  [47, 62],
  [38, 63],
  [2, 66],
  [1, 67],
]

const StepsSlider = () => {
  const [step, setStep] = useState(0)

  return (
    <div>
      {/* Range input slider */}
      <div className="flex gap-4 mb-4">
        <div className="flex-shrink-0 mt-4 gap-2 flex">
          <button
            className="rounded-md px-4 py-2 bg-orange-200 hover:bg-orange-300 text-black border border-black"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
          >
            {"previous"}
          </button>
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === MINIMAL_SOLUTION_STEPS.length - 1}
            className="rounded-md px-4 py-2 bg-orange-200 hover:bg-orange-300 text-black border border-black"
          >
            {"next"}
          </button>
        </div>
        <div className="flex-grow">
          <label htmlFor="steps">{`Step ${step + 1}: ${MINIMAL_SOLUTION_STEPS[step].join(" & ")}`}</label>
          <input
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value))}
            className="w-full"
            type="range"
            min="0"
            max={MINIMAL_SOLUTION_STEPS.length - 1}
            step="1"
            list="steps"
          />
        </div>
      </div>
      <img
        src={
          "/numbers-game-solution/png_cropped/file_" +
          (step + 1) +
          "_resized.png"
        }
        alt={"Step " + step}
      />
    </div>
  )
}

const NumbersGame: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={METADATA}>
        <p>
          One of the games bored students play is the &quot;Numbers Game,&quot;
          also known as &quot;Take Tens&quot; or in German,
          &quot;Zahlenspiel.&quot; I once implemented it and wrote a solver to
          find the minimum number of steps required to solve the game. Here is
          the solution.
        </p>
        <p>
          The Numbers Game is a game you normally play with sheets of paper. You
          write the numbers from 1 to 19 next to each other:{" "}
          <code>1 2 3 4 5 6 7 8 9</code>. Afterwards, you write the numbers from
          11 to 19 below, but so that you have nine columns and three rows:{" "}
        </p>
        <code className="mt-2 block">
          1 2 3 4 5 6 7 8 9
          <br />
          1 1 1 2 1 3 1 4 1
          <br />5 1 6 1 7 1 8 1 9
        </code>

        <p>
          You are allowed to strike through numbers that are next to each other
          if they are the same or add up to 10. Diagonals are not allowed, but
          the left/right neighbor of the outermost numbers are considered the
          right/left outermost of the column before/after. Thus, the 9 in the
          first row could be struck with the left 1 in the second row. After
          there are no possibilities left, one must write all remaining numbers
          below. This repeats until no numbers are left. To get a feeling, go to
          the implementation and play around a bit; I mark the possible matches:{" "}
          <a href="http://tn1ck.github.io/numbers-game/">
            http://tn1ck.github.io/numbers-game/
          </a>
          .
        </p>

        <p>
          Three years ago, I wanted to learn React.js. The best way to learn a
          new library or framework is to build something with it. For me, this
          was the Numbers Game. Just head straight to{" "}
          <a href="http://tn1ck.github.io/numbers-game/">
            http://tn1ck.github.io/numbers-game/
          </a>
          , to play it.
        </p>

        <p>
          The game itself is really hard to finish but also strangely addictive.
          When I started, I actually thought that by changing the used numbers
          range (in the original, it is 1 to 9), I could vary the difficulty,
          but 1 to 9 seems to be the sweet spot. 1 to 8 is really easy to solve,
          and 1 to 10 is super hard.
        </p>

        <p>
          It’s frustrating to write a game that you haven’t solved yourself, and
          because I was curious about what the minimum number of steps would be,
          I wrote a backtracking solver.
        </p>

        <p>
          I’m a fan of Clojure, so the solver is also written in it. The source
          code can be found{" "}
          <a href="https://gist.github.com/TN1ck/ae36604c63673ffab275">here</a>.
          It’s not perfect, but it’s straightforward and works. There is one
          magic number there; I put 74 there to filter out every solution that
          was bigger than that. Why? Because I knew that this was a valid
          solution and as I was using a depth first search, it could have run
          forever. My approach was to repeatedly run the depth first search and
          always decrease the upper bound until it wouldn’t find another
          solution with that upper bound. A breadth-first search would have also
          worked, but I already had the depth-first search implemented.
        </p>

        <p>
          The code is old, and I just changed some things and commented here and
          there. I <em>should</em> rewrite it… but you know how it is, hard
          enough to find time to write this blog post. I will probably update
          the post then.
        </p>

        <p>
          Anyway! Let’s look at the solution. What is the minimum number of
          steps needed? You need <strong>34</strong> steps at minimum to solve
          this game. Here are the steps, to be read as match:{" "}
          <code className="highlighter-rouge">index1 & index2</code>. So the
          first step would be to match the 1 on the left in the first row with
          the 1 on the left in the second row.
        </p>
        <div>
          {MINIMAL_SOLUTION_STEPS.map((step, index) => {
            return (
              <Fragment key={index}>
                <span className="whitespace-nowrap">{`${step[0]} & ${step[1]}`}</span>
                {index < MINIMAL_SOLUTION_STEPS.length - 1 ? (
                  <span>{" → "}</span>
                ) : null}
              </Fragment>
            )
          })}
        </div>
        <p>Here it is, a bit nicer as an image sequence:</p>
        <StepsSlider />
        <p>
          It feels kind of awesome to solve the game with these steps, as you
          normally take quite a long time to solve it.
        </p>
      </BlogContent>
    </Container>
  )
}

export default NumbersGame
