/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next"
import Container from "../../components/container"
import { BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import { Footnote } from "../../components/footnote"

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
          Sometimes "broken" is an obvious bug. Sometimes it's a nonsensical UI.
          Sometimes it's a business process where multiple steps have quietly
          drifted out of sync. The exact nature doesn't matter. What matters is:
          if nobody looks at it, it quietly decays.
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
              I am not advocating you should use your users as beta testers, nor
              did any workplace see users as that. You should do everything to
              make sure that your users do not see something broken. The point
              is merely that a used products has automatic visibility due to its
              users that want it to work.
            </Footnote>
          </li>
          <li>
            Integration tests expect your app to behave in a certain way and
            fail when it stops doing so.
          </li>
          <li>Your QA team checks features before they are launched.</li>
        </ul>
        <p>
          Put like that, visibility sounds like an obvious win. Why wouldn't you
          make everything visible?
        </p>
        <p>Because visibility isn't free.</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            Letting your users be the integration tests creates churn and
            support tickets. Also it's disrespectful.
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
          The concept of visibility is already established quite well with
          Observability. But that's actually coincidental, I didn't transfer
          their concept to product development.{" "}
          <a
            className="link"
            href="https://en.wikipedia.org/wiki/Carcinisation"
          >
            But similar how every animals final evolution is a crab
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
          <li>
            How much effort does it take to verify? (time, access,
            representation, knowledge)
          </li>
          <li>How often is it actually verified?</li>
        </ol>
        <p>
          You can imagine a feature sitting somewhere on each of those axes. The
          more things cluster on the "only one dev knows how to check this,
          slowly, by running custom code, and nobody ever does" side, the more
          likely they are to be broken.
        </p>
        <p>Let's go through these.</p>

        <h2>1. Who can spot issues (and who can investigate them)?</h2>
        <p>
          This is the most intuitive dimension: who could notice that this thing
          is broken? Just the original developer? Any teammate? An internal
          operations person? The end user?
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
            Spotting that something looks off ("this spike is weird"), and
          </li>
          <li>
            Verifying whether it's actually wrong ("yes, this is not valid").
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
          doesn't mean they can determine why it is the way it is. Verification
          is often a gradual thing: over time, more people can understand,
          trace, and explain what is going on.
        </p>
        <h3>Example: letting the shop owner debug a spike</h3>
        <p>
          Imagine you run an online shop and the system shows you a graph of
          your sales for the last 30 days. One day there's a big spike, but your
          total revenue barely moved. You spot a potential issue - and now you
          try to understand how this number came to be:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            The shop system shows you raw orders, filterable by time and
            product.
          </li>
          <li>You filter down to the time window of the spike.</li>
          <li>
            You see that the product sold is your most popular one, but the
            price is lower than usual.
          </li>
          <li>
            You click on an order and see that the price was discounted with a
            PROMOTION2025 code.
          </li>
          <li>
            You go to the list of discount codes, see it was created by someone
            in marketing a week earlier, and reach out to them.
          </li>
        </ul>
        <p>
          The example is simple, but it shows how much the person could
          investigate the issue themselves. If they didn't have access to
          historical orders or discount codes, they'd be stuck. They could spot
          the spike, but not verify or explain it.
        </p>
        <p>
          Empowering users to do these things can reduce support tickets and
          increase confidence in your product, especially if it's numbers-heavy.
          The nice thing is: this often equals good UX. If the user can
          investigate issues on their own, they gain more confidence in the
          product. Magical products that are black boxes are amazing when they
          work, but incredibly frustrating when they don't.
        </p>

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
          automation. People forget to look, priorities shift, that "critical"
          dashboard tab stays closed.
        </p>
        <p>Rough intuition:</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            Seconds: you'll check all the time (tests on save, tiny scripts).
          </li>
          <li>
            Minutes: you'll check sometimes (e.g. "run the full suite before
            pushing").
          </li>
          <li>Hours: you'll only check on CI or explicit runs.</li>
          <li>Days or weeks: you'll almost never check manually.</li>
        </ul>
        <p>
          This has huge impact on design: a 10-second local check encourages
          experiments and refactors. A 2-hour "full" check means you'll be very
          picky about when you touch that code. Developers already know this
          from slow test suites and compilers. I still think decreasing the
          time-to-feedback for anything is underrated. If your whole test suite
          ran in a second, you (and your AI agents) would develop very
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
        <h4>Anecdote: even a crude debug view helps</h4>
        <p>
          If you've ever used open banking, you probably know it has issues.
          With PSD2, the EU made it law that banks have to provide APIs. It did
          not standardize how the API should look or behave, so every bank did
          its own thing.
        </p>
        <p>
          For a product, this means: you don't integrate with every bank
          yourself - you use an open banking provider. I've worked with
          multiple. They all have their quirks. When a customer had trouble
          connecting their bank, all of these could be at fault:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>The customer (wrong credentials, wrong bank selected, etc.)</li>
          <li>The bank (outage, random error)</li>
          <li>The open banking provider (implementation bug, API change)</li>
          <li>Us (a bug in our integration)</li>
        </ul>
        <p>
          Initially, when support asked "what went wrong for this user?", I had
          to go dig through logs. Finding the right entries took time and was
          annoying.
        </p>
        <p>
          So I started saving all relevant connection attempts into a table
          (bank_account_connection), which we already had to handle webhooks
          anyway. Now I just had to run a simple SQL query to see all attempts
          and their status.
        </p>
        <p>
          Then I added a very simple table view for this to our internal
          operations app. This took the task from minutes to seconds - for me.
          But it also meant:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>Non-technical team members could see these attempts.</li>
          <li>
            With a bit of guidance, ops could quickly tell which party was at
            fault.
          </li>
          <li>
            Support stopped needing a developer for every single "bank
            connection failed" case.
          </li>
        </ul>
        <p>
          All from "just showing some data" in a crude internal UI. Adding this
          kind of table to internal tools is often just boilerplate. With LLMs,
          the threshold of "is it worth it to build a view for this?" has
          dropped even further. The answer is "yes" much more often.
        </p>

        <h3>2.3 Representation</h3>
        <p>
          The shop owner wouldn't even have noticed the sales spike without the
          line chart. A table of daily totals is far less likely to make you
          think "woah, what happened here?". Representation matters a lot.
        </p>
        <h4>Anecdote: aggregate your snapshots</h4>
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
        <p>Every month, the data had to be updated with the current status:</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>Did some contracts churn?</li>
          <li>Did the invoices we expected actually get paid?</li>
          <li>
            Do we need to replace a contract or move expected cashflows to a
            later month?
          </li>
        </ul>
        <p>In short: a lot of data that changed in non-trivial ways.</p>
        <p>
          I created an integration test that snapshotted these tables at various
          important stages so we could see how any code change affected the
          structures. On paper, this made things "visible".
        </p>
        <p>
          In practice, when I changed the underlying code, the snapshot diffs
          were huge and noisy. I could see that something changed, but not
          whether it changed in the right way.
        </p>
        <p>
          The solution wasn't to become a human diff engine. It was to make the
          data readable. I created a custom aggregated structure that summarized
          the important aspects instead:
        </p>
        <CodeBlock language="json" className="md:-mx-8 md:px-8 -mx-4">
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
          Any change in the underlying code showed up as a simple, readable diff
          in this structure. The invisibility problem wasn't "lack of tests"; it
          was a data representation that no human could parse.
        </p>

        <h3>2.4 Knowledge</h3>
        <p>
          Legacy code is often just "code where nobody on the team has a mental
          model anymore". This ties directly into how hard it is to verify
          something. If you set up the business process, you know the idea
          behind it and whether it still makes sense. If you wrote that weird
          part of the code with the cryptic comments, you have a better chance
          of understanding your past self.
        </p>
        <p>
          If there's a playbook for recurring issues, more people can handle
          them.
        </p>
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
          At Google, they're very good at this via tooling. They don't have tons
          of traditional documentation, but they have excellent code history
          tools and strong habits around leaving traces in code reviews and
          commits. You quickly learn to navigate through the history of a file
          and understand why something looks the way it does. That's also a form
          of visibility.
        </p>

        <h2>3. How often is it actually verified?</h2>
        <p>
          This is where everything comes together. Even if something is easy and
          quick in theory, the important bit is: how often does anyone actually
          do it?
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
        <p>At system level:</p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            Your uptime monitor probably checks your website every few seconds.
          </li>
          <li>
            Your off-site backup restoration probably happens... quarterly, if
            you're lucky.
          </li>
        </ul>
        <p>
          Features and code that nobody runs, nobody clicks, and no test touches
          effectively live in a dark corner. They might technically "work"
          today, but you'd be brave to bet your business on it. A useful rule of
          thumb:
        </p>
        <p>
          If something isn't exercised by either users or automation, assume
          it's broken.
        </p>
        <p>
          Which leads to a hard but liberating conclusion: you should probably
          delete more things.
        </p>
        <h3>Anecdote: invisible features rot</h3>
        <p>
          If I ever got Chinese character tattoos, they'd probably spell YAGNI
          ("You Ain't Gonna Need It") and KISS ("Keep It Simple, Stupid"). But
          let's go back in time, when I didn't have those yet ingrained through
          experience.
        </p>
        <p>
          At my first job, I was somehow responsible for the frontend as a
          working student. Not great for me, not great for the company, but it
          had one strong side effect: I got very attached to "my" code.
        </p>
        <p>
          Like any product, we built experiments and features that later turned
          out to be unneeded. But when the time came to delete something, it
          felt... wrong.
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>I'd spent my limited hours building it.</li>
          <li>It worked (at least at some point).</li>
          <li>Deleting it felt like deleting proof of work.</li>
        </ul>
        <p>
          So I kept code around "just in case" and maintained code paths that
          the product didn't actually use anymore. You can probably guess how
          this ended: one day, someone needed that old feature again. We flipped
          the switch back on.
        </p>
        <p>And it was broken.</p>
        <p>
          Not dramatically broken; just subtly incompatible. Over the months,
          everything around it had changed:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>Different data shapes</li>
          <li>Different assumptions</li>
          <li>Different authentication flows</li>
          <li>New invariants that the old code didn't respect</li>
        </ul>
        <p>We now had to:</p>
        <ol className="ml-4 pl-4 list-outside list-decimal">
          <li>Understand how it worked back then.</li>
          <li>Understand how the system changed since.</li>
          <li>Patch it back into shape.</li>
        </ol>
        <p>
          In the end, it would have been faster and safer to rebuild it from
          scratch with current constraints in mind. The painful insight: code
          that nobody runs and nobody looks at isn't "sleeping". It's decaying.
        </p>
        <p>
          Once I started looking at features through the visibility spectrum,
          the rule became simple:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            If something is unused and invisible, it's already broken - you just
            haven't observed it yet.
          </li>
          <li>If you ever need it again, you won't trust it anyway.</li>
          <li>So delete it. Be glad to delete it.</li>
        </ul>
        <p>You ain't gonna need it. Keep your codebase simple, stupid.</p>

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
              <li>Any engineer?</li>
              <li>Support, ops, finance?</li>
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
        <p>And one extra question that often decides everything:</p>
        <ol start={4} className="ml-4 pl-4 list-outside list-decimal">
          <li>
            If nobody uses this anymore, why is it still here?
            <ul className="ml-4 pl-4 list-outside list-disc">
              <li>Can we delete it now?</li>
              <li>If we keep it, are we willing to pay the visibility cost?</li>
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
