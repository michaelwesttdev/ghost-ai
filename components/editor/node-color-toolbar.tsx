"use client"

import { memo, useMemo } from "react"
import { useStore } from "@xyflow/react"
import type { CanvasNode } from "@/types/canvas"
import { NODE_COLORS, DEFAULT_NODE_COLOR } from "@/types/canvas"

interface NodeColorToolbarProps {
  selectedNode: CanvasNode
  onColorChange: (nodeId: string, fill: string, text: string) => void
}

function getSwatchGlow(textColor: string): string {
  return `0 0 6px 2px ${textColor}40`
}

export const NodeColorToolbar = memo(function NodeColorToolbar({
  selectedNode,
  onColorChange,
}: NodeColorToolbarProps) {
  const transform = useStore((s) => s.transform)
  const [viewportX, viewportY, zoom] = transform ?? [0, 0, 1]

  const { position, width, height, data } = selectedNode
  const nodeW = width ?? 160
  const nodeH = height ?? 100

  const screenNodeX = position.x * zoom + viewportX
  const screenNodeY = position.y * zoom + viewportY
  const screenNodeW = nodeW * zoom

  const toolbarCenterX = screenNodeX + screenNodeW / 2
  const toolbarY = screenNodeY - 44

  const currentFill = data.color
  const currentText = (data.textColor as string) || DEFAULT_NODE_COLOR.text

  const swatches = useMemo(
    () =>
      NODE_COLORS.map((color) => {
        const isActive = currentFill === color.fill
        return { ...color, isActive }
      }),
    [currentFill],
  )

  return (
    <div
      className="absolute z-50 flex items-center gap-[3px] rounded-xl bg-[#18181c] px-2 py-1.5 shadow-lg"
      style={{
        left: toolbarCenterX,
        top: toolbarY,
        transform: "translateX(-50%)",
        pointerEvents: "auto",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {swatches.map((color) => (
        <button
          key={color.label}
          className="h-5 w-5 rounded-full transition-all duration-150"
          style={{
            backgroundColor: color.fill,
            border: color.isActive
              ? `2px solid ${color.text}`
              : "2px solid transparent",
            boxShadow: color.isActive
              ? `0 0 0 1px ${color.text}80`
              : undefined,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.boxShadow = getSwatchGlow(color.text)
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.boxShadow = color.isActive
              ? `0 0 0 1px ${color.text}80`
              : ""
          }}
          onClick={(e) => {
            e.stopPropagation()
            onColorChange(selectedNode.id, color.fill, color.text)
          }}
          title={color.label}
        />
      ))}
    </div>
  )
})
