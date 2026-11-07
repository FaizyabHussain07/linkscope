import { cn } from "@/lib/utils"
import { PreviewProps } from "./types"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { getUrlHostname } from "@/lib/utils"

export function WhatsAppPreview({ metadata, url }: PreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const title = metadata.ogTitle || metadata.title || metadata.twitterTitle || url
  const description = metadata.ogDescription || metadata.description || metadata.twitterDescription
  const image = metadata.ogImage || metadata.twitterImage
  const siteName = metadata.ogSiteName || getUrlHostname(url)

  return (
    <div className="border border-[#dcdcdc] rounded-[2px] overflow-hidden bg-[#f5f5f5] max-w-md">
      {image && !imageError ? (
        <div className="relative aspect-[1.91/1] bg-[#e9e9e9] overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#e9e9e9]">
              <div className="w-8 h-8 border-2 border-[#25d366]/30 border-t-[#25d366] rounded-full animate-spin" />
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
        <div className="aspect-[1.91/1] bg-[#e9e9e9] flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-[#667781]" />
        </div>
      )}
      <div className="p-3 space-y-1">
        <p className="text-[#667781] text-[12.5px] uppercase truncate">
          {siteName}
        </p>
        <p className="text-[#3b4c54] font-medium text-[14px] line-clamp-2 leading-snug">
          {title}
        </p>
        {description && (
          <p className="text-[#667781] text-[14px] line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
