import type { CanvasNode, CanvasEdge, NodeColorPair } from "@/types/canvas"
import { NODE_COLORS } from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

const [neutral, blue, purple, orange, red, pink, green, teal] = NODE_COLORS

const W = 140
const H = 60

function n(
  id: string,
  label: string,
  x: number,
  y: number,
  color: NodeColorPair,
  shape = "rectangle",
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    data: { label, color: color.fill, textColor: color.text, shape },
    width: W,
    height: H,
  }
}

function e(id: string, source: string, target: string): CanvasEdge {
  return { id, source, target, type: "canvasEdge" }
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices Architecture",
    description:
      "API gateway pattern with multiple backend services, databases, and event-driven communication.",
    nodes: [
      n("ms-1", "API Gateway", 240, 20, blue),
      n("ms-2", "Auth Service", 60, 140, purple),
      n("ms-3", "User Service", 60, 260, green),
      n("ms-4", "Order Service", 240, 140, orange),
      n("ms-5", "Payment Service", 240, 260, pink),
      n("ms-6", "Users DB", 60, 380, teal, "cylinder"),
      n("ms-7", "Orders DB", 240, 380, teal, "cylinder"),
      n("ms-8", "Message Queue", 420, 200, neutral, "hexagon"),
      n("ms-9", "Notification Svc", 420, 340, red),
    ],
    edges: [
      e("ms-e1", "ms-1", "ms-2"),
      e("ms-e2", "ms-1", "ms-3"),
      e("ms-e3", "ms-1", "ms-4"),
      e("ms-e4", "ms-1", "ms-5"),
      e("ms-e5", "ms-3", "ms-6"),
      e("ms-e6", "ms-4", "ms-7"),
      e("ms-e7", "ms-4", "ms-8"),
      e("ms-e8", "ms-5", "ms-8"),
      e("ms-e9", "ms-8", "ms-9"),
    ],
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description:
      "Automated build, test, and deployment pipeline with staging and production environments.",
    nodes: [
      n("cp-1", "Code Commit", 20, 80, green, "pill"),
      n("cp-2", "Build", 200, 80, orange),
      n("cp-3", "Unit Tests", 380, 80, purple, "diamond"),
      n("cp-4", "Deploy Staging", 560, 80, teal, "pill"),
      n("cp-5", "E2E Tests", 560, 200, purple, "diamond"),
      n("cp-6", "Deploy Prod", 380, 200, green, "pill"),
      n("cp-7", "Monitoring", 200, 200, blue),
    ],
    edges: [
      e("cp-e1", "cp-1", "cp-2"),
      e("cp-e2", "cp-2", "cp-3"),
      e("cp-e3", "cp-3", "cp-4"),
      e("cp-e4", "cp-4", "cp-5"),
      e("cp-e5", "cp-4", "cp-6"),
      e("cp-e6", "cp-6", "cp-7"),
    ],
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description:
      "Event bus architecture with multiple producers, consumers, and a dead-letter queue for failed messages.",
    nodes: [
      n("ed-1", "Order Service", 20, 60, orange),
      n("ed-2", "User Service", 20, 200, green),
      n("ed-3", "Event Bus", 260, 130, neutral, "hexagon"),
      n("ed-4", "Email Svc", 500, 60, pink),
      n("ed-5", "Analytics Svc", 500, 130, purple),
      n("ed-6", "Audit Svc", 500, 200, red),
      n("ed-7", "DLQ", 660, 130, teal, "cylinder"),
    ],
    edges: [
      e("ed-e1", "ed-1", "ed-3"),
      e("ed-e2", "ed-2", "ed-3"),
      e("ed-e3", "ed-3", "ed-4"),
      e("ed-e4", "ed-3", "ed-5"),
      e("ed-e5", "ed-3", "ed-6"),
      e("ed-e6", "ed-5", "ed-7"),
    ],
  },
]
