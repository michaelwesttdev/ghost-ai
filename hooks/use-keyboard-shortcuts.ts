"use client"

import { useEffect } from "react"
interface ViewportActions {
  zoomIn: (opts?: { duration?: number }) => void
  zoomOut: (opts?: { duration?: number }) => void
  fitView: (opts?: { duration?: number }) => void
}

interface UseKeyboardShortcutsOptions {
  reactFlowInstance: ViewportActions | null
  undo: () => void
  redo: () => void
}

export function useKeyboardShortcuts({
  reactFlowInstance,
  undo,
  redo,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      if (
        tagName === "input" ||
        tagName === "textarea" ||
        target.isContentEditable
      ) {
        return
      }

      const isMod = event.metaKey || event.ctrlKey

      if (isMod) {
        switch (event.key.toLowerCase()) {
          case "z":
            event.preventDefault()
            if (event.shiftKey) {
              redo()
            } else {
              undo()
            }
            return
          case "y":
            event.preventDefault()
            redo()
            return
        }
        return
      }

      switch (event.key) {
        case "+":
        case "=":
          event.preventDefault()
          reactFlowInstance?.zoomIn({ duration: 200 })
          return
        case "-":
          event.preventDefault()
          reactFlowInstance?.zoomOut({ duration: 200 })
          return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [reactFlowInstance, undo, redo])
}
