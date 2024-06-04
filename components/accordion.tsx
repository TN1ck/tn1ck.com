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
    <div className="bg-gray-100 shadow-sm my-4">
      <div
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex text-lg hover:cursor-pointer hover:bg-gray-200 p-4",
          {
            "pb-8": open,
          },
        )}
      >
        <div className="mr-2">{open ? "▼" : "▶"}</div>
        {title}
      </div>
      {open && <div>{children}</div>}
    </div>
  )
}
