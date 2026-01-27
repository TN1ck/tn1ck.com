/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next"
import Container from "../../components/container"
import { BlogContent } from "../../components/blog"
import { Footnote } from "../../components/footnote"

export const metadata = {
  title: "Claude Code made me love meetings again",
  description:
    "AI coding tools reduced my dependence on deep flow and gave me the capacity to enjoy spontaneous meetings again.",
  date: "2026-01-27",
  slug: "claude-code-made-me-love-meetings-again",
}

const ClaudeCodeMeetingsBlog: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <p>
          The practice of software engineering is changing as we know it, that's
          clear to everyone who has used tools such as Claude Code or Codex.
          There were always people saying "Writing code was never the
          bottleneck", but I wholeheartedly disagree.
        </p>
        <p>
          Just a few years ago (!), the only way to build an idea you had was to
          sit down and write the code. The code was definitely my bottleneck.
          You had to focus deeply, with the code executing in your head, the
          layers of abstractions all in your working memory. Whenever I was in
          that mode, I did not want to get interrupted or rather paused in what
          I was doing. I could certainly deal with a quick interruption, but
          anything that would destroy my flow? Hell no. Remember the times when
          you were debugging an issue intensely for an hour and a meeting came
          closer and closer like some sort of mental doomsday?
        </p>
        <p>
          I started to loathe it whenever I was in such a state of deep flow /
          productivity and had to give it up for some meeting. This led me to
          continue to work on the problem if the meeting didn't require my full
          attention - and looking at the typing hands in those meetings, I sure
          wasn't the only one. When my mind is going 100 km/h solving a problem,
          I can't just force it to pull the handbrake to a stop and start
          thinking about a different one. This is also the reason why I had to
          stop working right before bed, as I couldn't sleep - my brain was
          still racing to solve the problem.
        </p>
        <p>
          And that wasn't bad! As a productive software engineer, you wanted to
          be in that flow as much as possible. Only in that state could you
          deliver quality software at a good pace. I felt like I wasn't doing my
          job properly when I didn't manage to be in that state for most of my
          working hours.
        </p>
        <p>
          But this is changing now, rapidly. I can have Claude Code or Codex
          write the majority of my code. I don't need to explore experiments
          myself anymore; it's often enough to give a rough outline and have it
          crank it out in 30 minutes.
        </p>
        <p>
          The need to optimize my working time for these hyper-focused states of
          coding is gone. Of course I still have to do it, but it became much
          less than what it was. And I started to notice the effects of it: I
          started to schedule more quick meetings, and I'm more open to
          discussing things. Of course I was always "open" to it, but it was a
          delicate cost / price balance and I would prefer async communication
          always. But now... they feel more efficient. My mind is not burdened
          with deep logic most of the time; it's just high-level thoughts.
        </p>
        <p>
          It will be interesting in which directions this will go - will we
          start using this mental capacity to run swarms of agents at the same
          time and spend our capacity on orchestrating them / working on
          multiple problems at the same time, as Steve Yegge suggests? Or will
          we become more "vertically integrated", meaning we own more parts of
          the product delivery - going more in the direction of a one-person
          company?
        </p>
        <p>
          I'm more in the latter camp as of now; I think the increase in roles
          such as "Product engineers" is a good sign in that direction. Many of
          the new cohort of successful startups are hiring for that - be it
          PostHog, Ashby or Linear (to name a few).
        </p>
        <p>
          Wherever it goes, for now I'm enjoying my freed-up mental capacity and
          increased capacity to get interrupted.
        </p>
      </BlogContent>
    </Container>
  )
}

export default ClaudeCodeMeetingsBlog
