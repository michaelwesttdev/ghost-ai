import { FileText, RefreshCw, Share2 } from "lucide-react"
import type { ReactNode } from "react"

const features = [
  {
    icon: RefreshCw,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <div className="hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-brand" />
            <span className="text-lg font-semibold text-copy-primary">
              Ghost AI
            </span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-copy-primary">
              Design systems at the speed of thought.
            </h1>
            <p className="text-base text-copy-muted">
              Describe your architecture in plain English. Ghost AI maps it to
              a shared canvas your whole team can refine in real time.
            </p>
          </div>
          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                  <feature.icon className="size-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-medium text-copy-primary">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-sm text-copy-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-copy-faint">
          &copy; 2026 Ghost AI. All rights reserved.
        </p>
      </div>
      <div className="relative flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="size-96 rounded-full bg-brand/5 blur-3xl" />
        </div>
        {children}
      </div>
    </div>
  )
}
