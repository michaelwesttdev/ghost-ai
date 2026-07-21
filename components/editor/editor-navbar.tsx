"use client"

import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-border bg-elevated px-3">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center" />
    </header>
  )
}
