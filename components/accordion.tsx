import clsx from "clsx"
import { ReactNode, useState } from "react"

export const Accordion = ({
  children,
  title,
  initialOpen,
}: {
  title: ReactNode
  children: ReactNode
  initialOpen?: boolean
}) => {
  const [open, setOpen] = useState(initialOpen)

  return (
    <div
      className={clsx(
        "flex flex-col relative bg-slate-50 border-2 border-transparent border-slate-900 mt-8",
        {
          "p-6 py-8 border-black": open,
        },
      )}
    >
      <div
        onClick={() => setOpen(!open)}
        className="absolute -top-6 -left-4 bg-slate-50 p-2 font-black flex hover:underline hover:cursor-pointer"
      >
        {open ? "- " : "+ "}
        {title}
      </div>
      {open && <div>{children}</div>}
    </div>
  )
}
