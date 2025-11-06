/* eslint-disable react/no-unescaped-entities */
import { NextPage, Metadata } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { Footnote } from "../../components/footnote"

export const metadata = {
  title: "How I stopped worrying and learned to love the easy fix",
  reactTitle: (
    <span>
      How I stopped worrying and learned
      <br />
      to love the easy fix
    </span>
  ),
  description:
    "On the balance between perfect solutions and pragmatic fixes in software engineering",
  date: "2025-11-06",
  slug: "how-i-stopped-worrying-and-learned-to-love-the-easy-fix",
}

const SimpleFixBlog: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <div className="overflow-hidden">
          <p>
            As software engineers, we strive to build clean systems. Cleaner
            systems are easier to work with, easier to reason about, and easier
            to extend. But finding the right solution is very hard, so much that
            one could argue, if you found the right solution, you're done{" "}
            <Footnote>
              A great post about how the right data models can shape your
              product can be found at{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://notes.mtb.xyz/p/your-data-model-is-your-destiny"
              >
                https://notes.mtb.xyz/p/your-data-model-is-your-destiny
              </a>
            </Footnote>
            .
          </p>
          <p>
            But after leading development for multiple years on a singular
            product, the bias towards the clean solutions affected me
            negatively. The striving towards the right solution, made me too
            obsessed at times with my vision of the system, how I believed
            everything should work and if we get there, everything will be
            blissful.
          </p>
          <p>
            So much that I at times, didn't go for the very easy solutions{" "}
            <Footnote>
              I use easy deliberately here instead of simple. As{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.infoq.com/presentations/Simple-Made-Easy/"
              >
                simple is not easy
              </a>{" "}
              .
            </Footnote>
            , that while broken by default, would have elevated the pain and
            improved the product.
          </p>

          <h2>Fear of getting stuck with the wrong solution</h2>
          <p>
            A personal example where I was too caught up in building the right
            solution was early on regarding data connections and their error
            states. At re:cap, you can connect your bank accounts and we'll
            update them daily. Open banking has many issues and these issues can
            happen at any stage, e.g. bank outages, the parsing of the data
            fails due to weird data, importing fails etc. We didn't surface
            these errors really well. We had to read through our logs or see
            what jobs failed and what their error messages were. This made
            debugging them harder and put a strain on our internal operations.
          </p>
          <p>
            One easy proposal was to just save the latest error that happened on
            the data connection. Would have been easy enough, one more database
            column and add some logic to update it. But I argued against it, I
            had already the right solution in mind. A solution that involved
            tracking the different job runs and persisting them, linking them
            cleanly to the data connection and surfacing them. With this, we
            could have had a history for each data connection, we could do
            things like "notify the user after 3 failures" etc. It was the{" "}
            <i>right</i> solution.
          </p>
          <p>
            But that "right" solution meant also much more work. I was too
            afraid of us getting stuck with the wrong thing, that the wrong way
            would continue to live on forever, causing ever so slight hiccups
            and issues. Was my fear founded? Somewhat, it can happen. Did my
            hesitation slow down progress? Yes absolutely, as I only managed to
            find the time to work on the right solution some months later.
          </p>
          <p>
            As I shipped the right solution, I also realized that it is not much
            different from the easy fix, at least on the surface. That I was far
            too opinionated about my vision and it caused the product to contain
            friction for longer than necessary.
          </p>
          <p>
            Just because it's not the right solution doesn't mean it's not a
            good solution for the moment, or that it has to stick around. Or
            maybe it does and the whole feature is discarded anyway, making the
            "good enough" solution the best solution as it allowed for faster
            iteration.
          </p>

          <h2>The balance of opposing ideas</h2>
          <p>
            So in the end, this article does not advocate for hacks everywhere,
            but to be open about them. To not get blocked by the idealistic
            vision of the system. As F. Scott Fitzgerald said,{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.goodreads.com/quotes/22749-before-i-go-on-with-this-short-history-let-me"
            >
              "intelligence is the ability to hold two contradictory ideas in
              the mind"
            </a>
            . Here we have "Building towards the right solution vs. making it
            work now".
          </p>
          <p>
            The key insight I've gained is that it is ok to steer away from ones
            vision and that the moment you consider discarding stop-gap
            solutions, reflect if that's actually the best for the product.
          </p>
          <p>
            An easy fix is a pragmatic step forward that delivers value
            immediately. You can always refactor later when you have more
            context, more time, or when the easy solution actually starts
            causing problems. Until then, ship the easy fix and move on to the
            next problem. Just be diligent about not creating a mess, clean up
            when it is causing issues.
          </p>
        </div>
      </BlogContent>
    </Container>
  )
}

export default SimpleFixBlog
