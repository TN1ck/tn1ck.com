import { NextPage } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"

export const METADATA = {
  title: "The MIU System",
  date: "2017-09-07",
  slug: "miu",
}

const Miu: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={METADATA}>
        <p>
          The first exercise introduced in{" "}
          <a href="https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach">
            Gödel, Escher, Bach
          </a>{" "}
          is the MIU System. This post describes the system and how to solve it.
        </p>
        <p>
          I’m currently reading “Gödel, Escher, Bach” by Douglas Hofstadter,
          which is generally about <em>strange loops</em>.
        </p>

        <blockquote>
          <p>
            A strange loop is a cyclic structure that goes through several
            levels in a hierarchical system. It arises when, by moving only
            upwards or downwards through the system, one finds oneself back
            where one started.{" "}
            <a href="https://en.wikipedia.org/wiki/Strange_loop">- Wikipedia</a>
          </p>
        </blockquote>

        <p>
          One of the strange loops Hofstadter describes is a formal system. The
          first formal system the author describes is the MIU System. The MIU
          System has four rules:
        </p>

        <ol>
          <li>
            If you possess a string whose last letter is <code>I</code>, you can
            add a <code>U</code> at the end.
          </li>
          <li>
            Suppose you have <code>Mx</code>. Then you may add <code>Mxx</code>{" "}
            to your collection.
          </li>
          <li>
            If <code>III</code> occurs in one of the strings in your collection,
            you may make a new string with <code>U</code> in place of{" "}
            <code>III</code>.
          </li>
          <li>
            If <code>UU</code> occurs inside one of your strings, you can drop
            it.
          </li>
        </ol>

        <p>
          The goal of the book is to get from MI to MU.{" "}
          <a href="https://tn1ck.github.io/MIU/">
            I wrote an applet where you can try it out yourself
          </a>
          . Part of the blog post is also available there.
        </p>

        <h3 id="so-how-to-get-from-i-to-the-u">
          So, how to get from <code>I</code> to the <code>U</code>?
        </h3>

        <p>
          The only rule that can reduce the number of <code>I</code>s is the 3rd
          rule, so we should focus on that. To remove all <code>I</code>s, we
          need to ensure <code>count(I) mod 3 = 0</code>, which means that the
          number of <code>I</code>s must be divisible by 3. &quot;count&quot;
          represents the number of <code>I</code>s, &quot;mod&quot; is the
          mathematical operation modulo.
        </p>

        <p>
          With the second rule, we can duplicate the starting I. But doubling a
          number that is not divisible by 3 will never make it divisible by 3.
        </p>

        <blockquote>
          <strong>Proof sketch:</strong>
          <p>
            Suppose you have a number <code>n</code> that is not divisible by 3,
            so <code>n mod 3 != 0</code>, which means that{" "}
            <code>n = x * 3 + y</code>, where <code>x</code> can be any natural
            number and <code>y</code> is 1 or 2. When doubling the number, we
            get <code>n * 2 = x * 6 + y * 2</code>. <code>y * 2</code> is now 2
            or 4, both numbers are still not divisible by 3. <code>x * 6</code>{" "}
            is divisible by 3, so adding 2 or 4 will make it not divisible by 3.
          </p>
        </blockquote>

        <p>
          Reducing the number of <code>I</code>s by 3 obviously won’t help; we
          can only use this rule in a useful way when we already have a number
          that is divisible by 3. All other rules don’t affect the number of{" "}
          <code>I</code>s.
        </p>

        <p>
          So the first exercise given by Douglas Hofstadter in “Gödel, Escher,
          Bach” is impossible to solve.
        </p>

        <p>
          If you don’t believe this proof, simply try it out and check if you’re
          able to find a solution. <em>You won’t</em>.
        </p>

        <h3 id="but-why-give-the-reader-an-exercise-that-is-not-solvable">
          But why give the reader an exercise that is not solvable?
        </h3>

        <p>
          Because one encounters a lot of loops in the system. Every time you
          think, “I might try this,” you’ll get to a previous point, and you
          notice that the whole system loops itself. You figure out that you
          can’t escape, and it doesn’t matter how often or long you try, you’ll
          always go back to where you started.
        </p>
      </BlogContent>
    </Container>
  )
}

export default Miu
