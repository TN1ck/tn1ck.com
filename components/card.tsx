import clsx from "clsx"
import React from "react"

export const Card = ({
  title,
  children,
  bgColor = "bg-slate-50",
  padding = "py-4 px-4",
  margin = "mt-8",
}: {
  title: React.ReactNode
  children: React.ReactNode
  bgColor?: string
  padding?: string
  margin?: string
}) => (
  <div
    className={clsx(
      "flex flex-col relative border-2 border-slate-900",
      margin,
      padding,
      bgColor,
    )}
  >
    <div className={clsx("absolute -top-6 left-4 p-2 font-black", bgColor)}>
      {title}
    </div>
    {/* Add the content again, so that the layout is always correct (especially with word breaks).. */}
    <div className="opacity-0">{title}</div>
    <div className="-mt-6">{children}</div>
  </div>
)
