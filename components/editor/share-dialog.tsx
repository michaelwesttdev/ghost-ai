"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Copy, Check, X, User, Link } from "lucide-react"

interface Collaborator {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
  createdAt: string
}

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  projectId: string
}

export function ShareDialog({ open, onClose, projectId }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviting, setInviting] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchCollaborators = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      if (res.ok) {
        const data = await res.json()
        setCollaborators(data.collaborators)
        setIsOwner(data.isOwner)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) {
      fetchCollaborators()
      setInviteEmail("")
      setCopied(false)
    }
  }, [open, fetchCollaborators])

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      })
      if (res.ok) {
        setInviteEmail("")
        fetchCollaborators()
      }
    } catch {
    } finally {
      setInviting(false)
    }
  }

  const handleRemove = async (email: string) => {
    setRemoving(email)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        fetchCollaborators()
      }
    } catch {
    } finally {
      setRemoving(null)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inviteEmail.trim() && !inviting) {
      handleInvite()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            Invite collaborators to work on this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-subtle p-3">
            <div className="flex items-center gap-2">
              <Link className="size-4 shrink-0 text-copy-muted" />
              <span className="min-w-0 flex-1 truncate text-xs text-copy-secondary">
                {typeof window !== "undefined" ? window.location.href : ""}
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="size-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                disabled={!inviteEmail.trim() || inviting}
                onClick={handleInvite}
              >
                {inviting ? "Inviting..." : "Invite"}
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium text-copy-muted uppercase tracking-wider">
              Collaborators
            </p>
            {loading ? (
              <p className="text-sm text-copy-muted py-2">Loading...</p>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-copy-muted py-2">
                No collaborators yet{isOwner ? ". Invite someone above." : "."}
              </p>
            ) : (
              <div className="space-y-1">
                {collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-subtle"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-subtle border border-border">
                      {c.avatarUrl ? (
                        <img
                          src={c.avatarUrl}
                          alt=""
                          className="size-7 rounded-full"
                        />
                      ) : (
                        <User className="size-3.5 text-copy-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-copy-primary">
                        {c.displayName}
                      </p>
                      {c.displayName !== c.email && (
                        <p className="truncate text-xs text-copy-muted">
                          {c.email}
                        </p>
                      )}
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={removing === c.email}
                        onClick={() => handleRemove(c.email)}
                        aria-label={`Remove ${c.displayName}`}
                      >
                        <X className="size-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
