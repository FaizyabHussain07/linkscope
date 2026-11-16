<<<<<<< HEAD
"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Telegram, MessageSquare, Twitter, Linkedin, Users, MessageCircle, Share2, Hash, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const PLATFORMS = [
  { id: "telegram", label: "Telegram", icon: MessageCircle, color: "#2CABFF" },
  { id: "discord", label: "Discord", icon: Users, color: "#5865F2" },
  { id: "slack", label: "Slack", icon: Hash, color: "#4A154B" },
  { id: "x", label: "X", icon: Twitter, color: "#000000" },
  { id: "facebook", label: "Facebook", icon: MessageCircle, color: "#1877F2" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
]

const DEMO_META = {
  title: "Build faster with modern tools",
  description: "Discover the best developer tools and platforms to accelerate your workflow and ship products faster.",
  ogImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
  siteName: "example.com",
=======
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Check, AlertCircle } from "lucide-react"

const PLATFORMS = [
  { id: "telegram", label: "Telegram", icon: "T", color: "#2CABFF" },
  { id: "discord", label: "Discord", icon: "D", color: "#5865F2" },
  { id: "slack", label: "Slack", icon: "S", color: "#1D9BD1" },
  { id: "x", label: "X", icon: "X", color: "#1D9BF0" },
  { id: "facebook", label: "Facebook", icon: "F", color: "#1877F2" },
  { id: "linkedin", label: "LinkedIn", icon: "L", color: "#0A66C2" },
]

type PreviewMetadata = {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogSiteName?: string
>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1
}

