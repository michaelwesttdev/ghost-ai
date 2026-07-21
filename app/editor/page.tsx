"use client"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { EditorHome } from "@/components/editor/editor-home"
import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { useState } from "react"

export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

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
          onCreate={dialogs.openCreate}
          onRename={dialogs.openRename}
          onDelete={dialogs.openDelete}
        />
        <EditorHome onCreateProject={dialogs.openCreate} />
      </div>

      <CreateProjectDialog
        open={dialogs.activeDialog === "create"}
        onClose={dialogs.closeDialogs}
        projectName={dialogs.projectName}
        projectSlug={dialogs.projectSlug}
        onNameChange={dialogs.setProjectName}
        isLoading={dialogs.isLoading}
      />
      <RenameProjectDialog
        open={dialogs.activeDialog === "rename"}
        onClose={dialogs.closeDialogs}
        project={dialogs.selectedProject}
        projectName={dialogs.projectName}
        onNameChange={dialogs.setProjectName}
        isLoading={dialogs.isLoading}
      />
      <DeleteProjectDialog
        open={dialogs.activeDialog === "delete"}
        onClose={dialogs.closeDialogs}
        project={dialogs.selectedProject}
        isLoading={dialogs.isLoading}
      />
    </div>
  )
}
