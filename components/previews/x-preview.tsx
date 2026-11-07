import { cn } from "@/lib/utils"
import { PreviewProps } from "./types"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { getUrlHostname } from "@/lib/utils"

export function XPreview({ metadata, url }: PreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const title = metadata.ogTitle || metadata.title || metadata.twitterTitle || url
  const description = metadata.ogDescription || metadata.description || metadata.twitterDescription
  const image = metadata.ogImage || metadata.twitterImage
  const siteName = metadata.ogSiteName || getUrlHostname(url)

  return (
    <div className="border border-[#cfd9de] dark:border-[#2f3336] rounded-[12px] overflow-hidden bg-[#ffffff] dark:bg-[#000000] max-w-md">
      {image && !imageError ? (
        <div className="relative aspect-[1.91/1] bg-[#f7f9f9] dark:bg-[#16181c] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f7f9f9] dark:bg-[#16181c]">
              <div className="w-8 h-8 border-2 border-[#1d9bf0]/30 border-t-[#1d9bf0] rounded-full animate-spin" />
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
        <div className="aspect-[1.91/1] bg-[#f7f9f9] dark:bg-[#16181c] flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-[#536471]" />
        </div>
      )}
      <div className="p-3 space-y-1">
        <p className="text-[#536471] text-[13px] truncate">
          {url}
        </p>
        <p className="font-medium text-[#0f1419] dark:text-[#f7f9f9] text-[15px] line-clamp-2 leading-tight">
          {title}
        </p>
        {description && (
          <p className="text-[#536471] text-[15px] line-clamp-2 leading-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
