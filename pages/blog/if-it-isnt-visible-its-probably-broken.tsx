/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next"
import Container from "../../components/container"
import { BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import { Footnote } from "../../components/footnote"
import { Card } from "../../components/card"

export const metadata = {
  title: "If it isn't visible, it's probably broken",
  description:
    "A framework for thinking about visibility: who can see issues, how hard it is to verify, and how often anything gets checked.",
  date: "2025-12-07",
  slug: "if-it-isnt-visible-its-probably-broken",
}

const VisibilityBlog: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <p>
          In my career building products at startups and in big tech, I've
          noticed a pattern: anything that isn't really visible yet is probably
          broken in some way.
        </p>
        <p>
          "Broken" can be anything from a glitchy UI, to a bug, a major data
          pipeline creating rubbish to you losing all your customer data,
          because backups did not work correctly. The point is, that if nobody
          is looking at it, it decays or was never working to begin with.
        </p>
        <p>
          When something is visible, issues are found quickly, because there is
          someone or something that knows it's supposed to work and verifies
          that it stays that way:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            Users use your product and notice regressions because they know how
            it's supposed to behave.
            <Footnote>
              I'm not advocating using your users as beta testers, nor did any
              workplace I was in see users that way. You should do everything
              you can to make sure that your users do not see something broken.
              The point is merely that a used product has automatic visibility
              because its users want it to work.
            </Footnote>
          </li>
          <li>
            Integration tests expect your app to behave in a certain way and
            fail when it stops doing so.
          </li>
          <li>Your QA team checks features before they are launched.</li>
        </ul>
        <p>Put like that, why wouldn't you make everything visible?</p>
        <p>Because visibility isn't free.</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            Letting your users be the integration tests is just wrong on so many
            levels.
          </li>
          <li>Integration tests are non-trivial to write and maintain.</li>
          <li>QA time is expensive and limited.</li>
        </ul>
        <p>
          So you have to decide where to pay for visibility, and how much. As
          with everything, the first step is to be aware of the visibility of
          something.
        </p>
        <p>
          The concept of visibility is already established quite well in
          infrastructure with observability. But my thinking here came more from
          product work than from SRE blogs.{" "}
          <a
            className="link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Carcinisation"
          >
            But similar how every animal's final evolution is a crab
          </a>
          , making things more visible (in whatever way) is the logical
          conclusion to many disciplines.
        </p>
        <h2>The visibility spectrum</h2>
        <p>
          I've started to think in terms of three axes for visibility. It
          doesn't matter if the "thing" is a feature, a data pipeline, or an
          internal process - you can ask the same questions:
        </p>
        <ol className="ml-4 pl-4 list-outside list-decimal">
          <li>Who can spot issues - and who can actually debug them?</li>
          <li>How much effort does it take to verify?</li>
          <li>How often is it actually verified?</li>
        </ol>
        <p>
          You can imagine a feature sitting somewhere on each of those axes. The
          more things cluster on the "only one dev knows how to check this,
          slowly, by running custom code, and nobody ever does" side, the more
          you want to turn in your resignation.
        </p>
        <p>Let's go through these.</p>
        <h2>1. Who can spot issues (and who can investigate them)?</h2>
        <p>
          This is the most intuitive dimension: who could notice that this thing
          is broken? Just the original developer? Any teammate? The end user?
        </p>
        <p>A lot of bugs are not found by the team who wrote the code.</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>A user who sees a weird number they don't understand.</li>
          <li>A support person who gets three similar tickets.</li>
          <li>A finance person whose export doesn't add up.</li>
        </ul>
        <p>There's also an important distinction between:</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            <strong>Spotting</strong> that something looks off ("this spike is
            weird"), and
          </li>
          <li>
            <strong>Verifying</strong> whether it's actually wrong ("yes, this
            is not valid").
          </li>
        </ul>
        <p>
          You want both, but they're different skills and different levels of
          access. If we want to improve this axis, we first aim to increase the
          number of people who can spot issues. To do this, we have to make
          things accessible:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>If I can't see the data, I cannot spot issues in it.</li>
          <li>
            If the process is not documented anywhere, I cannot even think about
            it.
          </li>
          <li>
            If the feature cannot be toggled via a feature flag, I cannot try it
            myself.
          </li>
        </ul>
        <p>
          Even a very crude UI or CSV export goes a long way compared to "only
          accessible via SQL on the production database". I've been surprised
          many times by how much time is saved simply by giving other people the
          ability to see and poke at things.
        </p>
        <p>
          As mentioned, spotting an issue is different from being able to verify
          it. Just because someone thinks a number looks sketchy in a report
          doesn't mean they can determine why it is the way it is.
        </p>
        <Card title="Anecdote: even a crude debug view helps">
          <p>
            If you want to provide your customer a way to connect your customer,
            you have to rely on a service like Plaid or GoCardless to do so,
            which also means, that every time something goes wrong, it could be
            any of these things:
          </p>
          <ul className="ml-4 pl-4 list-outside list-disc">
            <li>The bank (outage, random error)</li>
            <li>The open banking provider (implementation bug, API change)</li>
            <li>Us (a bug in our integration)</li>
            <li>The customer (wrong credentials, wrong bank selected, etc.)</li>
          </ul>
          <p>
            Initially, when our support asked "what went wrong for this user?",
            I had to go dig through logs. Finding the right entries took time
            and was annoying.
          </p>
          <p>
            So I started saving all relevant connection attempts into a table (
            <code>bank_account_connection</code>), which we already had to
            handle webhooks anyway. Now I just had to run a simple SQL query to
            see all attempts and their status.
          </p>
          <p>
            Then I added a very simple table view for this to our internal
            operations app. I actually only did this to make my own life easier,
            but in the end, I didn't have to look at this stuff at all anymore:
          </p>
          <ul className="ml-4 pl-4 list-outside list-disc">
            <li>Non-technical team members could see these attempts.</li>
            <li>
              After explaining some error codes, our support team could
              perfectly understand them.
            </li>
            <li>
              All customer requests since then were completely handled by them
              alone.
            </li>
          </ul>
        </Card>
        <p>
          The team members were able to spot issues before - as a customer
          reached out - but they didn't have enough access to verify anything on
          their own. By giving them access to even the crudest debug view, they
          were able to debug it themselves. This is in line with the famous
          saying:
        </p>
        <blockquote>
          "Take over a support ticket for someone and you helped them for a day;
          give the person access to a debug table, and they can answer support
          tickets for their lifetime."
        </blockquote>
        <h2>2. How much effort does it take to verify?</h2>
        <p>
          Even if people can see an issue and are allowed to investigate,
          there's still a question: how painful is it to actually verify that
          something works? The more painful it is, the less often you'll do it.
        </p>
        <p>For me, "effort to verify" usually comes from four things:</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>How long it takes</li>
          <li>Ease of access</li>
          <li>Representation</li>
          <li>Required knowledge</li>
        </ul>
        <p>Let's look at each one.</p>
        <h3>2.1 How long does it take to verify?</h3>
        <p>
          While working at YouTube, there was often a rush on Fridays to get
          experiments launched before the weekend. Not because enabling
          experiments on a Friday is fun, but because:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>If you got the experiment out on Friday,</li>
          <li>You could look at the numbers on Monday,</li>
          <li>Decide quickly whether to ramp up, roll back, or iterate.</li>
        </ul>
        <p>
          The weekend basically worked like a time-skip cheat for verification.
          If you only managed to launch on Monday, you'd have to wait until
          Wednesday to get two full days of data.
        </p>
        <p>The same idea shows up everywhere:</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>Running your test suite before you go to lunch.</li>
          <li>
            Running multiple agents or jobs in parallel to shorten feedback
            loops.
          </li>
          <li>
            Using a small sample dataset locally before touching the full one in
            CI.
          </li>
        </ul>
        <p>
          If checking whether something works takes weeks or months, it
          effectively never gets checked unless you have very disciplined
          automation.
        </p>
        <Card title="Anecdote: the joy and annoyance of pre-commit checks">
          <p>
            Pre-commit checks allow you to execute actions whenever you commit
            code. The pitch is great: never forget to run formatting, type
            checks, unit tests etc. Simply put these checks into the pre-commit
            hook.
          </p>
          <p>
            But if you ever worked at a place where pre-commit started to take
            longer, you are also familiar with the command line argument{" "}
            <code>--no-verify</code> that skips the pre-commit check. As you
            don't really want to wait that long, you start to{" "}
            <strong>execute it less often</strong>.
          </p>
          <p>
            We faced this exact issue: more and more team members started to
            skip the checks, me included. So we simply removed the biggest
            offenders as we also ran them in CI. One of them was the code
            formatter - which in theory shouldn't break as it runs whenever you
            save.
          </p>
          <p>
            This definitely helped... but it didn't actually help in merging PRs
            faster, as more often than not, the formatting was broken. As Claude
            Code or Codex skip your on-save hook and are also not the most
            reliable in following commands, the formatting was often skipped.
          </p>
          <p>
            The formatter we used was{" "}
            <a
              className="link"
              target="_blank"
              href="https://github.com/segmentio/golines"
            >
              <code>golines</code>
            </a>
            . It's an improvement over the default Go formatter{" "}
            <code>gofmt</code>, which doesn't restrict any line length. But
            contrary to it, <code>golines</code> could take up to a minute on
            our codebase, while <code>gofmt</code> is basically instant.
          </p>
          <p>
            So what to do - put it back into pre-commit and never forget it but
            always be annoyed, or accept that one has to handle the occasional
            breakage?
          </p>
          <p>
            The solution was neither. We decided to switch to{" "}
            <a
              className="link"
              target="_blank"
              href="https://github.com/mvdan/gofumpt"
            >
              <code>gofumpt</code>
            </a>
            . The project is healthy and while not supporting breaking long
            lines yet, it's on their roadmap. Even though breaking long lines is
            nice and helps, it doesn't happen that often in Go - and the time
            penalty we paid for it was simply too much.
          </p>
        </Card>
        <p>
          The anecdote shows that <i>how long</i> something takes directly
          correlates with <i>how often</i> it gets done. Developers already know
          how annoying long-running tests or compilers are and do strive to make
          faster tools (thanks to everyone rewriting slow tools in Go, Rust or
          Zig). I still think decreasing the time-to-feedback for anything is
          underrated. If your whole test suite ran in a second instead of half
          an hour, you (and your AI agents) would be able to develop very
          differently.
        </p>
        <h3>2.2 Ease of access</h3>
        <p>
          The easier it is to access the feature, data or process, the more
          likely you are to actually verify it. If you have to:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>Write custom SQL to read a handful of rows,</li>
          <li>Download and manually grep logs from a particular day,</li>
          <li>
            Or sign in with a special account using an unusual 2-factor setup,
          </li>
        </ul>
        <p>
          you'll simply do it less often. It might be "possible", but it's not
          easy. The nice thing: improvements in "who can access this?" also
          usually improve ease of access in general.
        </p>
        <p>
          This obviously correlates with how long things take, but it's mainly
          about friction: even small annoyances compound until you stop doing
          the check at all.
        </p>
        <Card title="Anecdote: making device testing easier at YouTube">
          <p>
            YouTube is one of the biggest apps ever; as such it runs on every
            device that can theoretically run it. To make sure we didn't break
            anything when changing the mobile apps, we had plenty of test
            devices lying around of different form factors and types (e.g.
            Android tablet, older iPhone).
          </p>
          <p>
            Testing on the devices was easy if your feature was already launched
            - simply sign in with the setup test accounts and check it out. But
            that's already too late if you want to be careful. The issue was
            that test accounts on these devices didn't allow the manual override
            of feature flags. You could do it with your own corporate account,
            but that meant:
          </p>
          <ol className="ml-4 pl-4 list-outside list-decimal">
            <li>
              Signing in with your account on every test device you want to test
              on
            </li>
            <li>Doing the security challenges</li>
            <li>Flipping the flag and testing the new feature</li>
            <li>
              Cleaning up afterwards, as you don't want anyone else to have
              access to your account
            </li>
          </ol>
          <p>
            Only point 3 should actually be necessary. I was a bit confused why
            this was so annoying and why nobody had fixed it yet. Reading the
            docs it became clear that there actually existed a solution, but
            only in the main YouTube office in San Bruno: they had a custom WiFi
            setup that allowed setting feature flags on test accounts.
          </p>
          <p>
            As we were a sizeable YouTube operation in Zurich back then, I was
            able to get our own custom WiFi setup, making testing on devices
            much easier.
          </p>
          <p>
            This is the part where I should mention how this transformed our
            device testing, but sadly Covid hit and we were working from home.
            With me leaving to join re:cap, I was never able to see the full
            glory of the testing WiFi.
          </p>
        </Card>
        <p>
          The anecdote should show that it was mostly an annoying access problem
          that made you not want to test quickly on a device. The steps weren't
          difficult, nor did they take that long. But they were annoying enough
          that you really didn't want to do them often.
        </p>
        <h3>2.3 Representation</h3>
        <p>
          Representation matters a lot. The more data points you have, the more
          important it becomes: 1000 rows of data are not intuitive; a bar chart
          is.
        </p>
        <Card title="Anecdote: aggregate your snapshots">
          <p>
            I once had to make sure a critical piece of money-handling code was
            tested properly so its business logic could be changed safely. We
            would "buy" our customers' contracts to pay them their worth upfront
            with a discount (factoring). They then had to pay us back over the
            next months. There were multiple tables involved:
          </p>
          <ul className="ml-4 pl-4 list-outside list-disc">
            <li>The payout to the customer</li>
            <li>Monthly payback schedules</li>
            <li>Underlying contracts</li>
            <li>Invoices belonging to those contracts</li>
            <li>Future expected invoices</li>
          </ul>
          <p>
            Every month, the data had to be updated with the current status:
          </p>
          <ul className="ml-4 pl-4 list-outside list-disc">
            <li>Did some contracts churn?</li>
            <li>Did the invoices we expected actually get paid?</li>
            <li>
              Do we need to replace a contract or move expected cash flows to a
              later month?
            </li>
          </ul>
          <p>In short: a lot of data that changed in non-trivial ways.</p>
          <p>
            I created an integration test that snapshotted these tables at
            various important stages so we could see how any code change
            affected the structures. On paper, this made things "visible".
          </p>
          <p>
            In practice, when I changed the underlying code, the snapshot diffs
            were huge and noisy. I could see that something changed, but not
            whether it changed in the right way.
          </p>
          <p>
            The solution wasn't to become a human diff engine. It was to make
            the data readable. I created a custom aggregated structure that
            summarized the important aspects instead:
          </p>
          <CodeBlock language="text" className="">
            {`
{
  "financeableContracts": 62,
  "financedContracts": 0,
  "activeContracts": 62,
  "rebatedContracts": 0,
  "replacedContracts": 0,
  "activeInvoices": 1008,
  "paidInvoices": 0,
  "residualInvoices": 0,
  "payoutAmount": "428355",
  "paybackAmount": "450900",
  "financingFee": "0.05",
  "missingPaybackAmount": "0",
  "collectedPaybackAmount": "0",
  "remainingPaybackAmount": "450900",
  "payoutStatus": "requested",
  "monthlyPaybackStats": [
    {
      "paybackAmount": "68610",
      "paidAmount": "0",
      "status": "active",
      "invoices": 160
    }
  ]
}
          `}
          </CodeBlock>
          <p>Now I could quickly sanity-check:</p>
          <ul className="ml-4 pl-4 list-outside list-disc">
            <li>Do the totals still make sense?</li>
            <li>Are there unexpected churned or replaced contracts?</li>
            <li>Are invoices missing or mis-classified?</li>
          </ul>
          <p>
            Any change in the underlying code showed up as a simple, readable
            diff in this structure. The invisibility problem wasn't "lack of
            tests"; it was a data representation that no human could parse.
          </p>
        </Card>
        <p>
          The anecdote shows that if the representation is lacking, visibility
          can completely tank, even if every other dimension is fulfilled. Ask
          yourself if a different representation would make your life easier.
        </p>
        <h3>2.4 Knowledge</h3>
        <p>
          {"Legacy code can be understood as "}
          <a
            className="link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://johnwhiles.com/posts/programming-as-theory"
          >
            code where nobody on the team has a mental model of it anymore
          </a>
          . This ties directly into how hard it is to verify something. If you
          set up the business process, you know the idea behind it and whether
          it still makes sense. If you wrote that weird part of the code with
          the cryptic comments, you have a better chance of understanding your
          past self.
        </p>
        <p>If there's a playbook for recurring issues, more people can help.</p>
        <p>
          I won't tell you "just write documentation" - docs have their own
          problems and are not a silver bullet. But you should keep a paper
          trail:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>Pull requests should have a description and link to a ticket.</li>
          <li>Commits should have real messages.</li>
          <li>
            Somewhere, you should write down why you did something a certain
            way.
          </li>
        </ul>
        <p>
          The easier it is to find that context, the better, but even a small
          breadcrumb helps. You will forget your own reasoning, and it's a
          humbling feeling to stare at code you wrote two years ago and think
          "why on earth did I do this?".
        </p>
        <p>
          At Google, they're very good at this via tooling. They don't have much
          traditional documentation, but they have excellent code history tools
          and strong habits around leaving traces in code reviews and commits.
          You quickly learn to navigate through the history of a file and
          understand why something looks the way it does. That's also a form of
          visibility.
        </p>
        <h2>3. How often is it actually verified?</h2>
        <p>
          Even if something is easy and quick in theory, the important bit is:
          how often does anyone actually do it?
        </p>
        <p>Some examples:</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>If my test suite takes 1 second, I'll run it on every save.</li>
          <li>If it takes 5 minutes, I'll probably rely on CI.</li>
          <li>
            If it takes hours, maybe I'll run it once a day, or just before
            releases.
          </li>
        </ul>
        <p>
          The only advice here is to automate whatever you can, put any check
          you can into your CI. Put required password and token rotations into
          your calendar.
        </p>
        <h2>Making things visible on purpose</h2>
        <p>
          So what do you do with all of this? When you work on a feature, piece
          of data, or internal process, ask yourself:
        </p>
        <ol className="ml-4 pl-4 list-outside list-decimal">
          <li>
            Who can tell if this is broken?
            <ul className="ml-4 pl-4 list-outside list-disc">
              <li>Only me?</li>
              <li>Any team member?</li>
              <li>The end user?</li>
            </ul>
          </li>
          <li>
            How much effort does it take to verify it, without talking to the
            original author?
            <ul className="ml-4 pl-4 list-outside list-disc">
              <li>Is there a debug view?</li>
              <li>
                Is there a clear representation (aggregate, graph, table)?
              </li>
              <li>Is there a quick path to the relevant data and history?</li>
            </ul>
          </li>
          <li>
            How often does this actually get exercised?
            <ul className="ml-4 pl-4 list-outside list-disc">
              <li>Tests on every commit?</li>
              <li>Dashboards someone looks at weekly?</li>
              <li>A manual run once per quarter?</li>
              <li>Never?</li>
            </ul>
          </li>
        </ol>
        <p>
          Often, problems you've been fighting for months ("that report that is
          always wrong", "that feature that breaks every second release") are
          just symptoms of low visibility:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>Nobody can easily see when it drifts.</li>
          <li>Or the only person who can isn't looking anymore.</li>
        </ul>
        <p>
          Making something visible doesn't magically fix it, but it changes the
          odds:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>It gives people a chance to notice.</li>
          <li>
            It gives them a representation that matches their mental model.
          </li>
          <li>
            And it makes deletion an explicit option when nobody looks at it at
            all.
          </li>
        </ul>
        <p>
          If it isn't visible, assume it's broken - and then decide whether it's
          worth making visible or worth deleting. Both are better than
          pretending it's fine in the dark.
        </p>
      </BlogContent>
    </Container>
  )
}

export default VisibilityBlog
