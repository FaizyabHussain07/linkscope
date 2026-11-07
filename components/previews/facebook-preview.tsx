import { cn } from "@/lib/utils"
import { PreviewProps } from "./types"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { getUrlHostname } from "@/lib/utils"

export function FacebookPreview({ metadata, url }: PreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const title = metadata.ogTitle || metadata.title || metadata.twitterTitle || url
  const description = metadata.ogDescription || metadata.description || metadata.twitterDescription
  const image = metadata.ogImage || metadata.twitterImage
  const siteName = metadata.ogSiteName || getUrlHostname(url)

  return (
    <div className="border border-[#dadde1] dark:border-[#3e4042] rounded overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a] max-w-md">
      {image && !imageError ? (
        <div className="relative aspect-[1.91/1] bg-[#f0f2f5] dark:bg-[#3e4042] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f0f2f5] dark:bg-[#3e4042]">
              <div className="w-8 h-8 border-2 border-[#1877f2]/30 border-t-[#1877f2] rounded-full animate-spin" />
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
        <div className="aspect-[1.91/1] bg-[#f0f2f5] dark:bg-[#3e4042] flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-[#606770]" />
        </div>
      )}
      <div className="p-3 space-y-1 bg-[#f0f2f5] dark:bg-[#18191a]">
        <p className="text-[#606770] text-xs uppercase truncate">
          {siteName}
        </p>
        <p className="text-[#1c1e21] dark:text-[#e4e6eb] font-semibold text-[15px] line-clamp-1">
          {title}
        </p>
        {description && (
          <p className="text-[#606770] text-[13px] line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
