import { cn } from "@/lib/utils"
import { PreviewProps } from "./types"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { getUrlHostname } from "@/lib/utils"

export function SlackPreview({ metadata, url }: PreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const title = metadata.ogTitle || metadata.title || metadata.twitterTitle || url
  const description = metadata.ogDescription || metadata.description || metadata.twitterDescription
  const image = metadata.ogImage || metadata.twitterImage
  const siteName = metadata.ogSiteName || getUrlHostname(url)

  return (
    <div className="border border-[#1d9bd1] rounded-md overflow-hidden bg-[#f8f8f8] dark:bg-[#1d1d1d] max-w-md">
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          {image && !imageError ? (
            <div className="relative w-6 h-6 rounded bg-[#f8f8f8] dark:bg-[#1d1d1d] overflow-hidden shrink-0">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#f8f8f8] dark:bg-[#1d1d1d]">
                  <div className="w-3 h-3 border border-[#1d9bd1]/30 border-t-[#1d9bd1] rounded-full animate-spin" />
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
            <div className="w-6 h-6 rounded bg-[#f8f8f8] dark:bg-[#1d1d1d] flex items-center justify-center shrink-0">
              <ImageOff className="w-3 h-3 text-[#616061]" />
            </div>
          )}
          <p className="text-[#616061] text-xs truncate">
            {siteName}
          </p>
        </div>
        <p className="text-[#1d9bd1] font-medium text-sm line-clamp-1">
          {title}
        </p>
        {description && (
          <p className="text-[#616061] text-xs line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
