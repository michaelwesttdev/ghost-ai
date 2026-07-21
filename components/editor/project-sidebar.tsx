"use client"

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
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onCreate,
  onRename,
  onDelete,
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
                    className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/50"
                  >
                    <span className="truncate text-sm text-foreground">
                      {project.name}
                    </span>
                    <div className="hidden items-center gap-0.5 group-hover:flex">
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
                    className="flex items-center rounded-lg px-3 py-2"
                  >
                    <span className="truncate text-sm text-foreground">
                      {project.name}
                    </span>
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
