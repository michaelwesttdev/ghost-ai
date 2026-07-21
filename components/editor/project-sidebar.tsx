"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Plus, X, Pencil, Trash2 } from "lucide-react"
import type { ProjectData } from "@/lib/data/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: ProjectData[]
  sharedProjects: ProjectData[]
  onCreate: () => void
  onRename: (project: ProjectData) => void
  onDelete: (project: ProjectData) => void
  currentRoomId?: string
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onCreate,
  onRename,
  onDelete,
  currentRoomId,
}: ProjectSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-sidebar transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
          <div className="px-4 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="my-projects" className="flex flex-1 flex-col">
            {ownedProjects.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No projects yet
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
                {ownedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/50",
                      project.id === currentRoomId && "bg-muted"
                    )}
                  >
                    <Link
                      href={`/editor/${project.id}`}
                      className="min-w-0 flex-1"
                    >
                      <span className="block truncate text-sm text-foreground">
                        {project.name}
                      </span>
                    </Link>
                    <div
                      className={cn(
                        "flex items-center gap-0.5 transition-opacity duration-150",
                        "opacity-0 pointer-events-none",
                        "group-hover:opacity-100 group-hover:pointer-events-auto",
                        "group-focus-within:opacity-100 group-focus-within:pointer-events-auto"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onRename(project)}
                        aria-label={`Rename ${project.name}`}
                      >
                        <Pencil className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onDelete(project)}
                        aria-label={`Delete ${project.name}`}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="shared" className="flex flex-1 flex-col">
            {sharedProjects.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No shared projects
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
                {sharedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "rounded-lg px-3 py-2 hover:bg-muted/50",
                      project.id === currentRoomId && "bg-muted"
                    )}
                  >
                    <Link
                      href={`/editor/${project.id}`}
                      className="block"
                    >
                      <span className="block truncate text-sm text-foreground">
                        {project.name}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-border p-3">
          <Button className="w-full gap-2" onClick={onCreate}>
            <Plus className="size-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
