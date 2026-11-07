import { cn } from "@/lib/utils"
import { PreviewProps } from "./types"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { getUrlHostname } from "@/lib/utils"

export function LinkedInPreview({ metadata, url }: PreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const title = metadata.ogTitle || metadata.title || metadata.twitterTitle || url
  const description = metadata.ogDescription || metadata.description || metadata.twitterDescription
  const image = metadata.ogImage || metadata.twitterImage
  const siteName = metadata.ogSiteName || getUrlHostname(url)

  return (
    <div className="border border-[#cfd9de] dark:border-[#38444f] rounded-[2px] overflow-hidden bg-[#ffffff] dark:bg-[#1a1a1a] max-w-md">
      {image && !imageError ? (
        <div className="relative aspect-[1.91/1] bg-[#f3f6f8] dark:bg-[#38444f] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f3f6f8] dark:bg-[#38444f]">
              <div className="w-8 h-8 border-2 border-[#0a66c2]/30 border-t-[#0a66c2] rounded-full animate-spin" />
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
        <div className="aspect-[1.91/1] bg-[#f3f6f8] dark:bg-[#38444f] flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-[#666]" />
        </div>
      )}
      <div className="p-3 space-y-1">
        <p className="text-[#00000099] dark:text-[#ffffff99] text-[12px] truncate">
          {siteName}
        </p>
        <p className="text-[#000000e6] dark:text-[#ffffff] font-semibold text-[14px] line-clamp-2 leading-tight">
          {title}
        </p>
        {description && (
          <p className="text-[#00000099] dark:text-[#ffffff99] text-[12px] line-clamp-2 leading-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
