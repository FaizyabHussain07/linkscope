import { useEffect, useCallback } from "react"
import { Platform } from "@/components/previews/types"

interface KeyboardShortcuts {
  1: Platform | null
  2: Platform | null
  3: Platform | null
  4: Platform | null
  5: Platform | null
  6: Platform | null
  7: Platform | null
  Escape: () => void
  r: () => void
  "/": () => void
}

const defaultShortcuts: Omit<KeyboardShortcuts, "Escape" | "r" | "/"> = {
  1: null,
  2: "telegram",
  3: "discord",
  4: "slack",
  5: "x",
  6: "facebook",
  7: "linkedin",
}

interface UseKeyboardShortcutsProps {
  onPlatformSelect: (platform: Platform | null) => void
  onClear: () => void
  onRefresh: () => void
  onFocusInput: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts({
  onPlatformSelect,
  onClear,
  onRefresh,
  onFocusInput,
  enabled = true,
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return

      if (e.key === "/") {
        e.preventDefault()
        onFocusInput()
        return
      }

      if (e.key === "Escape") {
        e.preventDefault()
        onClear()
        return
      }

      if (e.key.toLowerCase() === "r" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        onRefresh()
        return
      }

      if (e.key >= "1" && e.key <= "7" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        const num = parseInt(e.key, 10)
        if (num >= 1 && num <= 7) {
          const platform = defaultShortcuts[num as keyof typeof defaultShortcuts]
          if (platform !== undefined) {
            onPlatformSelect(platform)
          }
        }
        return
      }
    },
    [enabled, onPlatformSelect, onClear, onRefresh, onFocusInput],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

export function getShortcutHint(key: string): string {
  return `Press ${key}`
}
