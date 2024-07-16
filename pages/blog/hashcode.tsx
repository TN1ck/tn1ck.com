import { NextPage, Metadata } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import Head from "next/head"

export const metadata = {
  title: "Place 101 at Hashcode 2017",
  description:
    "Hashcode is an international programming competition where teams, with a maximum of 4 people, have to solve a complex problem in under 4 hours. We reached place 101 in the 2017 competition; this is a short summary of our experience.",
  date: "2017-03-16",
  slug: "hashcode",
}

const Hashcode: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <p>
          Hashcode is an international programming competition where teams, with
          a maximum of 4 people, have to solve a complex problem in under 4
          hours. We reached place 101 in the 2017 competition; this is a short
          summary of our experience.
        </p>
        <p>
          A friend of mine asked me if I knew about this Google competition that
          would take place in a few weeks and sent me a link to it:{" "}
          <a href="https://hashcode.withgoogle.com/">
            https://hashcode.withgoogle.com/
          </a>
          . I didn’t, but was intrigued by it. Hashcode provides each team
          around the world simultaneous access to a problem, along with multiple
          input datasets. The task is to find a solution for the given data and
          write the solution to an output file, which can then be uploaded to be
          scored. The better the solution, the higher the score. The 50 best
          teams are invited to Paris for a second round.
        </p>
        <p>
          One can check the problems that were solved in the previous years;
          every problem had a similar structure:
        </p>
        <ol className="blog">
          <li>
            It’s always some kind of NP-hard problem where the given dataset is
            far too big to actually find the optimal solution.
          </li>
          <li>
            The input datasets are very similar in structure, so a parser from a
            previous year can easily be used as a starting point.
          </li>
          <li>Same with the output data format.</li>
        </ol>
        <p>
          The biggest difficulty is actually to create a working solution in
          under 3 hours and 45 minutes. And yes, it also needs to be fast, as
          the input sets are not small.
        </p>
        <p>
          My group consisted of Marius Liwotto, Niklas Gebauer, and Maximillian
          Bachl. We all studied computer science together, and I can attest that
          they are wicked smart, so I was quite comfortable with our
          participation; I trust these guys. Because we don’t solve these kinds
          of problems often and we thought it would be a good idea to test how
          we could work together, we met up one day and tried to solve one of
          the problems from the previous years. We agreed on using Python for
          this, because everyone of us was quite proficient in it and a
          scripting language can be written quickly. After 4 hours of intense
          group work, the problem was not fully solved - so a complete failure
          in the eyes of Hashcode, but we learned some important things during
          this test phase.
        </p>
        <ul className="blog">
          <li>
            Everyone should ensure they have the same version of the programming
            language and working environment.
          </li>
          <li>
            Don’t spend too long thinking about the problem; try to find a
            solution as quickly as possible and iterate on the current solution.
          </li>
          <li>
            Have one person write the code and commit it. Merge conflicts, etc.,
            are way worse than typing speed. It really helps, though, when
            multiple people look at the screen and validate the code.
          </li>
          <li>
            Think about the performance of the current solution; large datasets
            might not work.
          </li>
          <li>
            Create an outline of the data structures you want to use, especially
            if you use indices or references, etc. This is super important! We
            agreed on using Python classes, because we saw this solution for a
            past problem and thought it looked pretty neat:{" "}
            <a href="https://github.com/flashcode/google-hashcode-2016">
              https://github.com/flashcode/google-hashcode-2016
            </a>
            .
          </li>
        </ul>
        <p>
          One of our group members also solved the test problem that is released
          every year. Its main function is to give the groups a taste of what
          they should expect and to demonstrate how the submission, scoring, and
          file uploading works. We used this solution to create a skeleton with
          an input parser, output writer, and a basic main method.
        </p>
        <p>
          On the day of the competition, we all met up again. We coded at my
          place, because we also used it for the test, and it worked quite well.
          We met an hour early to make sure everything was set up correctly. One
          of us was participating remotely, so we checked that communicating
          with him worked smoothly.
        </p>
        <p>
          When the countdown for the release of the problem reached 0, we just
          reloaded the page thinking the problem would appear there. However, a
          new menu entry is created instead. Thirty seconds lost, darn it!
        </p>
        <p>
          Everyone read the problem quietly; afterward, we outlined the
          relationship of the data. The problem can probably be found on
          Hashcode; if not,{" "}
          <a target="_blank" href="/hashcode/hashcode2017_streaming_videos.pdf">
            here is the document
          </a>
          . I started coding the input parser and the necessary classes
          simultaneously. My colleagues were brainstorming the solution. They
          quickly came up with a good method; we wanted to normalize the data
          and sort the servers with some heuristic.
        </p>
        <p>
          We worked together really well, much better than in the test phase. We
          still thought too complexly, and when we finished coding the first
          solution, we noticed that for the biggest dataset, the code was far
          too slow. Only one hour was left at that moment, so we quickly
          searched for the culprit and found it; the server sorting heuristic
          was super slow. We commented it out and tried again. It was still
          slow, but fast enough to get a solution for every dataset in under 20
          minutes. At this point, we had no clue if our exporter or the solution
          worked at all, as we only tested with the example. The moment a score
          appeared after we uploaded, we were super relieved. Our score was
          quite high! During the competition, there is a dashboard where teams
          can see how well they are doing; it’s frozen, though, after 2:45
          hours. Our solution would have placed us at 43 at that point!
        </p>
        <p>
          While we were still actively searching for performance improvements,
          mostly by adding a cache to some functions, which helped amazingly.
          The code actually improved so much in performance that we could use
          our heuristic. Only 5 minutes before the competition was over, we
          uploaded our solution with the applied heuristic...and it didn’t
          change much. So in the end, we achieved place 101 and were all super
          happy about it, but no Paris for us this year. However, we again
          learned some important things, which we will keep in mind for next
          time:
        </p>
        <ul className="blog">
          <li>
            Try to implement a simple solution first and really think hard about
            your heuristic.
          </li>
          <li>
            Add caching! Maybe write a decorator beforehand to easily cache the
            results of functions.
          </li>
          <li>
            Consider using a fast language to solve the problem. Performance is
            quite crucial in the end, and something like Java/C++ would have
            probably helped us there.
          </li>
        </ul>
        <p>
          Our group name was TU_Dudes, and the code can be seen at{" "}
          <a href="https://github.com/TN1ck/hashcode-2017">
            https://github.com/TN1ck/hashcode-2017
          </a>
          . It’s quite the mess, though, so be warned.
        </p>
      </BlogContent>
    </Container>
  )
}

export default Hashcode
