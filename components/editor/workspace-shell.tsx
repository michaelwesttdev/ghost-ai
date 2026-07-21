"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { CanvasProvider } from "@/components/editor/canvas-provider"
import { EditorCanvas } from "@/components/editor/editor-canvas"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectData } from "@/lib/data/projects"
import type { Project } from "@/lib/types"

interface WorkspaceShellProps {
  project: Project
  roomId: string
  ownedProjects: ProjectData[]
  sharedProjects: ProjectData[]
}

export function WorkspaceShell({
  project,
  roomId,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const {
    activeDialog,
    selectedProject,
    projectName,
    roomId: newProjectRoomId,
    isLoading,
    setProjectName,
    openCreate,
    openRename,
    openDelete,
    closeDialogs,
    handleCreate,
    handleRename,
    handleDelete: baseHandleDelete,
  } = useProjectActions()

  const handleDelete = useCallback(async () => {
    const deletingCurrent = selectedProject?.id === project.id
    await baseHandleDelete()
    if (deletingCurrent) {
      router.push("/editor")
    }
  }, [selectedProject, project.id, baseHandleDelete, router])

  return (
    <div className="flex h-dvh flex-col">
      <EditorNavbar
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        title={project.name}
        showShare
        onShare={() => setShareOpen(true)}
        showAiSidebar
        isAiSidebarOpen={aiSidebarOpen}
        onToggleAiSidebar={() => setAiSidebarOpen((v) => !v)}
      />
      <div className="relative flex flex-1 overflow-hidden">
        <CanvasProvider roomId={roomId}>
          <EditorCanvas />
        </CanvasProvider>

        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreate={openCreate}
          onRename={openRename}
          onDelete={openDelete}
          currentRoomId={roomId}
        />

        {aiSidebarOpen && (
          <aside className="absolute right-0 top-0 z-40 flex h-full w-80 flex-col border-l border-border bg-elevated shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">AI Chat</h2>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </aside>
        )}
      </div>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        projectId={project.id}
      />

      <CreateProjectDialog
        open={activeDialog === "create"}
        onClose={closeDialogs}
        projectName={projectName}
        roomId={newProjectRoomId}
        onNameChange={setProjectName}
        isLoading={isLoading}
        onCreate={handleCreate}
      />

      <RenameProjectDialog
        open={activeDialog === "rename"}
        onClose={closeDialogs}
        project={selectedProject}
        projectName={projectName}
        onNameChange={setProjectName}
        isLoading={isLoading}
        onRename={handleRename}
      />

      <DeleteProjectDialog
        open={activeDialog === "delete"}
        onClose={closeDialogs}
        project={selectedProject}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  )
}
