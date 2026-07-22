"use client"

import { memo, useState, useCallback, useRef, useEffect } from "react"
import {
  Handle,
  Position,
  NodeResizer,
  useReactFlow,
  type NodeProps,
  type NodeReplaceChange,
} from "@xyflow/react"
import type { CanvasNode } from "@/types/canvas"
import { useNodesChange } from "@/components/editor/nodes-change-context"

interface ShapeViewProps {
  shape: string
  color: string
  selected?: boolean
  width: number
  height: number
}

function CssShapeView({
  shape,
  color,
  selected,
  width,
  height,
}: ShapeViewProps) {
  const borderColor = selected ? "#00c8d4" : "rgba(255,255,255,0.15)"
  const isCircle = shape === "circle"
  const borderRadius = isCircle || shape === "pill" ? "9999px" : "8px"

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: color,
        borderRadius,
        border: `2px solid ${borderColor}`,
        width,
        height,
      }}
    />
  )
}

function SvgShapeView({
  shape,
  color,
  selected,
  width,
  height,
}: ShapeViewProps) {
  const strokeColor = selected ? "#00c8d4" : "rgba(255,255,255,0.15)"

  if (shape === "cylinder") {
    const topY = height * 0.1
    const bodyHeight = height * 0.8
    const rx = width / 2
    const ry = height * 0.1
    return (
      <svg
        className="absolute inset-0"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <rect
          x={0}
          y={topY}
          width={width}
          height={bodyHeight}
          fill={color}
          stroke={strokeColor}
          strokeWidth={2}
        />
        <ellipse
          cx={width / 2}
          cy={topY}
          rx={rx}
          ry={ry}
          fill={color}
          stroke={strokeColor}
          strokeWidth={2}
        />
        <ellipse
          cx={width / 2}
          cy={topY + bodyHeight}
          rx={rx}
          ry={ry}
          fill={color}
          stroke={strokeColor}
          strokeWidth={2}
        />
      </svg>
    )
  }

  const path =
    shape === "diamond"
      ? `M${width / 2},0 L${width},${height / 2} L${width / 2},${height} L0,${height / 2} Z`
      : `M${width / 2},0 L${width},${height * 0.25} L${width},${height * 0.75} L${width / 2},${height} L0,${height * 0.75} L0,${height * 0.25} Z`

  return (
    <svg
      className="absolute inset-0"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={path}
        fill={color}
        stroke={strokeColor}
        strokeWidth={2}
      />
    </svg>
  )
}

export function ShapeView({
  shape,
  color,
  selected,
  width,
  height,
}: ShapeViewProps) {
  const isSvgShape =
    shape === "diamond" || shape === "hexagon" || shape === "cylinder"

  if (isSvgShape) {
    return (
      <SvgShapeView
        shape={shape}
        color={color}
        selected={selected}
        width={width}
        height={height}
      />
    )
  }

  return (
    <CssShapeView
      shape={shape}
      color={color}
      selected={selected}
      width={width}
      height={height}
    />
  )
}

export const CanvasNodeRenderer = memo(function CanvasNodeRenderer({
  id,
  data,
  selected,
  width: nodeWidth,
  height: nodeHeight,
}: NodeProps<CanvasNode>) {
  const w = nodeWidth ?? 160
  const h = nodeHeight ?? 100
  const textColor = (data.textColor as string) || "#EDEDED"
  const onNodesChange = useNodesChange()
  const { getNode } = useReactFlow<CanvasNode>()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const autoGrow = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "0px"
    el.style.height = el.scrollHeight + "px"
  }, [])

  const commitEdit = useCallback(() => {
    setIsEditing(false)
    const label = textareaRef.current?.value ?? ""
    const node = getNode(id)
    if (!node) return
    const updatedNode: CanvasNode = { ...node, data: { ...node.data, label } }
    const change: NodeReplaceChange<CanvasNode> = { type: "replace", id, item: updatedNode }
    onNodesChange([change])
  }, [id, onNodesChange, getNode])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }, [])

  return (
    <div className="group relative flex h-full w-full items-center justify-center overflow-hidden">
      <NodeResizer
        minWidth={60}
        minHeight={30}
        isVisible={selected}
        color="#00c8d4"
        handleClassName="!w-2.5 !h-2.5 !border !border-[#00c8d4] !bg-[#18181c] !opacity-80"
        lineClassName="!border-[#00c8d4] !opacity-30"
      />
      <ShapeView
        shape={data.shape}
        color={data.color}
        selected={selected ?? false}
        width={w}
        height={h}
      />
      {isEditing ? (
        <div className="relative z-10 flex max-w-full overflow-hidden px-3 py-2">
          <textarea
            ref={textareaRef}
            className="w-full resize-none overflow-hidden bg-transparent text-center text-sm font-medium outline-none"
            style={{ color: textColor }}
            rows={1}
            defaultValue={data.label}
            onInput={autoGrow}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === "Escape") {
                cancelEdit()
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <span
          className="relative z-10 cursor-text px-4 py-2 text-center text-sm font-medium"
          style={{ color: textColor }}
          onDoubleClick={handleDoubleClick}
        >
          <span className="block max-w-full whitespace-pre-wrap break-words">
            {data.label || <span className="text-[#808090]">Label</span>}
          </span>
        </span>
      )}
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ width: 6, height: 6, backgroundColor: "#f0f0f4", border: "1.5px solid #2a2a30" }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ width: 6, height: 6, backgroundColor: "#f0f0f4", border: "1.5px solid #2a2a30" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ width: 6, height: 6, backgroundColor: "#f0f0f4", border: "1.5px solid #2a2a30" }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ width: 6, height: 6, backgroundColor: "#f0f0f4", border: "1.5px solid #2a2a30" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ width: 6, height: 6, backgroundColor: "#f0f0f4", border: "1.5px solid #2a2a30" }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ width: 6, height: 6, backgroundColor: "#f0f0f4", border: "1.5px solid #2a2a30" }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ width: 6, height: 6, backgroundColor: "#f0f0f4", border: "1.5px solid #2a2a30" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ width: 6, height: 6, backgroundColor: "#f0f0f4", border: "1.5px solid #2a2a30" }}
      />
    </div>
  )
})
