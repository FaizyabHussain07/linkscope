import { cn } from "@/lib/utils"
import { PreviewProps } from "./types"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { getUrlHostname } from "@/lib/utils"

export function TelegramPreview({ metadata, url }: PreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const title = metadata.ogTitle || metadata.title || metadata.twitterTitle || url
  const description = metadata.ogDescription || metadata.description || metadata.twitterDescription
  const image = metadata.ogImage || metadata.twitterImage

  return (
    <div className="border border-[#e8e8e8] dark:border-[#2e2e2e] rounded-lg overflow-hidden bg-[#ffffff] dark:bg-[#1c1c1c] max-w-md">
      {image && !imageError ? (
        <div className="relative aspect-[1.91/1] bg-[#f4f4f5] dark:bg-[#2e2e2e] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f4f4f5] dark:bg-[#2e2e2e]">
              <div className="w-8 h-8 border-2 border-[#2cabff]/30 border-t-[#2cabff] rounded-full animate-spin" />
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
        <div className="aspect-[1.91/1] bg-[#f4f4f5] dark:bg-[#2e2e2e] flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-[#999999]" />
        </div>
      )}
      <div className="p-3 space-y-1">
        <p className="text-[#999999] text-xs truncate">
          {getUrlHostname(url)}
        </p>
        <p className="font-medium text-[#2cabff] text-sm line-clamp-1">
          {title}
        </p>
        {description && (
          <p className="text-[#999999] text-xs line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
