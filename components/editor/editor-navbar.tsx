"use client"

import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen, Share2, Bot, LayoutTemplate } from "lucide-react"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  title?: string
  showShare?: boolean
  onShare?: () => void
  showAiSidebar?: boolean
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
  showTemplates?: boolean
  onOpenTemplates?: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  title,
  showShare,
  onShare,
  showAiSidebar,
  isAiSidebarOpen,
  onToggleAiSidebar,
  showTemplates,
  onOpenTemplates,
}: EditorNavbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-border bg-elevated px-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        {title && (
          <span className="text-sm font-medium text-foreground">{title}</span>
        )}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        {showTemplates && (
          <Button variant="ghost" size="icon-sm" aria-label="Starter templates" onClick={onOpenTemplates}>
            <LayoutTemplate className="size-4" />
          </Button>
        )}
        {showShare && (
          <Button variant="ghost" size="icon-sm" aria-label="Share project" onClick={onShare}>
            <Share2 className="size-4" />
          </Button>
        )}
        {showAiSidebar && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleAiSidebar}
            aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
            data-active={isAiSidebarOpen ? "" : undefined}
          >
            <Bot className="size-4" />
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  )
}
