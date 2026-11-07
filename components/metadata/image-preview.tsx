"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ImageDimensions {
  width: number
  height: number
  loaded: boolean
  error: boolean
}

export function useImageDimensions(url: string | undefined): ImageDimensions {
  const [dimensions, setDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
    loaded: false,
    error: false,
  })

  useEffect(() => {
    if (!url) {
      return
    }

    const img = new Image()
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        loaded: true,
        error: false,
      })
    }
    img.onerror = () => {
      setDimensions({ width: 0, height: 0, loaded: true, error: true })
    }
    img.src = url
  }, [url])

  if (!url) {
    return { width: 0, height: 0, loaded: false, error: false }
  }

  return dimensions
}

interface ImagePreviewProps {
  label: string
  url: string | undefined
  recommended?: string
  isFavicon?: boolean
}

export function ImagePreview({
  label,
  url,
  recommended,
  isFavicon = false,
}: ImagePreviewProps) {
  const dimensions = useImageDimensions(url)
  const [imageError, setImageError] = useState(false)

  if (!url) return null

  const getDimensionColor = (width: number, height: number, recommended?: string) => {
    if (!recommended || !dimensions.loaded) return "text-foreground/70"
    const [recWidth, recHeight] = recommended.split("×").map((s) => parseInt(s.trim()))
    if (width === recWidth && height === recHeight) return "text-green-500"
    if (Math.abs(width - recWidth) <= 2 && Math.abs(height - recHeight) <= 2) return "text-yellow-500"
    return "text-yellow-500"
  }

  const dimensionText = dimensions.loaded && !dimensions.error
    ? `${dimensions.width} × ${dimensions.height}`
    : "Loading..."

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-foreground/70 uppercase">{label}</div>
      <div className={cn(
        "relative rounded-lg overflow-hidden bg-muted border border-border",
        isFavicon ? "w-16 h-16" : "aspect-[1.91/1]"
      )}>
        {!imageError && (
          <img
            src={url}
            alt={label}
            className={cn(
              "w-full h-full object-contain",
              isFavicon ? "p-2" : ""
            )}
            onError={() => setImageError(true)}
          />
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
            Failed to load
          </div>
        )}
      </div>
      <div className="text-sm text-foreground/70">
        <span className={getDimensionColor(dimensions.width, dimensions.height, recommended)}>
          • {dimensionText}
        </span>
        {recommended && dimensions.loaded && !dimensions.error && (
          <span className="text-foreground/50 ml-2">(recommended: {recommended})</span>
        )}
      </div>
    </div>
  )
}
