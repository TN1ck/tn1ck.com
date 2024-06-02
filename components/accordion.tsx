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
    <div className="my-2 bg-gray-100 p-4 shadow-sm hover:cursor-pointer hover:bg-gray-200">
      <div onClick={() => setOpen(!open)} className="flex text-lg">
        <div className="mr-2">{open ? "▼" : "▶"}</div>
        {title}
      </div>
      {open && <div className="-m-4 mt-4">{children}</div>}
    </div>
  )
}
