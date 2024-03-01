import { NextPage } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"

export const METADATA = {
  title: "Place 101 at Hashcode 2017",
  date: "2017-03-16",
  slug: "hashcode",
}

const Hashcode: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent>
        <h1>{METADATA.title}</h1>
        <Author date={METADATA.date} />
        <p>
          Hashcode is an international programming competition where teams with
          a maximum number of 4 people have to solve a complex problem in under
          4 hours. We reached place 101 in the 2017 competition, this is a short
          summary of our experience.
        </p>
        <p>
          A friend of mine wrote me if I know this google Competition that would
          take place in some weeks and send me a link with it:{" "}
          <a href="https://hashcode.withgoogle.com/">
            https://hashcode.withgoogle.com/
          </a>
          . I didn’t, but was intrigued by it. Hashcode works by giving each
          team over the world at the same time access to a problem. Along with
          the problem are multitple input datasets. The task is to do find a
          solution for the given data and write the solution to an output file,
          which then can be uploaded to be scored. The better the solution, the
          higher the score. The 50 best teams are invited to Paris and a second
          round will take place.
        </p>
        <p>
          One can check the problems which were asked to be solved in the
          previous years, every problem had a similar structure:
        </p>
        <ol>
          <li>
            It’s always some kind of NP-hard problem were the given dataset is
            far too big to actually find the optimal solution
          </li>
          <li>
            The input datasets are really similar in the structure, a parser
            from a previous year can easily be used as a starting point
          </li>
          <li>Same with the output data format</li>
        </ol>
        <p>
          The biggest difficulty is actually to create a working solution in
          under 3 hours and 45 minutes. Ah yes, it also needs to be fast, the
          input sets are not that small.
        </p>
        <p>
          My group consisted of Marius Liwotto, Niklas Gebauer and Maximillian
          Bachl. We all studied computer science together and I can attest that
          they are wicked smart, so I was quite comfortable with the
          participation, I trust these guys. Because we don’t solve these kinds
          of problems often and we thought it’s a good idea to test how we can
          work together, we met up one day and tried to solve one of the
          previous years. We agreed on using python for this, because everyone
          of us was quite good in it and a scripting language can be written
          quickly. After 4 hours of intense group work, the problem was not
          fully solved - so a complete failure in the eyes of Hashcode, but we
          learned some important things during this test-phase.
        </p>
        <ul>
          <li>
            Everyone should make sure to have the same version of the
            programming language and working environment
          </li>
          <li>
            Don’t think so long about the problem, try to find a solution as
            quick as possible and iterate over the current solution.
          </li>
          <li>
            Have one person write the code and commit it. Merge conflicts etc
            are way worse than typing speed, it really helps though when
            multiple people look at the screen and validate the code.
          </li>
          <li>
            Think about the performance of the current solution, big datasets
            might not work.
          </li>
          <li>
            Create an outline of the data-structures you want to use, especially
            if you use indices or references etc. This is super important! We
            agreed on using python-classes, because we read this solution of a
            past problem afterwards and thought it looks pretty neat:{" "}
            <a href="https://github.com/flashcode/google-hashcode-2016">
              https://github.com/flashcode/google-hashcode-2016
            </a>
            .
          </li>
        </ul>
        <p>
          One of our group also solved the test problem that is released every
          year. Its main function is to give the groups a taste of what they
          should expect and to show how the submission / scoring / file
          uploading works. We used this solution to create a skeleton with an
          input-parser, output-writer and a basic main method.
        </p>
        <p>
          On the day of the competition, we all met up again. We coded at my
          place, because we also used it for the test and it worked quite well.
          We met one hour early and made sure everything is set up correct. One
          of us was actually remote participating, so we checked that speaking
          with him worked smoothly.
        </p>
        <p>
          When the countdown for the release of the problem was at 0, we just
          reloaded the page thinking it would appear there. But actually a new
          menu-entry is created. 30 seconds lost, damnit! :D
        </p>
        <p>
          Everyone read the problem quietly, after that we made an outline about
          the relationship of the data. You can probably find the problem at
          hashcode, if not{" "}
          <a href="https://fervent-noether-61cc4d.netlify.app/assets/documents/hashcode2017_streaming_videos.pdf">
            here is the document
          </a>
          . I started to code the input parser and the needed classes at the
          same time. My group colleagues were thinking about how to solve it.
          They quickly come up with a good method, we wanted to normalize the
          data, and sort the servers with some heuristic.
        </p>
        <p>
          We could work together really well, so much better as in the
          test-phase. We still thought to complex and when we were finished
          coding up the first solution, we noticed that for the biggest dataset,
          the code is far to slow. Only one hour was left at the moment, so we
          quickly searched for the culprit and found it, the server sorting
          heuristic was super slow. We commented it out and tried it out again.
          It was still super slow, but fast enough to get a solution for every
          dataset in under 20 minutes. At this point, we had no clue if our
          exporter or the solution did work at all, we only tested with the
          example. The moment a score appeared after we uploaded, we were super
          relieved. Our score was quite high! During the competition there is a
          dashboard were teams can see how good they currently are, it’s frozen
          though after 2:45 hours and our solution would have been place 43 on
          this!
        </p>
        <p>
          During the time we were still actively searching for
          performance-improvements, mostly adding a cache to some functions,
          which helped amazingly. The code actually improved so much in
          performance, that we could use our heuristic. Only 5 minutes before
          the competition was over, we could upload our solution with the
          applied heuristic…and it actually didn’t do so much. So in the end, we
          achieved place 101 and were all super happy about it, but no paris for
          us this year. But we again learned some important things, which we
          keep in mind for the next time:
        </p>
        <ul>
          <li>
            Try to implement a simple solution first and really think hard about
            your heuristic!
          </li>
          <li>
            Add caching! Maybe write a decorator beforehand to easily cache the
            results of functions.
          </li>
          <li>
            Use maybe a fast language to solve the problem. Performance is quite
            crucial in the end and something like Java/Cpp would have helped us
            probably there.
          </li>
        </ul>
        <p>
          Our group name was TU_Dudes and the code can be seen at{" "}
          <a href="https://github.com/TN1ck/hashcode-2017">
            https://github.com/TN1ck/hashcode-2017
          </a>
          . It’s quite the mess though, so be warned.
        </p>
      </BlogContent>
    </Container>
  )
}

export default Hashcode
