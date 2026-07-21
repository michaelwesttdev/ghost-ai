"use client"

import { useState } from "react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

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
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreate={() => {}}
          onRename={() => {}}
          onDelete={() => {}}
          currentRoomId={roomId}
        />
        <div className="flex flex-1">
          <div className="flex flex-1 items-center justify-center bg-[#1a1a1a]">
            <p className="text-sm text-muted-foreground">
              Select an element to edit
            </p>
          </div>
          {aiSidebarOpen && (
            <aside className="flex w-80 flex-col border-l border-border bg-elevated">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold text-foreground">AI Chat</h2>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </aside>
          )}
        </div>
      </div>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        projectId={project.id}
      />
    </div>
  )
}
