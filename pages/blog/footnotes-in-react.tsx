/* eslint-disable react/no-unescaped-entities */
import { NextPage, Metadata } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import Head from "next/head"
import { Footnote } from "../../components/footnote"

export const metadata = {
  title: "Footnotes for your React / Next.js blog",
  description: "",
  date: "2024-07-16",
  slug: "footnotes-in-react",
}

const Footnotes: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <p>
          For any person whose mind likes to wander and tends to put lots of
          information into parentheses (there is just too much to tell!),
          footnotes are an excellent way to still convey all those thoughts
          without destroying the flow of an article (such as this one), and as
          an additional benefit, you have the chance to mimic the style of David
          Foster Wallace.
          <Footnote>
            David Foster Wallace&apos;s most famous book is Infinite Jest, which
            has about 200 pages. If you know nothing about him, I can highly
            recommend listening to the graduation speech he gave titled{" "}
            <a
              target="_blank"
              href="https://www.youtube.com/watch?v=DCbGM4mqEVw"
            >
              This is Water
            </a>
            .
          </Footnote>
        </p>
        <p>
          This blog is written directly with React with no content layers in
          between.
          <Footnote>
            You might ask yourself why I don’t use something that already
            provides this functionality. The reason is that these systems (e.g.
            Markdown) are focused on &quot;normal&quot; content, they make it
            hard to mix interactive elements into it, which is what I like to do
            a lot, so writing my content straight up in React works very well.
          </Footnote>{" "}
          To not end up having to write <code>{"<sup>1</sup>"}</code> everywhere
          and having to manually track numbers and references, I created a React
          component that automates this. It is now as simple as writing{" "}
          <code>{"<Footnote>The footnote's content</Footnote>"}</code> and a
          footnote will appear, such as this one.
          <Footnote>
            This footnote serves just for the example, I’m sorry.
          </Footnote>
        </p>
        <p>
          Proper footnotes are quite complex, as the footnotes table can only be
          created after all footnotes are set. This is also the reason that you
          have to compile a LaTeX/BibTeX document four times.
          <Footnote>
            Answer slightly adapted from{" "}
            <a
              className="link"
              href="https://tex.stackexchange.com/questions/53235/why-does-latex-bibtex-need-three-passes-to-clear-up-all-warnings"
            >
              tex.stackexchange.com
            </a>
            .
          </Footnote>
        </p>
        <ol className="blog">
          <li>
            <code>latex document</code>: All <code>{`\\cite{...}`}</code>{" "}
            arguments are written in the file <code>document.aux</code>.
          </li>
          <li>
            <code>bibtex document</code>: This information is taken by bibtex
            and the relevant entries are put into the <code>.bbl</code> file,
            sorted either alphabetically or by citation order (sometimes called
            "unsorted") and formatted according to the instructions provided by
            the bibliography style that’s in use.
          </li>
          <li>
            <code>latex document</code>: The <code>.bbl</code> file is included
            at the point the <code>\bibliography</code> instruction is used, and
            the correct labels for <code>{`\\cite{...}`}</code> commands are
            written into the <code>.aux</code> file.
          </li>
          <li>
            <code>latex document</code>: The correct labels are now known and
            set in the document.
          </li>
        </ol>
        <p>
          So how do you make footnotes work for a dynamic content? The answer is
          you don’t. "Classical" footnotes are not possible in a dynamic
          website, as adding / removing footnotes would change their numbers and
          render them useless. So all footnotes have to be known when the
          footnote table is created. If the footnotes are not known at that
          time, one normally has to resort to just showing them when clicking on
          them without creating a separate table at the end (normally a question
          mark is used then instead of a number). This way each note is
          independent from each other. It’s also the more "web native" way of
          doing it.
        </p>
        <p>
          But I like proper footnote tables and I don’t have the need to be that
          dynamic with by footnotes, so I created a solution that works for me
          (and for most others I think as well). So it is limited by design and
          is reliant on how React works. The <code>{`<Footnote>`}</code>{" "}
          components have to be executed in order. If this can not be
          guaranteed, multiple passes have to be done (like with LaTeX), this
          has other complexities, so I opted for the simpler solution.
        </p>
        <p>
          The task is complex enough that GPT 4 can’t correctly solve it, so
          here is the handcrafted solution.
          <Footnote>
            So that OpenAI&apos;s crawlers can pick it up and improve their
            answer with this infinite wisdom I present here, you’re welcome Sam
            Altman!
          </Footnote>
          <br />
          First, we need the <code>FootnoteContext</code> that provides the
          global state that the <code>Footnote</code> component adds its content
          to. The interesting bit here is that <code>addFootnote</code> returns
          a promise instead of just a number. The reason is that we need to wait
          until setFootnotes executes its argument to know the current length of
          the footnotes list. This is an unusual way of using hooks and as has
          side effects, multiple calls to it would lead to unexpected behavior.
          But as mentioned above, this is a limitation by design.
        </p>
        <CodeBlock
          className="md:-mx-8 md:px-8 -mx-4"
          language="typescript"
        >{`// context/FootnoteContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react"

interface FootnoteContextType {
  addFootnote: (content: string) => Promise<number>
  footnotes: string[]
}

const FootnoteContext = createContext<FootnoteContextType | undefined>(
  undefined,
)

const FootnoteProvider = ({ children }: { children: ReactNode }) => {
  const [footnotes, setFootnotes] = useState<string[]>([])

  const addFootnote = (content: string): Promise<number> => {
    return new Promise<number>((resolve) => {
      setFootnotes((prevFootnotes) => {
        resolve(prevFootnotes.length + 1)
        return [...prevFootnotes, content]
      })
    })
  }

  return (
    <FootnoteContext.Provider value={{ addFootnote, footnotes }}>
      {children}
    </FootnoteContext.Provider>
  )
}

const useFootnoteContext = () => {
  const context = useContext(FootnoteContext)
  if (!context) {
    throw new Error("useFootnoteContext must be used within a FootnoteProvider")
  }
  return context
}

export { FootnoteProvider, useFootnoteContext }
`}</CodeBlock>
        <p>
          The <code>Footnote</code> component simply executes the{" "}
          <code>addFootnote</code> function once. This is done via a ref, which
          is a pattern you can use to create a custom <code>useEffectOnce</code>{" "}
          hook.
          <Footnote>
            <div className="mb-4">
              Here is the code for that. You can thank me later. Just ignore
              that the ref is not put into the dependency array ;)
            </div>
            <CodeBlock language="typescript">{`export function useEffectOnce(fn: () => void) {
  const didRunRef = useRef(false)

  useEffect(() => {
    if (!didRunRef.current) {
      didRunRef.current = true
      fn()
    }
  }, [])
}`}</CodeBlock>
          </Footnote>{" "}
          I also added an id so we can link back to it from the footnotes
          section, as why wouldn’t we? This is an interactive medium after all,
          praise the hyperlink!
        </p>
        <CodeBlock
          className="md:-mx-8 md:px-8 -mx-4"
          language="typescript"
        >{`// components/Footnote.tsx

import React, { ReactNode, useRef, useEffect, useState } from "react"
import { useFootnoteContext } from "../context/FootnoteContext"

interface FootnoteProps {
  children: ReactNode
}

export const Footnote = ({ children }: FootnoteProps) => {
  const { addFootnote } = useFootnoteContext()
  const [footnoteNumber, setFootnoteNumber] = useState<number | undefined>(undefined)
  const hasAddedFootnote = useRef(false)

  useEffect(() => {
    if (!hasAddedFootnote.current) {
      hasAddedFootnote.current = true
      addFootnote(children as string).then((number) =>
        setFootnoteNumber(number),
      )
    }
  }, [children, addFootnote])

  if (footnoteNumber === undefined) return null

  return (
    <a href="#footnotes" id={\`footnote-\${footnoteNumber}\`}>
      <span className="text-sm text-orange-500 px-1 mr-1 hover:text-orange-700">
        {footnoteNumber}
      </span>
    </a>
  )
}
`}</CodeBlock>
        <p>
          As we now have a state full of nice footnotes, we should render them.
          For that we simply iterate over them, render the passed content for
          each footnote and add a back link to the footnote itself.
        </p>
        <CodeBlock
          className="md:-mx-8 md:px-8 -mx-4"
          language="typescript"
        >{`// components/Footnotes.tsx

export const Footnotes = () => {
  const { footnotes } = useFootnoteContext()

  if (footnotes.length === 0) {
    return null
  }

  return (
    <section>
      <h3 id="footnotes" className="text-xl mt-16 mb-4">
        Footnotes
      </h3>
      <ol className="blog">
        {footnotes.map((footnote, index) => (
          <li key={index}>
            {footnote}
            <a
              className="ml-1 px-1 text-orange-500"
              href={\`#footnote-\${index + 1}\`}
            >
              {"<-"}
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}`}</CodeBlock>
        <p>Lastly we have to bring it all together and actually use it.</p>
        <CodeBlock
          className="md:-mx-8 md:px-8 -mx-4"
          language="typescript"
        >{`// pages/blog-article.tsx

export default () => {
  return (
    <FootnoteProvider>
      <article>
        <section>
        Some content with a footnote <Footnote>I am the content of the footnote.</Footnote>.
        </section>
        <Footnotes />
      </article>
    </FootnoteProvider>
  )
}
`}</CodeBlock>
        <p>
          And that’s all! You can see this exact code on this blog. The
          footnotes are not statically rendered right now and will only show up
          when the JavaScript execution kicks in. That’s an improvement for the
          next iteration.
        </p>
      </BlogContent>
    </Container>
  )
}

export default Footnotes
