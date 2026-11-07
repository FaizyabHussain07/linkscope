import { cn } from "@/lib/utils"
import { PreviewProps } from "./types"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { getUrlHostname, getDisplayUrl } from "@/lib/utils"

export function BasePreview({ metadata, url, className }: PreviewProps & { className?: string }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const title = metadata.ogTitle || metadata.title || metadata.twitterTitle || url
  const description = metadata.ogDescription || metadata.description || metadata.twitterDescription
  const image = metadata.ogImage || metadata.twitterImage
  const siteName = metadata.ogSiteName || getUrlHostname(url)

  const displayUrl = getDisplayUrl(url)

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden bg-background max-w-md", className)}>
      {image && !imageError ? (
        <div className="relative aspect-[1.91/1] bg-muted overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          <img
            src={image}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
        </div>
      ) : (
        <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <div className="p-3 space-y-1.5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
          {siteName}
        </p>
        <p className="font-semibold text-sm line-clamp-2 leading-snug">
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <p className="text-xs text-muted-foreground/80 truncate">
          {displayUrl}
        </p>
      </div>
    </div>
  )
}
