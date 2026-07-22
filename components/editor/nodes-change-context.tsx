"use client"

import { createContext, useContext } from "react"
import type { OnNodesChange } from "@xyflow/react"
import type { CanvasNode } from "@/types/canvas"

const NodesChangeContext = createContext<OnNodesChange<CanvasNode> | null>(null)

export function NodesChangeProvider({
  onNodesChange,
  children,
}: {
  onNodesChange: OnNodesChange<CanvasNode>
  children: React.ReactNode
}) {
  return (
    <NodesChangeContext.Provider value={onNodesChange}>
      {children}
    </NodesChangeContext.Provider>
  )
}

export function useNodesChange(): OnNodesChange<CanvasNode> {
  const ctx = useContext(NodesChangeContext)
  if (!ctx) {
    throw new Error("useNodesChange must be used within a NodesChangeProvider")
  }
  return ctx
}
