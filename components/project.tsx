import React from "react"
import { Card } from "./card"

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
  <Card title={project.title} padding="py-8 px-6">
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
  </Card>
)

export default ProjectComponent
