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

type DatesAndLocationState = {
  step: "dates_and_location"
  fromDate: string
  toDate: string
  city: string
}

type CarPreferencesState = Omit<DatesAndLocationState, "step"> & {
  step: "car_preferences"
  transmission: "automatic" | "manual"
  seats: number
}

type CarSelectionState = Omit<CarPreferencesState, "step"> & {
  step: "car_selection"
  selectedCar: string | null
}

type RentalState =
  | DatesAndLocationState
  | CarPreferencesState
  | CarSelectionState

const RentCarFlow = () => {
  const [state, setState] = useState<RentalState>({
    step: "dates_and_location",
    fromDate: "",
    toDate: "",
    city: "",
  })

  const totalSteps = 3
  const currentStep = {
    dates_and_location: {
      step: 1,
      header: "Rental Dates and Location",
    },
    car_preferences: {
      step: 2,
      header: "Car Preferences",
    },
    car_selection: {
      step: 3,
      header: "Select Your Car",
    },
  }[state.step]

  const handleNext = () => {
    if (state.step === "dates_and_location") {
      setState({
        ...state,
        step: "car_preferences",
        transmission: "automatic",
        seats: 4,
      })
    } else if (state.step === "car_preferences") {
      setState({ ...state, step: "car_selection", selectedCar: null })
    }
  }

  const handleBack = () => {
    if (state.step === "car_selection") {
      const { selectedCar, ...previousState } = state
      setState({ ...previousState, step: "car_preferences" })
    } else if (state.step === "car_preferences") {
      const { transmission, seats, ...previousState } = state
      setState({ ...previousState, step: "dates_and_location" })
    }
  }

  return (
    <PseudoModal
      header={
        <div className="flex items-center">
          {state.step !== "dates_and_location" && (
            <button
              className="px-2 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md mr-4"
              onClick={handleBack}
            >
              {"Back"}
            </button>
          )}
          <div>{`Step ${currentStep.step}/${totalSteps}: ${currentStep.header}`}</div>
        </div>
      }
    >
      <div className="min-h-96">
        {(() => {
          switch (state.step) {
            case "dates_and_location":
              return (
                <div className="grid gap-4">
                  <div>
                    <label>From Date</label>
                    <input
                      type="date"
                      className="border border-black rounded-md p-1 w-full"
                      value={state.fromDate}
                      onChange={(e) =>
                        setState({
                          ...state,
                          fromDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>To Date</label>
                    <input
                      type="date"
                      className="border border-black rounded-md p-1 w-full"
                      value={state.toDate}
                      onChange={(e) =>
                        setState({
                          ...state,
                          toDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>City</label>
                    <input
                      className="border border-black rounded-md p-1 w-full"
                      value={state.city}
                      onChange={(e) =>
                        setState({
                          ...state,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )
            case "car_preferences":
              return (
                <div className="grid gap-4">
                  <div>
                    <label>Transmission</label>
                    <select
                      className="border border-black rounded-md p-1 w-full"
                      value={state.transmission}
                      onChange={(e) =>
                        setState({
                          ...state,
                          transmission: e.target.value as
                            | "automatic"
                            | "manual",
                        })
                      }
                    >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label>Number of Seats</label>
                    <input
                      type="number"
                      className="border border-black rounded-md p-1 w-full"
                      value={state.seats}
                      onChange={(e) =>
                        setState({
                          ...state,
                          seats: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )
            case "car_selection":
              return (
                <div className="grid gap-4">
                  <div>
                    <label>Select a Car</label>
                    <select
                      className="border border-black rounded-md p-1 w-full"
                      value={state.selectedCar || ""}
                      onChange={(e) =>
                        setState({
                          ...state,
                          selectedCar: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a car</option>
                      <option value="economy">Economy Car</option>
                      <option value="midsize">Midsize Car</option>
                      <option value="luxury">Luxury Car</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md"
                      onClick={() => console.log("Rental completed:", state)}
                    >
                      Complete Rental
                    </button>
                  </div>
                </div>
              )
          }
          return null
        })()}
      </div>
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
          We can use this modal now implement the user flow of renting a car.
          The modal has three steps now:
        </p>
        <ol className="ml-4 pl-4 list-outside list-decimal">
          <li>Rental dates and location</li>
          <li>Car preferences</li>
          <li>Select your car</li>
        </ol>
        <p>
          The user can see the progress as well as can go back to the previous
          screen. This is actually pretty close to what car rental companies
          process looks like.{" "}
          <Footnote>
            We'd just need to add some dark UX patterns and fear mongering to
            sell some pricey car insurances.
          </Footnote>
        </p>
        <div className="my-4">
          <RentCarFlow />
        </div>
        <p>
          This is nothing a developer would complain about, it is absolutely ok
          to do this. The problem arises if we want to create multiple
          variations of this. Let's say you are asked to add a state before.
        </p>
      </BlogContent>
    </Container>
  )
}

export default Footnotes
