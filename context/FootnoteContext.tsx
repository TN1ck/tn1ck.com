// context/FootnoteContext.tsx

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

  const addFootnote = async (content: string) => {
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
