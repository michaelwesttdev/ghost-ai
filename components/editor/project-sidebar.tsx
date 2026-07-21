"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Plus, X } from "lucide-react"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-sidebar transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Projects</h2>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close sidebar">
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
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">No projects yet</p>
          </div>
        </TabsContent>
        <TabsContent value="shared" className="flex flex-1 flex-col">
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">No shared projects</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t border-border p-3">
        <Button className="w-full gap-2">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>
    </aside>
  )
}
