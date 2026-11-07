"use client"

import { ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { nocache } from "@/lib/cache"

interface MetadataFieldProps {
  label: string
  value?: string | React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function MetadataField({ label, value, children, className }: MetadataFieldProps) {
  return (
    <div className={cn("flex items-start justify-between py-3 border-b border-border/50 last:border-b-0", className)}>
      <div className="text-sm text-muted-foreground shrink-0">{label}</div>
      <div className="text-sm text-foreground text-right flex-1 ml-4 min-w-0">
        {value || children || <span className="text-muted-foreground">Not set</span>}
      </div>
    </div>
  )
}

interface SectionCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <Card className={cn("p-6 space-y-0", className)}>
      <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
      <div className="space-y-0">{children}</div>
    </Card>
  )
}

interface FaviconFieldProps {
  favicon?: string
}

export function FaviconField({ favicon }: FaviconFieldProps) {
  if (!favicon) {
    return <span className="text-muted-foreground">Not set</span>
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src={nocache(favicon)}
        alt="Favicon"
        className="w-6 h-6 rounded shrink-0"
        onError={(e) => {
          e.currentTarget.style.display = "none"
        }}
      />
    </div>
  )
}

interface TextFieldWithCountProps {
  text?: string
  currentLength: number
  maxLength: number
}

export function TextFieldWithCount({ text, currentLength, maxLength }: TextFieldWithCountProps) {
  if (!text) {
    return <span className="text-muted-foreground">Not set</span>
  }

  return (
    <div className="text-right">
      <div className="text-foreground wrap-break-word">{text}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {currentLength} / {maxLength} chars
      </div>
    </div>
  )
}

interface LinkFieldProps {
  url?: string
  showIcon?: boolean
  italic?: boolean
}

export function LinkField({ url, showIcon = true, italic = false }: LinkFieldProps) {
  if (!url) {
    return <span className="text-muted-foreground">Not set</span>
  }

  return (
    <div className={cn("flex items-center gap-1.5 justify-end", italic && "italic")}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:underline break-all"
      >
        {url}
      </a>
      {showIcon && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
    </div>
  )
}

interface StatusFieldProps {
  found: boolean
  linkUrl?: string
  statusText?: string
}

export function StatusField({ found, linkUrl, statusText = "Found" }: StatusFieldProps) {
  if (!found) {
    return <span className="text-muted-foreground">Not found</span>
  }

  if (linkUrl) {
    return (
      <div className="flex items-center gap-1.5 justify-end">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:underline"
        >
          {statusText}
        </a>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      </div>
    )
  }

  return <span className="text-green-500">{statusText}</span>
}

interface ImageFieldProps {
  imageUrl?: string
  alt?: string
}

export function ImageField({ imageUrl, alt = "Image" }: ImageFieldProps) {
  if (!imageUrl) {
    return <span className="text-muted-foreground">Not set</span>
  }

  return (
    <div className="flex justify-end">
      <div className="relative max-w-xs">
        <img
          src={nocache(imageUrl)}
          alt={alt}
          className="rounded-lg border border-border max-h-48 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
      </div>
    </div>
  )
}
