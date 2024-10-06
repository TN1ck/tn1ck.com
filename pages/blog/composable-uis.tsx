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
  title: "Compose UIs to keep you sane & productive",
  description: "",
  date: "2024-09-29",
  slug: "composable-uis",
}

const PseudoModal = ({
  header,
  children,
}: {
  header: React.ReactNode
  children: React.ReactNode
}) => {
  return (
    <div className="border-black border-2 bg-white">
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
  selectedCar: string
}

type RentalCompleteState = Omit<CarSelectionState, "step"> & {
  step: "rental_complete"
}

const DatesAndLocationStep: React.FC<{
  state: DatesAndLocationState
  setState: (newState: DatesAndLocationState) => void
  onNext: () => void
}> = ({ state, setState, onNext }) => (
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
        onClick={onNext}
      >
        Next
      </button>
    </div>
  </div>
)

const CarPreferencesStep: React.FC<{
  state: CarPreferencesState
  setState: (newState: CarPreferencesState) => void
  onNext: () => void
}> = ({ state, setState, onNext }) => (
  <div className="grid gap-4">
    <div>
      <label>Transmission</label>
      <select
        className="border border-black rounded-md p-1 w-full"
        value={state.transmission}
        onChange={(e) =>
          setState({
            ...state,
            transmission: e.target.value as "automatic" | "manual",
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
        onClick={onNext}
      >
        Next
      </button>
    </div>
  </div>
)

const CarSelectionStep: React.FC<{
  state: CarSelectionState
  setState: (newState: CarSelectionState) => void
  onNext: () => void
}> = ({ state, setState, onNext }) => (
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
        onClick={onNext}
      >
        Complete Rental
      </button>
    </div>
  </div>
)

const RentalCompleteStep: React.FC<{
  state: RentalCompleteState
  restart: () => void
}> = ({ state, restart }) => (
  <div className="grid gap-4">
    <div>
      <label className="text-lg">Rental Complete</label>
      <div className="mt-4">
        Thank you for renting a {state.selectedCar} car with{" "}
        {state.transmission} transmission and {state.seats} seats from{" "}
        {state.fromDate} to {state.toDate} in {state.city}
      </div>
    </div>
    <div className="flex justify-end">
      <button
        className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md"
        onClick={restart}
      >
        Rent another car
      </button>
    </div>
  </div>
)

type RentalState =
  | DatesAndLocationState
  | CarPreferencesState
  | CarSelectionState
  | RentalCompleteState

const RentCarFlow = () => {
  const [state, setState] = useState<RentalState>({
    step: "dates_and_location",
    fromDate: "2027-06-26",
    toDate: "2027-06-29",
    city: "Berlin",
  })

  const totalSteps = 4
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
    rental_complete: {
      step: 4,
      header: "Rental Complete",
    },
  }[state.step]

  const handleNext = () => {
    switch (state.step) {
      case "dates_and_location":
        setState({
          ...state,
          step: "car_preferences",
          transmission: "automatic",
          seats: 4,
        })
        break
      case "car_preferences":
        setState({ ...state, step: "car_selection", selectedCar: "economy" })
        break
      case "car_selection":
        setState({ ...state, step: "rental_complete" })
        break
    }
  }

  const handleBack = () => {
    switch (state.step) {
      case "car_selection":
        const { selectedCar, ...previousStateCarSelection } = state
        setState({ ...previousStateCarSelection, step: "car_preferences" })
        break
      case "car_preferences":
        const { transmission, seats, ...previousStateCarPreferences } = state
        setState({ ...previousStateCarPreferences, step: "dates_and_location" })
        break
      case "rental_complete":
        setState({ ...state, step: "car_selection" })
        break
    }
  }

  const handleRestart = () => {
    setState({
      step: "dates_and_location",
      fromDate: "2027-06-26",
      toDate: "2027-06-29",
      city: "Berlin",
    })
  }

  return (
    <PseudoModal
      header={
        <div className="flex items-center">
          {["car_preferences", "car_selection"].includes(state.step) && (
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
        {state.step === "dates_and_location" && (
          <DatesAndLocationStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "car_preferences" && (
          <CarPreferencesStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "car_selection" && (
          <CarSelectionStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "rental_complete" && (
          <RentalCompleteStep state={state} restart={handleRestart} />
        )}
      </div>
    </PseudoModal>
  )
}

const DiscountScreen = ({ onNext }: { onNext: () => void }) => {
  return (
    <div>
      <div className="text-lg">
        You get a discount because you are a corporate customer.
      </div>
      <div className="flex justify-end">
        <button
          className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md mt-4"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}

type DiscountState = {
  step: "discount"
}

type RentalStateNew =
  | DiscountState
  | DatesAndLocationState
  | CarPreferencesState
  | CarSelectionState
  | RentalCompleteState

const RentCarFlowWithInitialDiscountScreen = () => {
  const [state, setState] = useState<RentalStateNew>({
    step: "discount",
  })

  const totalSteps = 5
  const currentStep = {
    discount: {
      step: 1,
      header: "Discount",
    },
    dates_and_location: {
      step: 2,
      header: "Rental Dates and Location",
    },
    car_preferences: {
      step: 3,
      header: "Car Preferences",
    },
    car_selection: {
      step: 4,
      header: "Select Your Car",
    },
    rental_complete: {
      step: 5,
      header: "Rental Complete",
    },
  }[state.step]

  const handleNext = () => {
    switch (state.step) {
      case "discount":
        setState({
          step: "dates_and_location",
          fromDate: "2027-06-26",
          toDate: "2027-06-29",
          city: "Berlin",
        })
        break
      case "dates_and_location":
        setState({
          ...state,
          step: "car_preferences",
          transmission: "automatic",
          seats: 4,
        })
        break
      case "car_preferences":
        setState({ ...state, step: "car_selection", selectedCar: "economy" })
        break
      case "car_selection":
        setState({ ...state, step: "rental_complete" })
        break
    }
  }

  const handleBack = () => {
    switch (state.step) {
      case "dates_and_location":
        setState({
          step: "discount",
        })
        break
      case "car_selection":
        const { selectedCar, ...previousStateCarSelection } = state
        setState({ ...previousStateCarSelection, step: "car_preferences" })
        break
      case "car_preferences":
        const { transmission, seats, ...previousStateCarPreferences } = state
        setState({ ...previousStateCarPreferences, step: "dates_and_location" })
        break
      case "rental_complete":
        setState({ ...state, step: "car_selection" })
        break
    }
  }

  const handleRestart = () => {
    setState({
      step: "dates_and_location",
      fromDate: "2027-06-26",
      toDate: "2027-06-29",
      city: "Berlin",
    })
  }

  return (
    <PseudoModal
      header={
        <div className="flex items-center">
          {["dates_and_location", "car_preferences", "car_selection"].includes(
            state.step,
          ) && (
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
        {state.step === "discount" && <DiscountScreen onNext={handleNext} />}
        {state.step === "dates_and_location" && (
          <DatesAndLocationStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "car_preferences" && (
          <CarPreferencesStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "car_selection" && (
          <CarSelectionStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "rental_complete" && (
          <RentalCompleteStep state={state} restart={handleRestart} />
        )}
      </div>
    </PseudoModal>
  )
}

const DiscountModal = ({ onNext }: { onNext: () => void }) => {
  return (
    <PseudoModal header="Discount">
      <div className="text-lg">
        You get a discount because you are a corporate customer.
      </div>
      <div className="flex justify-end">
        <button
          className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md mt-4"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </PseudoModal>
  )
}

const DiscountModalFlow = () => {
  const [step, setStep] = useState<"discount" | "rental">("discount")
  return (
    <div>
      <button
        className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md mt-4"
        onClick={() => setStep("discount")}
      >
        Reset to discount
      </button>
      <div className="mt-4">
        {step === "discount" && (
          <DiscountModal onNext={() => setStep("rental")} />
        )}
        {step === "rental" && <RentCarFlow />}
      </div>
    </div>
  )
}

const Footnotes: NextPage = () => {
  return (
    <Container activeId="blog">
      <BlogContent metadata={metadata}>
        <p>
          Creating the best user interfaces translates to the best user
          experience, which then <i>can</i> translate to an apps success. Which
          is why frontend developers and UX designers spend their waking hours
          crafting the best experiences (at least I hope they do).
        </p>
        <p>
          With everything, there are compromises in building UIs, perfection is
          unattainable (especially on the web) and certain UI patterns can be
          not worth implementing when their implementation complexity is
          considered.
        </p>
        <p>
          In this post I want to present the notion of "composing" UIs.
          Composing means that we use independent UI blocks / flows that we link
          together to create the different user journeys. At the the other
          spectrum is to create a distinct and optimal user experience for each
          user journey.
        </p>
        <p>
          We explore this using a rather complex UI pattern, that of a modal
          flow. A modal flow is a multi-step user journey that happens in a
          modal.{" "}
          <Footnote>
            Also called Dialoge, Popups etc. A modal is a UI that appears on top
            of everything and normally contains one specific user flow.
          </Footnote>
          They are a great tool to simplify the process for a user and, as with
          every modal, are easy to be used across the whole application. The
          issue arises when we want to customize a modal flow for a new user
          journey.
        </p>
        {/* <p>
          UX Designers <s>always</s> normally want to provide the best
          experience to the user, developers strive for simplicity as they have
          to maintain whatever beast the UX team designed. This ever going fight
          between these two camps will never end, but as a developer myself I
          want to provide a reference on why certain UX patterns are really hard
          to implement on the web and should be skipped if they are not
          absolutely crucial. This time we look at modal flows and what
          annoyances they bring.
        </p> */}
        <h2>Example: Rent a car modal flow</h2>
        <p>
          Below we see a simple modal component. We skip all the normally
          complicated parts, e.g., rendering it above everything and managing
          the visible state. The important part is that modals have a header and
          a body, which is what makes it also especially hard to reuse parts of
          a modal flow - the header and body are visually linked, but have to be
          kept separate in code. The code for the examples is below and written
          in React; reading it is not necessary to understand this blog post.
        </p>
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

        <Accordion title="Code of the pseudo modal">
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
        <p>
          We can use this modal now to implement the user flow of renting a car.
          The modal has four steps now:
        </p>
        <ol className="ml-4 pl-4 list-outside list-decimal">
          <li>Rental dates and location</li>
          <li>Car preferences</li>
          <li>Select your car</li>
          <li>Rental complete</li>
        </ol>
        <p>
          The user can see the progress as well as go back to the previous
          screen. This is actually pretty close to what car rental companies'
          processes look like.{" "}
          <Footnote>
            We'd just need to add some dark UX patterns and fear-mongering to
            sell some pricey car insurances.
          </Footnote>
        </p>
        <div className="my-4">
          <RentCarFlow />
        </div>
        <Accordion title={`Code of the "rent a car" modal`}>
          <CodeBlock language="typescript">
            {`type DatesAndLocationState = {
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
  selectedCar: string
}

type RentalCompleteState = Omit<CarSelectionState, "step"> & {
  step: "rental_complete"
}

const DatesAndLocationStep: React.FC<{
  state: DatesAndLocationState
  setState: (newState: DatesAndLocationState) => void
  onNext: () => void
}> = ({ state, setState, onNext }) => (
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
        onClick={onNext}
      >
        Next
      </button>
    </div>
  </div>
)

const CarPreferencesStep: React.FC<{
  state: CarPreferencesState
  setState: (newState: CarPreferencesState) => void
  onNext: () => void
}> = ({ state, setState, onNext }) => (
  <div className="grid gap-4">
    <div>
      <label>Transmission</label>
      <select
        className="border border-black rounded-md p-1 w-full"
        value={state.transmission}
        onChange={(e) =>
          setState({
            ...state,
            transmission: e.target.value as "automatic" | "manual",
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
        onClick={onNext}
      >
        Next
      </button>
    </div>
  </div>
)

const CarSelectionStep: React.FC<{
  state: CarSelectionState
  setState: (newState: CarSelectionState) => void
  onNext: () => void
}> = ({ state, setState, onNext }) => (
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
        onClick={onNext}
      >
        Complete Rental
      </button>
    </div>
  </div>
)

const RentalCompleteStep: React.FC<{
  state: RentalCompleteState
  restart: () => void
}> = ({ state, restart }) => (
  <div className="grid gap-4">
    <div>
      <label className="text-lg">Rental Complete</label>
      <div className="mt-4">
        Thank you for renting a {state.selectedCar} car with{" "}
        {state.transmission} transmission and {state.seats} seats from{" "}
        {state.fromDate} to {state.toDate} in {state.city}
      </div>
    </div>
    <div className="flex justify-end">
      <button
        className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md"
        onClick={restart}
      >
        Rent another car
      </button>
    </div>
  </div>
)

type RentalState =
  | DatesAndLocationState
  | CarPreferencesState
  | CarSelectionState
  | RentalCompleteState

const RentCarFlow = () => {
  const [state, setState] = useState<RentalState>({
    step: "dates_and_location",
    fromDate: "2027-06-26",
    toDate: "2027-06-29",
    city: "Berlin",
  })

  const totalSteps = 4
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
    rental_complete: {
      step: 4,
      header: "Rental Complete",
    },
  }[state.step]

  const handleNext = () => {
    switch (state.step) {
      case "dates_and_location":
        setState({
          ...state,
          step: "car_preferences",
          transmission: "automatic",
          seats: 4,
        })
        break
      case "car_preferences":
        setState({ ...state, step: "car_selection", selectedCar: "economy" })
        break
      case "car_selection":
        setState({ ...state, step: "rental_complete" })
        break
    }
  }

  const handleBack = () => {
    switch (state.step) {
      case "car_selection":
        const { selectedCar, ...previousStateCarSelection } = state
        setState({ ...previousStateCarSelection, step: "car_preferences" })
        break
      case "car_preferences":
        const { transmission, seats, ...previousStateCarPreferences } = state
        setState({ ...previousStateCarPreferences, step: "dates_and_location" })
        break
      case "rental_complete":
        setState({ ...state, step: "car_selection" })
        break
    }
  }

  const handleRestart = () => {
    setState({
      step: "dates_and_location",
      fromDate: "2027-06-26",
      toDate: "2027-06-29",
      city: "Berlin",
    })
  }

  return (
    <PseudoModal
      header={
        <div className="flex items-center">
          {["car_preferences", "car_selection"].includes(state.step) && (
            <button
              className="px-2 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md mr-4"
              onClick={handleBack}
            >
              {"Back"}
            </button>
          )}
          <div>{\`Step \${currentStep.step}/\${totalSteps}: \${currentStep.header}\`}</div>
        </div>
      }
    >
      <div className="min-h-96">
        {state.step === "dates_and_location" && (
          <DatesAndLocationStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "car_preferences" && (
          <CarPreferencesStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "car_selection" && (
          <CarSelectionStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "rental_complete" && (
          <RentalCompleteStep state={state} restart={handleRestart} />
        )}
      </div>
    </PseudoModal>
  )
}`}
          </CodeBlock>
        </Accordion>

        <p>
          You implement this and all is good, this was easy enough. You are now
          tasked to add an option to this flow:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            Extend the flow with an optional discount screen. It will be shown
            as the first step of the flow when it should show.
          </li>
        </ul>
        <p>
          The UX team, in their pursuit to create the most optimal user
          experience, found that <i>extending</i> the existing modal flow will
          exactly do that. They put the optional discount screen at the
          beginning of the user journey and have it tightly integrated with the
          existing one.
        </p>
        <div className="my-4">
          <RentCarFlowWithInitialDiscountScreen />
        </div>
        <Accordion
          title={`Code of the "rent a car with discount screen" modal flow`}
        >
          <CodeBlock language="typescript">{`type DiscountState = {
  step: "discount"
}

type RentalStateNew =
  | DiscountState
  | DatesAndLocationState
  | CarPreferencesState
  | CarSelectionState
  | RentalCompleteState

const RentCarFlowWithInitialDiscountScreen = () => {
  const [state, setState] = useState<RentalStateNew>({
    step: "discount",
  })

  const totalSteps = 5
  const currentStep = {
    discount: {
      step: 1,
      header: "Discount",
    },
    dates_and_location: {
      step: 2,
      header: "Rental Dates and Location",
    },
    car_preferences: {
      step: 3,
      header: "Car Preferences",
    },
    car_selection: {
      step: 4,
      header: "Select Your Car",
    },
    rental_complete: {
      step: 5,
      header: "Rental Complete",
    },
  }[state.step]

  const handleNext = () => {
    switch (state.step) {
      case "discount":
        setState({
          step: "dates_and_location",
          fromDate: "2027-06-26",
          toDate: "2027-06-29",
          city: "Berlin",
        })
        break
      case "dates_and_location":
        setState({
          ...state,
          step: "car_preferences",
          transmission: "automatic",
          seats: 4,
        })
        break
      case "car_preferences":
        setState({ ...state, step: "car_selection", selectedCar: "economy" })
        break
      case "car_selection":
        setState({ ...state, step: "rental_complete" })
        break
    }
  }

  const handleBack = () => {
    switch (state.step) {
      case "dates_and_location":
        setState({
          step: "discount",
        })
        break
      case "car_selection":
        const { selectedCar, ...previousStateCarSelection } = state
        setState({ ...previousStateCarSelection, step: "car_preferences" })
        break
      case "car_preferences":
        const { transmission, seats, ...previousStateCarPreferences } = state
        setState({ ...previousStateCarPreferences, step: "dates_and_location" })
        break
      case "rental_complete":
        setState({ ...state, step: "car_selection" })
        break
    }
  }

  const handleRestart = () => {
    setState({
      step: "dates_and_location",
      fromDate: "2027-06-26",
      toDate: "2027-06-29",
      city: "Berlin",
    })
  }

  return (
    <PseudoModal
      header={
        <div className="flex items-center">
          {["dates_and_location", "car_preferences", "car_selection"].includes(
            state.step,
          ) && (
            <button
              className="px-2 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md mr-4"
              onClick={handleBack}
            >
              {"Back"}
            </button>
          )}
          <div>{\`Step \${currentStep.step}/\${totalSteps}: \${currentStep.header}\`}</div>
        </div>
      }
    >
      <div className="min-h-96">
        {state.step === "discount" && <DiscountScreen onNext={handleNext} />}
        {state.step === "dates_and_location" && (
          <DatesAndLocationStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "car_preferences" && (
          <CarPreferencesStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "car_selection" && (
          <CarSelectionStep
            state={state}
            setState={setState}
            onNext={handleNext}
          />
        )}
        {state.step === "rental_complete" && (
          <RentalCompleteStep state={state} restart={handleRestart} />
        )}
      </div>
    </PseudoModal>
  )
}`}</CodeBlock>
        </Accordion>
        <p>
          This design wants us to <i>extend</i> the existing flow. The
          difficulties of implementing this design are that we cannot reuse the
          existing component without modifying it, as:
        </p>
        <ul className="ml-4 pl-4 list-outside list-disc">
          <li>
            The header shows the steps and the total steps and the number for
            each step changed.
          </li>
          <li>
            The back button is shown on the dates & location page, whereas it
            previously was not. It also links back to the discount screen.
          </li>
          <li>
            Modals themselves are basically "contained" UIs, we can not change a
            modal UI without changing the component itself.
          </li>
        </ul>
        <p>
          These are of course not insurmountable issues, but it makes a
          developer stop and wonder what's the best way to extend the existing
          flow to achieve this.
        </p>
        <p>
          We have the following options to implement the design:
          <Footnote>
            We could go completely rogue and create an abstraction for modal
            flows. Can't be too hard, right? We have a list of steps and one can
            go back and forth. As with every abstraction, it works until it
            doesn't work, e.g., when we have to implement a non-linear flow.
            This is not a real option in my opinion, except if creating
            different user flows is your core business.
          </Footnote>{" "}
        </p>
        <ol className="ml-4 pl-4 list-outside list-decimal">
          <li>
            <strong>Extend the existing flow</strong>
            <br />
            We can extend our existing component with a new state and screen and
            one can toggle either mode. Implementation wise, this comes at a big
            cost. It increases the complexity of the component, opens up to
            risks of introducing bugs and it would be hard to remove this added
            capability if business decides that the discount screen is not
            something we want to offer anymore.
          </li>
          <li>
            <strong>Refactor & reuse for a new component</strong>
            <br />
            We create components for all steps of the existing modal and reuse
            them in a new component. This will keep the modal components simple,
            but we have a lot of code repitition and now two components that
            need testing. Every time we change one of the pages, we have to make
            sure we handle that correct in either version. In this instance,
            it's an OK solution and can be seen in the code above, it is the
            right approach when lots of variations or variations that greatly
            differ have to be implemented and it has to be this exact UX.
          </li>
          <li>
            <strong>
              Create a new UI component and compose it with the modal
            </strong>
            <br />
            Instead of extending the existing modal, we create a new modal that
            only shows the discount screen. When clicking "Next", it closes
            itself and opens the existing modal.{" "}
            <strong>
              This is the easiest and most satisfying to implement.
            </strong>{" "}
            We do not have to change the existing modal (or its tests),
            potentially introducing bugs and increasing complexity. It's also
            the easiest solution to delete, which is great if we don't know if
            the discount flow is actually something we want to keep.
          </li>
        </ol>
        <p>
          Here is an example implementation of the third "compose UIs" option.
          The difference is that the discount step is not part of the progress
          anymore, also that one cannot go back to the discount as the new
          component doesn't know about it.{" "}
          <Footnote>
            The "back" button could be implemented with relative ease though,
            but it would feel glitchy as the modal would disappear and reappear.
          </Footnote>{" "}
          If these were actual modals, we would also see the discount modal
          closing and the rent car modal opening, which might feel slightly
          jarring. So the user experience is definitely degraded, but only so
          much, that nobody would mind, the journey itself is the same.
        </p>
        <div className="my-4">
          <DiscountModalFlow />
        </div>

        <Accordion
          title={`Code of the "rent a car" modal flow with discount screen`}
        >
          <CodeBlock language="typescript">{`const DiscountModal = ({ onNext }: { onNext: () => void }) => {
  return (
    <PseudoModal header="Discount">
      <div className="text-lg">
        You get a discount because you are a corporate customer.
      </div>
      <div className="flex justify-end">
        <button
          className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-black border border-black rounded-md mt-4"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </PseudoModal>
  )
}

const DiscountModalFlow = () => {
  const [step, setStep] = useState<"discount" | "rental">("discount")
  return (
    <div>
      <div className="mt-4">
        {step === "discount" && (
          <DiscountModal onNext={() => setStep("rental")} />
        )}
        {step === "rental" && <RentCarFlow />}
      </div>
    </div>
  )
}`}</CodeBlock>
        </Accordion>
        <p>
          The code necessary to achieve this is almost trivial and most
          importantly we didn't have to change the existing component, keeping
          us safe from regression bugs and leaving more room to work on other
          features.
        </p>
        <h2>Conclusion</h2>
        <p>
          Creating composable UIs over creating custom ones for each user
          journey is easier to develop and maintain. When it is an option, I
          would always recommend of going for it. This does not mean that custom
          (and more perfect) UIs should not be done, but they should only be
          used when it's worth it e.g. it's part of the core user journey.
        </p>
      </BlogContent>
    </Container>
  )
}

export default Footnotes
