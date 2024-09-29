/* eslint-disable react/no-unescaped-entities */
import { NextPage, Metadata } from "next"
import Container from "../../components/container"
import { Author, BlogContent } from "../../components/blog"
import { CodeBlock } from "../../components/code-block"
import Head from "next/head"
import { Footnote } from "../../components/footnote"
import React, { useState } from "react"
import { Accordion } from "../../components/accordion"

export const metadata = {
  title: "Hard to implement UX patterns: Shared modal flows",
  description: "",
  date: "2024-09-29",
  slug: "hard-to-implement-ux-patterns",
}

const PseudoModal = ({
  header,
  children,
}: {
  header: React.ReactNode
  children: React.ReactNode
}) => {
  return (
    <div className="border-black border-2">
      <div className="flex justify-between p-4 border-b-2 border-black">
        <div className="text-lg">{header}</div>
        <button className="px-2 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md">
          {"Close"}
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

type ProductState = {
  step: "basic_information"
  productId: string
  productName: string
}

const AddProductSimple = () => {
  const [state, setState] = useState<ProductState>({
    step: "basic_information",
    productId: "",
    productName: "",
  })

  const totalSteps = 3
  const currentStep = {
    basic_information: {
      step: 1,
      header: "Basic product information",
    },
  }[state.step]

  return (
    <PseudoModal
      header={`Step ${currentStep.step}/${totalSteps}: ${currentStep.header}`}
    >
      {(() => {
        switch (state.step) {
          case "basic_information":
            return (
              <div className="grid gap-4">
                <div>
                  <label>Product identifier</label>
                  <input
                    className="border border-black rounded-md p-1 w-full"
                    value={state.productId}
                    onChange={(e) =>
                      setState({
                        ...state,
                        productId: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Product name</label>
                  <input
                    className="border border-black rounded-md p-1 w-full"
                    value={state.productName}
                    onChange={(e) =>
                      setState({
                        ...state,
                        productName: e.target.value,
                      })
                    }
                  />
                </div>
                <button className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md">
                  Next
                </button>
              </div>
            )
        }
        return null
      })()}
    </PseudoModal>
  )
}

const Footnotes: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <p>
          UX Designers <s>always</s> normally want to provide the best
          experience to the user, developers strive for simplicity as they have
          to maintain whatever beast the UX team designed. This ever going fight
          between these two camps will never end, but as a developer myself I
          want to provide a reference on why certain UX patterns are really hard
          to implement on the web and should be skipped if they are not
          absolutely crucial. This time we look at modal flows and what
          annoyances they bring.
        </p>
        <h2>Shared modal flows</h2>
        <p>
          Modals are amazing to share UI flows all throughout the app. They only
          become annoying if their flows overlap or their complexity becomes too
          great. Let's start with a simple example as that makes the point the
          most clear.
        </p>
        <p>
          Below we see a simple Modal component. We skip all the normally
          complicated parts e.g. rendering it above everything and managing the
          visible state. This post is not about that.
        </p>
        <Accordion title="Code of the PseudoModal">
          <CodeBlock language="typescript">
            {`const PseudoModal = ({
  header,
  children,
}: {
  header: React.ReactNode
  children: React.ReactNode
}) => {
  return (
    <div className="border-black border-2">
      <div className="flex justify-between p-4 border-b-2 border-black">
        <div className="text-lg">{header}</div>
        <button className="px-2 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md">
          {"Close"}
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}`}
          </CodeBlock>
        </Accordion>
        <div className="my-8">
          <PseudoModal header="Header of the modal">
            <div className="grid gap-4">
              <div>This is my Modal body. Anything could be in here.</div>
              <button className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md">
                {"This is a button"}
              </button>
            </div>
          </PseudoModal>
        </div>
        <p>
          We can use this Modal now to implement a user flow of a supermarket,
          where the user can add a product to the inventory. The scenario is
          made up and we are not here to discuss the usefulness of the UX here.
        </p>
        <div className="my-4">
          <AddProductSimple />
        </div>
      </BlogContent>
    </Container>
  )
}

export default Footnotes