export function HeroInspector() {
  const [url, setUrl] = useState("https://example.com")
  const [loading, setLoading] = useState(false)
<<<<<<< HEAD
  const [submitted, setSubmitted] = useState(false)
=======
  const [error, setError] = useState("")
  const [metadata, setMetadata] = useState<PreviewMetadata | null>(null)
>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1
  const [platform, setPlatform] = useState("telegram")

  const handleInspect = async () => {
    if (!url.trim()) return
    setLoading(true)
<<<<<<< HEAD
    setSubmitted(false)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
=======
    setError("")
    setMetadata(null)
    try {
      const response = await fetch("/api/v1/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const result = await response.json() as { success?: boolean; error?: string; metadata?: PreviewMetadata }
      if (!response.ok || !result.success || !result.metadata) {
        throw new Error(result.error || "Inspection failed")
      }
      setMetadata(result.metadata)
    } catch (inspectionError) {
      setError(inspectionError instanceof Error ? inspectionError.message : "Inspection failed")
    } finally {
      setLoading(false)
    }
>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1
  }

  const platformData = PLATFORMS.find((p) => p.id === platform)

  return (
<<<<<<< HEAD
    <Card className="border-[#27272A] bg-[#111113] overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-white">LinkScope</span>
          </div>
          <Badge variant="secondary" className="bg-[#18181B] text-[#A1A1AA] border-[#27272A]">
            Demo inspection
          </Badge>
        </div>

        {/* URL Input */}
        <div className="border-b border-[#27272A] px-5 py-4">
          <form onSubmit={(e) => { e.preventDefault(); handleInspect() }} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-[#18181B] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#6366F1] focus:ring-[#6366F1]/20"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Inspect
            </Button>
          </form>
        </div>

        {/* Platform Tabs */}
        <div className="border-b border-[#27272A] px-5 py-3">
          <Tabs value={platform} onValueChange={setPlatform}>
            <TabsList className="grid grid-cols-6 gap-1 bg-[#111113] p-1">
              {PLATFORMS.map((p) => (
                <TabsTrigger
                  key={p.id}
                  value={p.id}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#A1A1AA] transition-all data-[state=active]:bg-[#18181B] data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <p.icon className="h-3.5 w-3.5" style={{ color: p.color }} />
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Preview Card */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {!submitted ? (
                <div className="space-y-3">
                  <div className="h-5 w-3/4 animate-pulse rounded-md bg-[#18181B]" />
                  <div className="h-4 w-1/2 animate-pulse rounded-md bg-[#18181B]" />
                  <div className="h-4 w-full animate-pulse rounded-md bg-[#18181B] mt-2" />
                </div>
              ) : (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
                    {platformData?.color && (
                      <span
                        className="inline-block h-2 w-2 rounded-full mr-1.5 align-middle"
                        style={{ backgroundColor: platformData.color }}
                      />
                    )}
                    {DEMO_META.siteName}
                  </p>
                  <h3 className="text-base font-semibold text-white line-clamp-2 mt-1">
                    {DEMO_META.title}
                  </h3>
                  <p className="text-sm text-[#A1A1AA] line-clamp-2 mt-1">
                    {DEMO_META.description}
                  </p>
                </>
              )}
            </div>
            {submitted && DEMO_META.ogImage && (
              <div className="relative hidden w-20 shrink-0 overflow-hidden rounded-lg sm:block">
                <img
                  src={DEMO_META.ogImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Image Preview */}
          {submitted && DEMO_META.ogImage && (
            <div className="mt-4">
              <div className="relative aspect-[1.91/1] overflow-hidden rounded-lg border border-[#27272A] bg-[#18181B]">
                <img
                  src={DEMO_META.ogImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#A1A1AA]">
                <Check className="h-3.5 w-3.5 text-green-500" />
                Image detected • 1200×630
              </div>
            </div>
          )}

          {/* Metadata Status */}
          {submitted && (
=======
    <div className="rounded-2xl border border-[#27272A] bg-[#111113] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-medium">LinkScope</span>
        </div>
        <Badge variant="secondary" className="bg-[#18181B] text-[#A1A1AA] border-[#27272A]">
          Live inspection
        </Badge>
      </div>

      <div className="mb-4">
        <form onSubmit={(e) => { e.preventDefault(); handleInspect() }} className="flex gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="bg-[#18181B] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#6366F1]"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Inspect
          </Button>
        </form>
      </div>

      <Tabs defaultValue="telegram" value={platform} onValueChange={setPlatform}>
        <TabsList className="grid grid-cols-6 gap-1 bg-[#111113] p-1 rounded-xl">
          {PLATFORMS.map((p) => (
            <TabsTrigger
              key={p.id}
              value={p.id}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#A1A1AA] transition-all data-[state=active]:bg-[#18181B] data-[state=active]:text-white"
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold"
                style={{ backgroundColor: p.color }}
              >
                {p.icon}
              </span>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            <div className="h-5 w-3/4 animate-pulse rounded-md bg-[#18181B]" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-[#18181B]" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : metadata ? (
          <>
            <p className="text-[10px] uppercase tracking-wider text-[#A1A1AA]">
              {platformData?.color && (
                <span className="inline-block h-2 w-2 rounded-full mr-1.5 align-middle" style={{ backgroundColor: platformData.color }} />
              )}
              {metadata.ogSiteName || (() => { try { return new URL(url).hostname } catch { return url } })()}
            </p>
            <h3 className="text-base font-semibold text-white line-clamp-2 mt-1">
              {metadata.ogTitle || metadata.title || "No title available"}
            </h3>
            <p className="text-sm text-[#A1A1AA] line-clamp-2 mt-1">
              {metadata.ogDescription || metadata.description || "No description available"}
            </p>

            {metadata.ogImage && (
              <div className="mt-4 relative aspect-[1.91/1] overflow-hidden rounded-lg border border-[#27272A]">
                <img src={metadata.ogImage} alt="" className="h-full w-full object-cover" />
              </div>
            )}

>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-green-500/30 text-green-400 gap-1">
                <Check className="h-3 w-3" />
                OG Title present
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400 gap-1">
                <Check className="h-3 w-3" />
                OG Description present
              </Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400 gap-1">
                <Check className="h-3 w-3" />
                OG Image present
              </Badge>
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 gap-1">
                <AlertCircle className="h-3 w-3" />
                No Twitter Card
              </Badge>
            </div>
<<<<<<< HEAD
          )}

          {/* Score */}
          {submitted && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#27272A] bg-[#111113] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white font-semibold text-lg">
=======

            <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#27272A] bg-[#111113] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white font-semibold">
>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1
                85
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Metadata Score</p>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#18181B]">
<<<<<<< HEAD
                  <div
                    className="h-full w-4/5 overflow-hidden rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]"
                    style={{ width: "85%" }}
                  />
=======
                  <div className="h-full w-4/5 overflow-hidden rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" style={{ width: "85%" }} />
>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1
                </div>
              </div>
              <span className="text-xs text-[#A1A1AA]">out of 100</span>
            </div>
<<<<<<< HEAD
          )}
        </div>

        {/* Disclaimer */}
        <div className="border-t border-[#27272A] bg-[#111113] px-5 py-2">
          <p className="text-[10px] text-[#52525B]">
            Previews are simulations. Actual platform rendering may vary.
          </p>
        </div>
      </CardContent>
    </Card>
=======
          </>
        ) : (
          <p className="text-sm text-[#71717A]">Inspect a public URL to see its extracted preview.</p>
        )}
      </div>

      <p className="mt-4 text-[10px] text-[#52525B]">
        Previews are simulations. Actual platform rendering may vary.
      </p>
    </div>
>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1
  )
}
