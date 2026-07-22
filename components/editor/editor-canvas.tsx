"use client"

import { useCallback, useRef, useState, forwardRef, useImperativeHandle } from "react"
import {
  ReactFlow,
  Background,
  MiniMap,
  BackgroundVariant,
  MarkerType,
  type NodeAddChange,
  type NodeReplaceChange,
  type ReactFlowInstance,
} from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { useUndo, useRedo } from "@liveblocks/react"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"
import { DEFAULT_NODE_COLOR } from "@/types/canvas"
import { CanvasNodeRenderer } from "@/components/editor/canvas-node"
import { CanvasEdgeRenderer } from "@/components/editor/canvas-edge"
import { EdgesChangeProvider } from "@/components/editor/edges-change-context"
import { NodeColorToolbar } from "@/components/editor/node-color-toolbar"
import { DragGhostPreview } from "@/components/editor/drag-ghost-preview"
import { ShapePanel, SHAPES } from "@/components/editor/shape-panel"
import { NodesChangeProvider } from "@/components/editor/nodes-change-context"
import { CanvasControlBar } from "@/components/editor/canvas-control-bar"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import type { CanvasTemplate } from "@/components/editor/starter-templates"

import "@xyflow/react/dist/base.css"

export interface EditorCanvasHandle {
  importTemplate: (template: CanvasTemplate) => void
}

interface DragState {
  shape: string
  width: number
  height: number
  x: number
  y: number
  color: string
}

const nodeTypes = {
  canvasNode: CanvasNodeRenderer,
} as const

const edgeTypes = {
  canvasEdge: CanvasEdgeRenderer,
} as const

export const EditorCanvas = forwardRef<EditorCanvasHandle, object>(
  function EditorCanvas(_props: object, ref) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null)
  const reactFlowInstanceRef = useRef(reactFlowInstance)
  reactFlowInstanceRef.current = reactFlowInstance

  const undo = useUndo()
  const redo = useRedo()

  useKeyboardShortcuts({ reactFlowInstance, undo, redo })

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      nodes: { initial: [] },
      edges: { initial: [] },
      suspense: true,
    })

  const nodesRef = useRef(nodes)
  nodesRef.current = nodes
  const edgesRef = useRef(edges)
  edgesRef.current = edges
  const onNodesChangeRef = useRef(onNodesChange)
  onNodesChangeRef.current = onNodesChange
  const onEdgesChangeRef = useRef(onEdgesChange)
  onEdgesChangeRef.current = onEdgesChange

  useImperativeHandle(
    ref,
    () => ({
      importTemplate(template: CanvasTemplate) {
        const currentNodes = nodesRef.current
        const currentEdges = edgesRef.current

        if (currentNodes.length > 0) {
          onNodesChangeRef.current(
            currentNodes.map((n) => ({ type: "remove" as const, id: n.id })),
          )
        }
        if (currentEdges.length > 0) {
          onEdgesChangeRef.current(
            currentEdges.map((e) => ({ type: "remove" as const, id: e.id })),
          )
        }

        const idMap = new Map<string, string>()
        for (const n of template.nodes) {
          idMap.set(n.id, crypto.randomUUID())
        }

        onNodesChangeRef.current(
          template.nodes.map((n) => ({
            type: "add" as const,
            item: { ...n, id: idMap.get(n.id)! },
          })),
        )
        onEdgesChangeRef.current(
          template.edges.map((e) => ({
            type: "add" as const,
            item: {
              ...e,
              id: crypto.randomUUID(),
              source: idMap.get(e.source)!,
              target: idMap.get(e.target)!,
            },
          })),
        )

        requestAnimationFrame(() => {
          reactFlowInstanceRef.current?.fitView({ duration: 200 })
        })
      },
    }),
    [],
  )

  const selectedNode = nodes.find((n) => n.selected) ?? null

  const handleColorChange = useCallback(
    (nodeId: string, fill: string, text: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      const updatedNode: CanvasNode = {
        ...node,
        data: { ...node.data, color: fill, textColor: text },
      }

      const change: NodeReplaceChange<CanvasNode> = {
        type: "replace",
        id: nodeId,
        item: updatedNode,
      }

      onNodesChange([change])
    },
    [nodes, onNodesChange],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDragStart = useCallback((event: React.DragEvent) => {
    const shape = event.dataTransfer.getData("application/ghost-shape")
    if (!shape) return

    const width =
      Number(
        event.dataTransfer.getData("application/ghost-shape-width"),
      ) || 120
    const height =
      Number(
        event.dataTransfer.getData("application/ghost-shape-height"),
      ) || 80

    setDragState({
      shape,
      width,
      height,
      x: event.clientX,
      y: event.clientY,
      color: DEFAULT_NODE_COLOR.fill,
    })
  }, [])

  const handleDrag = useCallback((event: React.DragEvent) => {
    if (event.clientX === 0 && event.clientY === 0) return
    setDragState((prev) => {
      if (!prev) return null
      if (prev.x === event.clientX && prev.y === event.clientY) return prev
      return { ...prev, x: event.clientX, y: event.clientY }
    })
  }, [])

  const clearDrag = useCallback(() => {
    setDragState(null)
  }, [])

  const handleDragEnd = useCallback(() => {
    clearDrag()
  }, [clearDrag])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      clearDrag()

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
          textColor: DEFAULT_NODE_COLOR.text,
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
    [onNodesChange, clearDrag],
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
          textColor: DEFAULT_NODE_COLOR.text,
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
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <NodesChangeProvider onNodesChange={onNodesChange}>
        <EdgesChangeProvider onEdgesChange={onEdgesChange}>
          <ReactFlow<CanvasNode, CanvasEdge>
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={(instance) => setReactFlowInstance(instance)}
            defaultEdgeOptions={{
              type: "canvasEdge",
              style: {
                stroke: "#808090",
                strokeWidth: 1.5,
                strokeLinecap: "round",
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#808090",
                width: 12,
                height: 8,
              },
            }}
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
            {selectedNode && (
              <NodeColorToolbar
                selectedNode={selectedNode}
                onColorChange={handleColorChange}
              />
            )}
          </ReactFlow>
        </EdgesChangeProvider>
      </NodesChangeProvider>
      <CanvasControlBar reactFlowInstance={reactFlowInstance} />
      <ShapePanel onAddShape={handleAddShape} />
      {dragState && (
        <DragGhostPreview
          shape={dragState.shape}
          width={dragState.width}
          height={dragState.height}
          x={dragState.x}
          y={dragState.y}
          color={dragState.color}
        />
      )}
    </div>
  )
}
)
