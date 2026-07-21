"use client"

import { useCallback, memo } from "react"
import {
  Square,
  Diamond,
  Circle,
  Pill,
  Cylinder,
  Hexagon,
} from "lucide-react"

export interface ShapeItem {
  shape: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  defaultWidth: number
  defaultHeight: number
}

export const SHAPES: ShapeItem[] = [
  { shape: "rectangle", label: "Rectangle", icon: Square, defaultWidth: 160, defaultHeight: 100 },
  { shape: "diamond", label: "Diamond", icon: Diamond, defaultWidth: 140, defaultHeight: 140 },
  { shape: "circle", label: "Circle", icon: Circle, defaultWidth: 120, defaultHeight: 120 },
  { shape: "pill", label: "Pill", icon: Pill, defaultWidth: 160, defaultHeight: 80 },
  { shape: "cylinder", label: "Cylinder", icon: Cylinder, defaultWidth: 120, defaultHeight: 140 },
  { shape: "hexagon", label: "Hexagon", icon: Hexagon, defaultWidth: 140, defaultHeight: 120 },
]

interface ShapePanelProps {
  onAddShape: (shape: string) => void
}

export function ShapePanel({ onAddShape }: ShapePanelProps) {
  return (
    <div className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-border bg-elevated px-3 py-2 shadow-lg">
        {SHAPES.map((item) => (
          <ShapeButton key={item.shape} item={item} onAddShape={onAddShape} />
        ))}
      </div>
    </div>
  )
}

const ShapeButton = memo(function ShapeButton({
  item,
  onAddShape,
}: {
  item: ShapeItem
  onAddShape: (shape: string) => void
}) {
  const Icon = item.icon

  const handleClick = useCallback(() => {
    onAddShape(item.shape)
  }, [item.shape, onAddShape])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onAddShape(item.shape)
      }
    },
    [item.shape, onAddShape],
  )

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData("application/ghost-shape", item.shape)
      e.dataTransfer.setData(
        "application/ghost-shape-width",
        String(item.defaultWidth),
      )
      e.dataTransfer.setData(
        "application/ghost-shape-height",
        String(item.defaultHeight),
      )
      e.dataTransfer.effectAllowed = "copy"
    },
    [item],
  )

  return (
    <button
      type="button"
      draggable
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragStart={handleDragStart}
      className="flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      aria-label={`Add ${item.label}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
})
