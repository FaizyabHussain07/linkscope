"use client"

import { useCallback, useState, useEffect, useRef } from "react"
import Image from "next/image"
import { SettingsProvider } from "@/context/settings-context"
import { useMetadata } from "@/hooks/use-metadata"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { UrlInput } from "@/components/url-input"
import {
  TelegramPreview,
  DiscordPreview,
  SlackPreview,
  XPreview,
  FacebookPreview,
  LinkedInPreview,
  WhatsAppPreview,
} from "@/components/previews"
import { ScoreDisplay } from "@/components/score-display"
import {
  BasicMetadata,
  OpenGraphMetadata,
  TwitterMetadata,
  ImagesMetadata,
  RawMetadata,
} from "@/components/metadata-tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Copy, X, Check, ChevronDown } from "lucide-react"
import { FaXTwitter } from "react-icons/fa6"
import { GitHubStars } from "@/components/github-stars"
import { Button } from "@/components/ui/button"
import { formatUrl } from "@/lib/cache"
import { cn, copyToClipboard, getRecentUrls, addRecentUrl, clearRecentUrls, getUrlHostname } from "@/lib/utils"

const EXAMPLE_URLS = ["minimax.io", "bettershot.site", "scira.ai"]

function LinkPreviewContent() {
  const {
    url,
    setUrl,
    metadata,
    loading,
    error,
    fetchMetadata,
    clear,
    refresh,
  } = useMetadata()

  const [localError, setLocalError] = useState<string>("")
  const [localhostExpanded, setLocalhostExpanded] = useState(true)
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedTunnel, setCopiedTunnel] = useState(false)
  const [recentUrls, setRecentUrls] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return getRecentUrls()
    }
    return []
  })
  const [githubStars, setGithubStars] = useState<number>(0)
  const lastAddedUrlRef = useRef<string>("")

  const handleSubmit = useCallback(
    (urlToFetch: string) => {
      setLocalError("")
      fetchMetadata(urlToFetch)
    },
    [fetchMetadata],
  )

  const handleCopyInstall = useCallback(async () => {
    const success = await copyToClipboard("bun add -g ngrok")
    if (success) {
      setCopiedInstall(true)
      setTimeout(() => setCopiedInstall(false), 2000)
    }
  }, [])

  const handleCopyTunnel = useCallback(async () => {
    const success = await copyToClipboard("ngrok http 3000")
    if (success) {
      setCopiedTunnel(true)
      setTimeout(() => setCopiedTunnel(false), 2000)
    }
  }, [])

  useEffect(() => {
    if (metadata && url && !loading && lastAddedUrlRef.current !== url) {
      addRecentUrl(url)
      lastAddedUrlRef.current = url
      requestAnimationFrame(() => {
        setRecentUrls(getRecentUrls())
      })
    }
  }, [metadata, url, loading])

  useEffect(() => {
    const fetchGitHubStars = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/KartikLabhshetwar/linkpreview")
        if (response.ok) {
          const data = await response.json()
          setGithubStars(data.stargazers_count || 0)
        }
      } catch {
        setGithubStars(0)
      }
    }
    fetchGitHubStars()
  }, [])

  const handleClearRecent = useCallback(() => {
    clearRecentUrls()
    setRecentUrls([])
  }, [])

  const handleRecentClick = useCallback(
    (recentUrl: string) => {
      const normalized = formatUrl(recentUrl)
      setUrl(normalized)
      handleSubmit(normalized)
    },
    [setUrl, handleSubmit],
  )

  const handleExampleClick = useCallback(
    (exampleUrl: string) => {
      const normalized = formatUrl(exampleUrl)
      setUrl(normalized)
      handleSubmit(normalized)
    },
    [setUrl, handleSubmit],
  )

  useKeyboardShortcuts({
    onPlatformSelect: () => {},
    onClear: clear,
    onRefresh: refresh,
    onFocusInput: () => {
      const input = document.querySelector('input[type="url"]') as HTMLInputElement
      input?.focus()
    },
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full bg-background">
        <div className="container mx-auto px-4 py-4 max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="Link Preview" width={56} height={56} />
          </div>
          <div className="flex items-center gap-3">
            <button className="text-foreground/70 hover:text-foreground transition-colors">
              <GitHubStars repo="KartikLabhshetwar/linkpreview" stargazersCount={githubStars} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl flex-1">
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-serif italic text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>linkpreview</h1>
            <p className="text-md text-foreground/80">
              See how your links appear on social platforms.
            </p>
          </div>

          <div className="space-y-6">
            <UrlInput
              url={url}
              setUrl={setUrl}
              onSubmit={handleSubmit}
              loading={loading}
              error={localError || error}
              onClear={clear}
              onRefresh={refresh}
            />

            {!metadata && !loading && !error && !localError && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-wide text-foreground/70">TRY THESE</p>
                  <div className="flex flex-wrap gap-6">
                    {EXAMPLE_URLS.map((exampleUrl) => (
                      <button
                        key={exampleUrl}
                        onClick={() => handleExampleClick(exampleUrl)}
                        className="flex items-center gap-2 text-foreground hover:text-foreground/70 transition-colors"
                      >
                        <span>›</span>
                        <span>{exampleUrl}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setLocalhostExpanded(!localhostExpanded)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <p className="text-sm uppercase tracking-wide text-foreground/70">LOCALHOST</p>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-foreground/70 transition-transform",
                        localhostExpanded ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {localhostExpanded && (
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-foreground/80">
                        Test your local server using ngrok
                      </p>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="text-xs text-foreground/60">1. INSTALL</div>
                          <div className="flex items-center gap-2 group">
                            <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono text-foreground/90">
                              bun add -g ngrok
                            </code>
                            <button
                              onClick={handleCopyInstall}
                              className={cn(
                                "transition-all p-1.5 rounded",
                                copiedInstall 
                                  ? "opacity-100 bg-green-500/20 text-green-500" 
                                  : "opacity-0 group-hover:opacity-100 hover:bg-muted text-foreground/70"
                              )}
                            >
                              {copiedInstall ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-xs text-foreground/60">
                            2. START YOUR LOCAL SERVER ON PORT 3000
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-xs text-foreground/60">3. RUN TUNNEL</div>
                          <div className="flex items-center gap-2 group">
                            <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono text-foreground/90">
                              ngrok http 3000
                            </code>
                            <button
                              onClick={handleCopyTunnel}
                              className={cn(
                                "transition-all p-1.5 rounded",
                                copiedTunnel 
                                  ? "opacity-100 bg-green-500/20 text-green-500" 
                                  : "opacity-0 group-hover:opacity-100 hover:bg-muted text-foreground/70"
                              )}
                            >
                              {copiedTunnel ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-xs text-foreground/60">
                            4. COPY THE HTTPS URL FROM THE OUTPUT
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-24">
              <div className="loader" style={{ color: 'var(--foreground)' }} />
            </div>
          )}

          {(error || localError) && !loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Unable to fetch preview</h2>
              <p className="text-muted-foreground text-center max-w-md">
                {error || localError}
              </p>
              <Button onClick={clear} variant="outline" className="mt-4">
                Try another URL
              </Button>
            </div>
          )}

          {metadata && !loading && !error && !localError && (
            <Tabs defaultValue="score" className="w-full">
              <div className="w-full overflow-x-auto">
                <TabsList className="inline-flex w-max min-w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="score"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  SCORE
                </TabsTrigger>
                <TabsTrigger
                  value="previews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  PREVIEWS
                </TabsTrigger>
                <TabsTrigger
                  value="basic"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  BASIC
                </TabsTrigger>
                <TabsTrigger
                  value="opengraph"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  OPEN GRAPH
                </TabsTrigger>
                <TabsTrigger
                  value="x"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  X
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  IMAGES
                </TabsTrigger>
                <TabsTrigger
                  value="raw"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  RAW
                </TabsTrigger>
              </TabsList>
              </div>

              <TabsContent value="score" className="mt-8">
                <ScoreDisplay metadata={metadata} />
              </TabsContent>

              <TabsContent value="previews" className="mt-8">
                <Tabs defaultValue="telegram" className="w-full">
                  <div className="w-full overflow-x-auto">
                    <TabsList className="inline-flex w-max min-w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="telegram"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      TELEGRAM
                    </TabsTrigger>
                    <TabsTrigger
                      value="discord"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      DISCORD
                    </TabsTrigger>
                    <TabsTrigger
                      value="slack"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      SLACK
                    </TabsTrigger>
                    <TabsTrigger
                      value="x"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      X
                    </TabsTrigger>
                    <TabsTrigger
                      value="facebook"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      FACEBOOK
                    </TabsTrigger>
                    <TabsTrigger
                      value="linkedin"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      LINKEDIN
                    </TabsTrigger>
                    <TabsTrigger
                      value="whatsapp"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      WHATSAPP
                    </TabsTrigger>
                  </TabsList>
                  </div>

                  <TabsContent value="telegram" className="mt-8">
                    <TelegramPreview metadata={metadata} url={url} />
                  </TabsContent>

                  <TabsContent value="discord" className="mt-8">
                    <DiscordPreview metadata={metadata} url={url} />
                  </TabsContent>

                  <TabsContent value="slack" className="mt-8">
                    <SlackPreview metadata={metadata} url={url} />
                  </TabsContent>

                  <TabsContent value="x" className="mt-8">
                    <XPreview metadata={metadata} url={url} />
                  </TabsContent>

                  <TabsContent value="facebook" className="mt-8">
                    <FacebookPreview metadata={metadata} url={url} />
                  </TabsContent>

                  <TabsContent value="linkedin" className="mt-8">
                    <LinkedInPreview metadata={metadata} url={url} />
                  </TabsContent>

                  <TabsContent value="whatsapp" className="mt-8">
                    <WhatsAppPreview metadata={metadata} url={url} />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="basic" className="mt-8">
                <BasicMetadata metadata={metadata} />
              </TabsContent>

              <TabsContent value="opengraph" className="mt-8">
                <OpenGraphMetadata metadata={metadata} />
              </TabsContent>

              <TabsContent value="x" className="mt-8">
                <TwitterMetadata metadata={metadata} />
              </TabsContent>

              <TabsContent value="images" className="mt-8">
                <ImagesMetadata metadata={metadata} />
              </TabsContent>

              <TabsContent value="raw" className="mt-8">
                <RawMetadata metadata={metadata} />
              </TabsContent>
            </Tabs>
          )}

          {!metadata && !loading && !error && !localError && recentUrls.length > 0 && (
            <div className="space-y-2 pt-8 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-wide text-foreground/70">RECENT</p>
                <button
                  onClick={handleClearRecent}
                  className="flex items-center gap-1 text-sm uppercase tracking-wide text-foreground/70 hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>CLEAR</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-6">
                {recentUrls.map((recentUrl) => (
                  <button
                    key={recentUrl}
                    onClick={() => handleRecentClick(recentUrl)}
                    className="flex items-center gap-2 text-foreground hover:text-foreground/70 transition-colors"
                  >
                    <span className="text-foreground/50">›</span>
                    <span>{getUrlHostname(recentUrl)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full bg-background mt-auto">
        <div className="container mx-auto px-4 py-4 max-w-2xl flex items-center justify-between">
          <span className="text-sm text-foreground/70 uppercase tracking-wide"> {new Date().getFullYear()} © linkpreview</span>
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/code_kartik"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <SettingsProvider>
      <LinkPreviewContent />
    </SettingsProvider>
  )
}
