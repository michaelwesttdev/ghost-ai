"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import type { CanvasNode } from "@/types/canvas"

function getShapeStyles(
  shape: string,
  selected: boolean,
): React.CSSProperties {
  const borderColor = selected ? "#00c8d4" : "rgba(255,255,255,0.15)"

  switch (shape) {
    case "diamond":
      return {
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        boxShadow: `0 0 0 2px ${borderColor}`,
      }
    case "hexagon":
      return {
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        boxShadow: `0 0 0 2px ${borderColor}`,
      }
    case "circle":
      return {
        borderRadius: "9999px",
        border: `2px solid ${borderColor}`,
      }
    case "pill":
      return {
        borderRadius: "9999px",
        border: `2px solid ${borderColor}`,
      }
    case "cylinder":
      return {
        borderRadius: "9999px / 30%",
        border: `2px solid ${borderColor}`,
      }
    default:
      return {
        borderRadius: "8px",
        border: `2px solid ${borderColor}`,
      }
  }
}

export const CanvasNodeRenderer = memo(function CanvasNodeRenderer({
  data,
  selected,
}: NodeProps<CanvasNode>) {
  const isCircle = data.shape === "circle"
  const shapeStyles = getShapeStyles(data.shape, selected)

  return (
    <div
      className="flex items-center justify-center overflow-hidden px-4 py-2"
      style={{
        backgroundColor: data.color || "#1F1F1F",
        color: "#EDEDED",
        minWidth: "120px",
        minHeight: isCircle ? "120px" : "60px",
        width: "100%",
        height: "100%",
        ...shapeStyles,
      }}
    >
      <span className="select-none text-center text-sm font-medium">
        {data.label}
      </span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
})
