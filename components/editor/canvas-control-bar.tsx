"use client"

import { ZoomIn, ZoomOut, Maximize2, Undo, Redo } from "lucide-react"
import { useCanUndo, useCanRedo, useUndo, useRedo } from "@liveblocks/react"

interface ViewportActions {
  zoomIn: (opts?: { duration?: number }) => void
  zoomOut: (opts?: { duration?: number }) => void
  fitView: (opts?: { duration?: number }) => void
}

interface CanvasControlBarProps {
  reactFlowInstance: ViewportActions | null
}

export function CanvasControlBar({
  reactFlowInstance,
}: CanvasControlBarProps) {
  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const handleZoomIn = () => {
    reactFlowInstance?.zoomIn({ duration: 200 })
  }

  const handleZoomOut = () => {
    reactFlowInstance?.zoomOut({ duration: 200 })
  }

  const handleFitView = () => {
    reactFlowInstance?.fitView({ duration: 200 })
  }

  return (
    <div className="absolute bottom-16 left-4 z-[60]">
      <div className="flex items-center gap-1 rounded-full border border-border bg-elevated px-2.5 py-1.5 shadow-lg">
        <button
          type="button"
          onClick={handleZoomOut}
          className="flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleFitView}
          className="flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          aria-label="Fit view"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          className="flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center justify-center rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
