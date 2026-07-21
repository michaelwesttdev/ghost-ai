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

interface CreateProjectDialogProps {
  open: boolean
  onClose: () => void
  projectName: string
  projectSlug: string
  onNameChange: (name: string) => void
  isLoading: boolean
}

export function CreateProjectDialog({
  open,
  onClose,
  projectName,
  projectSlug,
  onNameChange,
  isLoading,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Give your new project a name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            placeholder="Project name"
            value={projectName}
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
          />
          <p className="text-xs text-copy-muted">
            Slug: /{projectSlug || "enter-a-name"}
          </p>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button disabled={!projectName.trim() || isLoading}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
