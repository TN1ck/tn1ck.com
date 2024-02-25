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
  <div className="p-4 bg-white shadow-lg rounded-sm">
    {/* {showYear ? <h2>{project.attributes.year}</h2> : null} */}
    <div className="post">
      <video className="w-full" loop muted poster={project.preview} controls>
        <source type="video/mp4" src={project.video} />
      </video>
      <h3 className="text-lg font-bold mt-8 mb-2">{project.title}</h3>
      <div className="leading-7">{children}</div>
    </div>
  </div>
)

export default ProjectComponent
