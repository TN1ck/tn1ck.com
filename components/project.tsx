import React from "react"

export interface Project {
  title: string
  year: string
  author: string
  video: string
  preview: string
}

const ProjectComponent = ({
  project,
  children,
}: {
  project: Project
  children: React.ReactNode
}) => (
  <div className="flex flex-col relative bg-slate-50 border-2 border-slate-900 p-6 py-8 mt-8">
    <div className="absolute -top-6 left-4 bg-slate-50 p-2 font-black">
      {project.title}
    </div>
    <video
      className="w-full border border-black border-2"
      loop
      muted
      poster={project.preview}
      controls
    >
      <source type="video/mp4" src={project.video} />
    </video>
    <div className="mt-4">{children}</div>
  </div>
)

export default ProjectComponent
