"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { ProjectData } from "@/lib/data/projects"

export type DialogType = "create" | "rename" | "delete" | null

export function useProjectActions() {
  const router = useRouter()
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slug = useMemo(() => {
    return projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }, [projectName])

  const roomSuffix = useMemo(() => {
    return Math.random().toString(36).substring(2, 6)
  }, [activeDialog])

  const roomId = slug ? `${slug}-${roomSuffix}` : ""

  const openCreate = useCallback(() => {
    setActiveDialog("create")
    setProjectName("")
    setSelectedProject(null)
  }, [])

  const openRename = useCallback((project: ProjectData) => {
    setActiveDialog("rename")
    setProjectName(project.name)
    setSelectedProject(project)
  }, [])

  const openDelete = useCallback((project: ProjectData) => {
    setActiveDialog("delete")
    setSelectedProject(project)
    setProjectName("")
  }, [])

  const closeDialogs = useCallback(() => {
    setActiveDialog(null)
    setSelectedProject(null)
    setProjectName("")
    setIsLoading(false)
  }, [])

  const handleCreate = useCallback(async () => {
    if (!projectName.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName.trim(), id: roomId }),
      })
      if (!res.ok) throw new Error("Failed to create project")
      const { project } = await res.json()
      closeDialogs()
      router.push(`/editor/${project.id}`)
    } catch {
      setIsLoading(false)
    }
  }, [projectName, roomId, router, closeDialogs])

  const handleRename = useCallback(async () => {
    if (!projectName.trim() || !selectedProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName.trim() }),
      })
      if (!res.ok) throw new Error("Failed to rename project")
      closeDialogs()
      router.refresh()
    } catch {
      setIsLoading(false)
    }
  }, [projectName, selectedProject, router, closeDialogs])

  const handleDelete = useCallback(async () => {
    if (!selectedProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      closeDialogs()
      router.refresh()
    } catch {
      setIsLoading(false)
    }
  }, [selectedProject, router, closeDialogs])

  return {
    activeDialog,
    selectedProject,
    projectName,
    projectSlug: slug,
    roomId,
    isLoading,
    setProjectName,
    openCreate,
    openRename,
    openDelete,
    closeDialogs,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
