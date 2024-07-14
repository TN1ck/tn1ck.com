import { ReactNode, useState } from "react"
import clsx from "clsx"

export const TabComponent = ({
  tabs,
  content,
}: {
  tabs: ReactNode[]
  content: ReactNode[]
}) => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <div className="flex gap-2 flex-col md:flex-row border border-black border-2 p-2">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={clsx("py-2 px-4 text-sm hover:cursor-pointer", {
              "bg-black text-white": i === activeTab,
              "bg-transparent text-black": i !== activeTab,
            })}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{content[activeTab]}</div>
    </div>
  )
}
