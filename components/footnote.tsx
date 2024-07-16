// components/Footnote.tsx

import React, { ReactNode, useRef, useEffect, useState } from "react"
import { useFootnoteContext } from "../context/FootnoteContext"

interface FootnoteProps {
  children: ReactNode
}

export const Footnote = ({ children }: FootnoteProps) => {
  const { addFootnote } = useFootnoteContext()
  const [footnoteNumber, setFootnoteNumber] = useState<number | undefined>(
    undefined,
  )
  const hasAddedFootnote = useRef(false)

  useEffect(() => {
    if (!hasAddedFootnote.current) {
      hasAddedFootnote.current = true
      addFootnote(children as string).then((number) =>
        setFootnoteNumber(number),
      )
    }
  }, [children, addFootnote])

  if (footnoteNumber === null) return null

  return (
    <a href="#footnotes" id={`footnote-${footnoteNumber}`}>
      <span className="text-sm text-orange-500 border-orange-500 border px-1 mr-1 hover:text-orange-700 hover:bg-slate-200">
        {footnoteNumber}
      </span>
    </a>
  )
}
