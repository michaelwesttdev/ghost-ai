"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Import } from "lucide-react"
import type { CanvasTemplate } from "@/components/editor/starter-templates"
import { CANVAS_TEMPLATES } from "@/components/editor/starter-templates"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"

interface StarterTemplatesModalProps {
  open: boolean
  onClose: () => void
  onImport: (template: CanvasTemplate) => void
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const { nodes, edges } = template

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const node of nodes) {
    const w = node.width ?? 140
    const h = node.height ?? 60
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + w)
    maxY = Math.max(maxY, node.position.y + h)
  }

  const padding = 20
  const boundsW = maxX - minX + padding * 2
  const boundsH = maxY - minY + padding * 2

  const viewW = 280
  const viewH = 160
  const scale = Math.min(viewW / boundsW, viewH / boundsH, 2)
  const offsetX = (viewW - boundsW * scale) / 2
  const offsetY = (viewH - boundsH * scale) / 2

  function tx(x: number, y: number) {
    return {
      x: (x - minX + padding) * scale + offsetX,
      y: (y - minY + padding) * scale + offsetY,
    }
  }

  function centerOf(node: CanvasNode) {
    const w = node.width ?? 140
    const h = node.height ?? 60
    return tx(node.position.x + w / 2, node.position.y + h / 2)
  }

  function renderNodeShape(node: CanvasNode) {
    const w = (node.width ?? 140) * scale
    const h = (node.height ?? 60) * scale
    const pos = tx(node.position.x, node.position.y)
    const shape = node.data.shape
    const color = node.data.color
    const stroke = "rgba(255,255,255,0.15)"

    if (shape === "diamond") {
      const d = `M${pos.x + w / 2},${pos.y} L${pos.x + w},${pos.y + h / 2} L${pos.x + w / 2},${pos.y + h} L${pos.x},${pos.y + h / 2} Z`
      return <path key={node.id} d={d} fill={color} stroke={stroke} strokeWidth={1} />
    }

    if (shape === "hexagon") {
      const d = `M${pos.x + w / 2},${pos.y} L${pos.x + w},${pos.y + h * 0.25} L${pos.x + w},${pos.y + h * 0.75} L${pos.x + w / 2},${pos.y + h} L${pos.x},${pos.y + h * 0.75} L${pos.x},${pos.y + h * 0.25} Z`
      return <path key={node.id} d={d} fill={color} stroke={stroke} strokeWidth={1} />
    }

    if (shape === "cylinder") {
      const topY = pos.y + h * 0.1
      const bodyH = h * 0.8
      const rx = w / 2
      const ry = h * 0.1
      return (
        <g key={node.id}>
          <rect x={pos.x} y={topY} width={w} height={bodyH} fill={color} stroke={stroke} strokeWidth={1} />
          <ellipse cx={pos.x + w / 2} cy={topY} rx={rx} ry={ry} fill={color} stroke={stroke} strokeWidth={1} />
          <ellipse cx={pos.x + w / 2} cy={topY + bodyH} rx={rx} ry={ry} fill={color} stroke={stroke} strokeWidth={1} />
        </g>
      )
    }

    const borderRadius =
      shape === "circle" || shape === "pill" ? w / 2 : 8 * scale
    return (
      <rect
        key={node.id}
        x={pos.x}
        y={pos.y}
        width={w}
        height={h}
        rx={borderRadius}
        fill={color}
        stroke={stroke}
        strokeWidth={1}
      />
    )
  }

  return (
    <svg
      width={viewW}
      height={viewH}
      viewBox={`0 0 ${viewW} ${viewH}`}
      className="rounded-lg border border-border bg-[#121215]"
    >
      {edges.map((edge) => {
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)
        if (!source || !target) return null
        const from = centerOf(source)
        const to = centerOf(target)
        return (
          <line
            key={edge.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#808090"
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={0.5}
          />
        )
      })}
      {nodes.map(renderNodeShape)}
    </svg>
  )
}

export function StarterTemplatesModal({
  open,
  onClose,
  onImport,
}: StarterTemplatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Starter Templates</DialogTitle>
          <DialogDescription>
            Choose a pre-built diagram to get started quickly. This will replace
            your current canvas.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CANVAS_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="group rounded-xl border border-border bg-[#18181c] p-3 transition-colors hover:border-accent/50"
              >
                <TemplatePreview template={template} />
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {template.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => {
                    onImport(template)
                    onClose()
                  }}
                >
                  <Import className="size-3.5 mr-1.5" />
                  Import
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
