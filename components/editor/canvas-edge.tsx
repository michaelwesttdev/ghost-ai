"use client"

import { memo, useCallback, useRef, useState } from "react"
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
  type EdgeReplaceChange,
} from "@xyflow/react"
import type { CanvasEdge } from "@/types/canvas"
import { useEdgesChange } from "@/components/editor/edges-change-context"

export const CanvasEdgeRenderer = memo(function CanvasEdgeRenderer({
  id,
  source,
  target,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  selected,
  data,
}: EdgeProps<CanvasEdge>) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const onEdgesChange = useEdgesChange()

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const edgeOpacity = selected ? 0.9 : isHovered ? 0.7 : 0.3
  const edgeColor = "#808090"

  const commitEdit = useCallback(() => {
    setIsEditing(false)
    const label = editValue.trim()
    const change: EdgeReplaceChange<CanvasEdge> = {
      type: "replace",
      id,
      item: {
        id,
        type: "canvasEdge",
        source,
        target,
        data: { ...(data ?? {}), label: label || undefined },
      } as CanvasEdge,
    }
    onEdgesChange([change])
  }, [id, source, target, data, editValue, onEdgesChange])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditValue("")
  }, [])

  const startEditing = useCallback(() => {
    setEditValue((data?.label as string) || "")
    setIsEditing(true)
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }, [data])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation()
      if (e.key === "Enter") {
        commitEdit()
      } else if (e.key === "Escape") {
        cancelEdit()
      }
    },
    [commitEdit, cancelEdit],
  )

  const label = data?.label as string | undefined

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={startEditing}
      />
      <BaseEdge
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth: 1.5,
          strokeLinecap: "round",
          opacity: edgeOpacity,
          transition: "opacity 0.15s ease",
        }}
      />
      {isEditing ? (
        <EdgeLabelRenderer>
          <div
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: labelX, top: labelY }}
          >
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded-md border border-[#00c8d4] bg-[#18181c] px-2 py-0.5 text-xs text-[#f0f0f4] outline-none"
              style={{
                minWidth: 60,
                width: Math.max(60, editValue.length * 8 + 16),
              }}
            />
          </div>
        </EdgeLabelRenderer>
      ) : (
        (label || (selected && !label)) && (
          <EdgeLabelRenderer>
            <div
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: labelX, top: labelY }}
            >
              {label ? (
                <span className="rounded-full border border-[#2a2a30] bg-[#18181c] px-2 py-0.5 text-xs text-[#c0c0cc]">
                  {label}
                </span>
              ) : (
                <span
                  className="cursor-pointer rounded-md px-2 py-0.5 text-xs text-[#505060]"
                  onDoubleClick={startEditing}
                >
                  Label
                </span>
              )}
            </div>
          </EdgeLabelRenderer>
        )
      )}
    </>
  )
})
