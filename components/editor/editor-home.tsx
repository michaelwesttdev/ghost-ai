"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EditorHomeProps {
  onCreateProject: () => void
}

export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 bg-base">
      <h1 className="text-xl font-medium text-copy-primary">
        Create a project or open an existing one
      </h1>
      <p className="text-sm text-copy-muted">
        Start a new architecture workspace, or choose a project from the
        sidebar.
      </p>
      <Button onClick={onCreateProject} className="gap-2">
        <Plus className="size-4" />
        New Project
      </Button>
    </main>
  )
}
