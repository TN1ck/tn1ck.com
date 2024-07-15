import clsx from "clsx"

export const Card = ({
  title,
  children,
  bgColor: bgColor = "bg-slate-50",
}: {
  title: string
  children: React.ReactNode
  bgColor?: string
}) => (
  <div
    className={clsx(
      "flex flex-col relative border-2 border-slate-900 py-4 px-4 mt-8",
      bgColor,
    )}
  >
    <div className={clsx("absolute -top-6 left-4 p-2 font-black", bgColor)}>
      <strong
        className="block"
        dangerouslySetInnerHTML={{ __html: title }}
      ></strong>
    </div>
    {children}
  </div>
)
