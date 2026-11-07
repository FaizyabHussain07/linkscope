import { cn } from "@/lib/utils"
import { PreviewProps } from "./types"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { getUrlHostname } from "@/lib/utils"

export function DiscordPreview({ metadata, url }: PreviewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const title = metadata.ogTitle || metadata.title || metadata.twitterTitle || url
  const description = metadata.ogDescription || metadata.description || metadata.twitterDescription
  const image = metadata.ogImage || metadata.twitterImage
  const siteName = metadata.ogSiteName || getUrlHostname(url)

  return (
    <div className="border border-[#313338] rounded-lg overflow-hidden bg-[#2b2b2b] max-w-md">
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2">
          {image && !imageError ? (
            <div className="relative w-6 h-6 rounded bg-[#313338] overflow-hidden shrink-0">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#313338]">
                  <div className="w-3 h-3 border border-[#5865f2]/30 border-t-[#5865f2] rounded-full animate-spin" />
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
            <div className="w-6 h-6 rounded bg-[#313338] flex items-center justify-center shrink-0">
              <ImageOff className="w-3 h-3 text-[#949ba4]" />
            </div>
          )}
          <p className="text-[#949ba4] text-xs truncate">
            {siteName}
          </p>
        </div>
        <p className="text-[#00a8fc] font-medium text-sm line-clamp-1 hover:underline cursor-pointer">
          {title}
        </p>
        {description && (
          <p className="text-[#b5bac1] text-xs line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
