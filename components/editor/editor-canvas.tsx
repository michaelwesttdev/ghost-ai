"use client"

import { useCallback, useRef } from "react"
import {
  ReactFlow,
  Background,
  MiniMap,
  BackgroundVariant,
  type NodeAddChange,
} from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"
import { DEFAULT_NODE_COLOR } from "@/types/canvas"
import { CanvasNodeRenderer } from "@/components/editor/canvas-node"
import { ShapePanel, SHAPES } from "@/components/editor/shape-panel"

import "@xyflow/react/dist/base.css"

const nodeTypes = {
  canvasNode: CanvasNodeRenderer,
} as const

export function EditorCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      nodes: { initial: [] },
      edges: { initial: [] },
      suspense: true,
    })

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const shape = event.dataTransfer.getData("application/ghost-shape")
      if (!shape) return

      const width = event.dataTransfer.getData(
        "application/ghost-shape-width",
      )
      const height = event.dataTransfer.getData(
        "application/ghost-shape-height",
      )

      const rect = wrapperRef.current?.getBoundingClientRect()
      if (!rect) return

      const nodeWidth = width ? Number(width) : 120
      const nodeHeight = height ? Number(height) : 80

      const newNode: CanvasNode = {
        id: crypto.randomUUID(),
        type: "canvasNode",
        position: {
          x: event.clientX - rect.left - nodeWidth / 2,
          y: event.clientY - rect.top - nodeHeight / 2,
        },
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR.fill,
          shape,
        },
        width: nodeWidth,
        height: nodeHeight,
      }

      const addChange: NodeAddChange<CanvasNode> = {
        type: "add",
        item: newNode,
      }

      onNodesChange([addChange])
    },
    [onNodesChange],
  )

  const handleAddShape = useCallback(
    (shape: string) => {
      const rect = wrapperRef.current?.getBoundingClientRect()
      if (!rect) return

      const shapeDef = SHAPES.find((s) => s.shape === shape)
      const nodeWidth = shapeDef?.defaultWidth ?? 120
      const nodeHeight = shapeDef?.defaultHeight ?? 80

      const newNode: CanvasNode = {
        id: crypto.randomUUID(),
        type: "canvasNode",
        position: {
          x: rect.width / 2 - nodeWidth / 2,
          y: rect.height / 2 - nodeHeight / 2,
        },
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR.fill,
          shape,
        },
        width: nodeWidth,
        height: nodeHeight,
      }

      const addChange: NodeAddChange<CanvasNode> = {
        type: "add",
        item: newNode,
      }

      onNodesChange([addChange])
    },
    [onNodesChange],
  )

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full bg-base"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        style={
          { "--xy-background-color": "transparent" } as React.CSSProperties
        }
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#444"
          bgColor="transparent"
        />
        <MiniMap />
      </ReactFlow>
      <ShapePanel onAddShape={handleAddShape} />
    </div>
  )
}
