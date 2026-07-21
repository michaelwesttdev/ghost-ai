"use client"

import { useState } from "react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { EditorHome } from "@/components/editor/editor-home"
import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectData } from "@/lib/data/projects"

interface EditorShellProps {
  ownedProjects: ProjectData[]
  sharedProjects: ProjectData[]
}

export function EditorShell({ ownedProjects, sharedProjects }: EditorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <div className="flex h-dvh flex-col">
      <EditorNavbar
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />
      <div className="relative flex flex-1">
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreate={actions.openCreate}
          onRename={actions.openRename}
          onDelete={actions.openDelete}
        />
        <EditorHome onCreateProject={actions.openCreate} />
      </div>

      <CreateProjectDialog
        open={actions.activeDialog === "create"}
        onClose={actions.closeDialogs}
        projectName={actions.projectName}
        roomId={actions.roomId}
        onNameChange={actions.setProjectName}
        isLoading={actions.isLoading}
        onCreate={actions.handleCreate}
      />
      <RenameProjectDialog
        open={actions.activeDialog === "rename"}
        onClose={actions.closeDialogs}
        project={actions.selectedProject}
        projectName={actions.projectName}
        onNameChange={actions.setProjectName}
        isLoading={actions.isLoading}
        onRename={actions.handleRename}
      />
      <DeleteProjectDialog
        open={actions.activeDialog === "delete"}
        onClose={actions.closeDialogs}
        project={actions.selectedProject}
        isLoading={actions.isLoading}
        onDelete={actions.handleDelete}
      />
    </div>
  )
}
