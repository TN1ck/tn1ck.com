import { NextPage } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"

export const METADATA = {
  title: "How to generate Sudokus & rate their difficulties",
  date: "2024-04-27",
  slug: "how-to-generate-sudokus",
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
          issues which I address <a href="#criticism">below</a>). The paper
          proposes to formulate the Sudoku puzzle as a Constraint Satisfaction
          Problem, short CSP and solve it by using the techniques "arc
          consistency" and "domain splitting". They count the times "arc
          consistency" is called and use that as a proxy for difficulty. To know
          the appropriate values for each difficulty level, they manually solve
          Sudokus and give them a difficulty rating to then count how many calls
          each difficulty group took on average. The paper closes by showing
          that their generated Sudokus are rated by humans with the desired
          difficulty class, at least on average.
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
