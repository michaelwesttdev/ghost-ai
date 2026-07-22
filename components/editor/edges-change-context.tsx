"use client"

import { createContext, useContext } from "react"
import type { OnEdgesChange } from "@xyflow/react"
import type { CanvasEdge } from "@/types/canvas"

const EdgesChangeContext = createContext<OnEdgesChange<CanvasEdge> | null>(null)

export function EdgesChangeProvider({
  onEdgesChange,
  children,
}: {
  onEdgesChange: OnEdgesChange<CanvasEdge>
  children: React.ReactNode
}) {
  return (
    <EdgesChangeContext.Provider value={onEdgesChange}>
      {children}
    </EdgesChangeContext.Provider>
  )
}

export function useEdgesChange(): OnEdgesChange<CanvasEdge> {
  const ctx = useContext(EdgesChangeContext)
  if (!ctx) {
    throw new Error("useEdgesChange must be used within an EdgesChangeProvider")
  }
  return ctx
}
