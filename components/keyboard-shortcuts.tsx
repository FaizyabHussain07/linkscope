"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Keyboard, X, Eye, MessageCircle, Gamepad2, Hash, Twitter, Facebook, Linkedin, MessageSquare } from "lucide-react"

const shortcuts = [
  { key: "/", action: "Focus input", icon: Keyboard },
  { key: "Escape", action: "Clear", icon: X },
  { key: "1", action: "All platforms", icon: Eye },
  { key: "2", action: "Telegram", icon: MessageCircle },
  { key: "3", action: "Discord", icon: Gamepad2 },
  { key: "4", action: "Slack", icon: Hash },
  { key: "5", action: "X", icon: Twitter },
  { key: "6", action: "Facebook", icon: Facebook },
  { key: "7", action: "LinkedIn", icon: Linkedin },
  { key: "Ctrl+R", action: "Refresh", icon: MessageSquare },
]

interface KeyboardShortcutsHelpProps {
  className?: string
}

export function KeyboardShortcutsHelp({ className }: KeyboardShortcutsHelpProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
          <Keyboard className="w-4 h-4" />
          <span className="hidden sm:inline">Shortcuts</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-3 py-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-3">
                <shortcut.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{shortcut.action}</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">{shortcut.key}</span>
              </kbd>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Badge variant="outline" className="gap-2">
            <span>Press</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">?</span>
            </kbd>
            <span>for help</span>
          </Badge>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
