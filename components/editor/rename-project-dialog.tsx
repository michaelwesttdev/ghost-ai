"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ProjectData } from "@/lib/data/projects"

interface RenameProjectDialogProps {
  open: boolean
  onClose: () => void
  project: ProjectData | null
  projectName: string
  onNameChange: (name: string) => void
  isLoading: boolean
  onRename: () => void
}

export function RenameProjectDialog({
  open,
  onClose,
  project,
  projectName,
  onNameChange,
  isLoading,
  onRename,
}: RenameProjectDialogProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && projectName.trim() && !isLoading) {
      onRename()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription>
            Rename &ldquo;{project?.name}&rdquo; to something new.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Project name"
          value={projectName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            disabled={!projectName.trim() || isLoading}
            onClick={onRename}
          >
            {isLoading ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
