"use client"

import * as React from "react"
import { Code } from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  return (
    <>
      <CommandPaletteTrigger onClick={() => onOpenChange(true)}>
        <CmdIcon className="w-4 h-4" />
        <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </CommandPaletteTrigger>
    </>
  )
}

function CommandPaletteTrigger({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group gap-2 rounded-full border border-input bg-background px-2 py-1 text-sm font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {children}
    </button>
  )
}

function CmdIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 4v10a2 2 0 0 1-2 2 H9a2 2 0 0 1-2-2 V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z" />
      <path d="M10 20h4" />
    </svg>
  )
}
