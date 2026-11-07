"use client"

import { useCallback, useRef, useState } from "react"
import { X, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatUrl } from "@/lib/cache"

interface UrlInputProps {
  url: string
  setUrl: (url: string) => void
  onSubmit: (url: string) => void
  loading: boolean
  error: string
  onClear: () => void
  onRefresh: () => void
  className?: string
}

export function UrlInput({
  url,
  setUrl,
  onSubmit,
  loading,
  error,
  onClear,
  onRefresh,
  className,
}: UrlInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (url.trim()) {
        const normalized = formatUrl(url.trim())
        onSubmit(normalized)
      }
    },
    [url, onSubmit],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (url.trim()) {
          const normalized = formatUrl(url.trim())
          onSubmit(normalized)
        }
      }
    },
    [url, onSubmit],
  )

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center border-b border-foreground/20 pb-1">
          <Input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="enter a url"
            className="flex-1 border-0 bg-background dark:bg-background shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto text-base rounded-none placeholder:text-foreground/40"
            disabled={loading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {loading && <Loader2 className="w-5 h-5 animate-spin text-foreground/50 ml-2" />}
          {url && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClear}
              className="h-8 w-8 hover:bg-transparent hover:text-foreground/70 text-foreground/50 ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {url && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onRefresh}
              className="h-8 w-8 hover:bg-transparent hover:text-foreground/70 text-foreground/50 ml-1"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
      {error && (
        <p className="mt-2 text-sm text-destructive flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </div>
  )
}
