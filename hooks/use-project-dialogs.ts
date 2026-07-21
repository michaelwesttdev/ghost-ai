"use client"

import { useState, useCallback, useMemo } from "react"
import type { Project } from "@/lib/types"

export type DialogType = "create" | "rename" | "delete" | null

export function useProjectDialogs() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const projectSlug = useMemo(() => {
    return projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }, [projectName])

  const openCreate = useCallback(() => {
    setActiveDialog("create")
    setProjectName("")
    setSelectedProject(null)
  }, [])

  const openRename = useCallback((project: Project) => {
    setActiveDialog("rename")
    setProjectName(project.name)
    setSelectedProject(project)
  }, [])

  const openDelete = useCallback((project: Project) => {
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

  return {
    activeDialog,
    selectedProject,
    projectName,
    projectSlug,
    isLoading,
    setProjectName,
    setIsLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialogs,
  }
}
