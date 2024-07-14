const WorkSection = ({
  time,
  title,
  description,
}: {
  time: string
  title: string
  description: string
}) => (
  <div className="flex flex-col relative bg-slate-50 border-2 border-slate-900 p-6 py-8 mt-8">
    <div className="absolute -top-8 left-4 bg-slate-50 p-2 font-black">
      <div>
        <strong
          className="block"
          dangerouslySetInnerHTML={{ __html: title }}
        ></strong>
        <time className="block text-xs font-normal">{time}</time>
      </div>
    </div>
    <p dangerouslySetInnerHTML={{ __html: description }}></p>
  </div>
)

export default WorkSection
