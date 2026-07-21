"use client"

import { Component } from "react"
import type { ReactNode } from "react"
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"

interface CanvasProviderProps {
  roomId: string
  children: ReactNode
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 items-center justify-center bg-base">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Connection lost. Please try reloading.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function LoadingState() {
  return (
    <div className="flex flex-1 items-center justify-center bg-base">
      <p className="text-sm text-muted-foreground">Loading canvas...</p>
    </div>
  )
}

export function CanvasProvider({ roomId, children }: CanvasProviderProps) {
  return (
    <CanvasErrorBoundary>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{ cursor: null, isThinking: false }}
        >
          <ClientSideSuspense fallback={<LoadingState />}>
            {children}
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </CanvasErrorBoundary>
  )
}
