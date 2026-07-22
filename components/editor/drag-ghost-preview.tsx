"use client"

import { ShapeView } from "@/components/editor/canvas-node"

interface DragGhostPreviewProps {
  shape: string
  width: number
  height: number
  x: number
  y: number
  color: string
}

export function DragGhostPreview({
  shape,
  width,
  height,
  x,
  y,
  color,
}: DragGhostPreviewProps) {
  return (
    <div
      className="pointer-events-none fixed z-[100] opacity-70"
      style={{
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <ShapeView
          shape={shape}
          color={color}
          width={width}
          height={height}
        />
      </div>
    </div>
  )
}
