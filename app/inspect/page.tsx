"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { SettingsProvider } from "@/context/settings-context";
import { useMetadata } from "@/hooks/use-metadata";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { UrlInput } from "@/components/url-input";
import {
  TelegramPreview,
  DiscordPreview,
  SlackPreview,
  XPreview,
  FacebookPreview,
  LinkedInPreview,
  WhatsAppPreview,
} from "@/components/previews";
import { ScoreDisplay } from "@/components/score-display";
import {
  BasicMetadata,
  OpenGraphMetadata,
  TwitterMetadata,
  ImagesMetadata,
  RawMetadata,
} from "@/components/metadata-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Copy, X, Check, ChevronDown, Shield, Star } from "lucide-react";
import { GitHubStars } from "@/components/github-stars";
import { Button } from "@/components/ui/button";
import { formatUrl } from "@/lib/cache";
import { cn, copyToClipboard, getRecentUrls, addRecentUrl, clearRecentUrls, getUrlHostname } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const EXAMPLE_URLS = ["github.com", "vercel.com", "tailwindcss.com"];

function LinkScopeContent() {
  const {
    url,
    setUrl,
    metadata,
    loading,
    error,
    fetchMetadata,
    clear,
    refresh,
  } = useMetadata();

  const [localError, setLocalError] = useState<string>("");
  const [localhostExpanded, setLocalhostExpanded] = useState(true);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedTunnel, setCopiedTunnel] = useState(false);
  const [recentUrls, setRecentUrls] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return getRecentUrls();
    }
    return [];
  });
  const [githubStars, setGithubStars] = useState<number>(0);
  const [securityNote, setSecurityNote] = useState(false);
  const lastAddedUrlRef = useRef<string>("");

  const handleSubmit = useCallback(
    (urlToFetch: string) => {
      setLocalError("");
      fetchMetadata(urlToFetch);
    },
    [fetchMetadata],
  );

  const handleCopyInstall = useCallback(async () => {
    const success = await copyToClipboard("npm install -g ngrok");
    if (success) {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    }
  }, []);

  const handleCopyTunnel = useCallback(async () => {
    const success = await copyToClipboard("ngrok http 3000");
    if (success) {
      setCopiedTunnel(true);
      setTimeout(() => setCopiedTunnel(false), 2000);
    }
  }, []);

  useEffect(() => {
    if (metadata && url && !loading && lastAddedUrlRef.current !== url) {
      addRecentUrl(url);
      lastAddedUrlRef.current = url;
      requestAnimationFrame(() => {
        setRecentUrls(getRecentUrls());
      });
    }
  }, [metadata, url, loading]);

  useEffect(() => {
    const fetchGitHubStars = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/FaizyabHussain07/linkscope");
        if (response.ok) {
          const data = await response.json();
          setGithubStars(data.stargazers_count || 0);
        }
      } catch {
        setGithubStars(0);
      }
    };
    fetchGitHubStars();
  }, []);

  const handleClearRecent = useCallback(() => {
    clearRecentUrls();
    setRecentUrls([]);
  }, []);

  const handleRecentClick = useCallback(
    (recentUrl: string) => {
      const normalized = formatUrl(recentUrl);
      setUrl(normalized);
      handleSubmit(normalized);
    },
    [setUrl, handleSubmit],
  );

  const handleExampleClick = useCallback(
    (exampleUrl: string) => {
      const normalized = formatUrl(exampleUrl);
      setUrl(normalized);
      handleSubmit(normalized);
    },
    [setUrl, handleSubmit],
  );

  useKeyboardShortcuts({
    onPlatformSelect: () => {},
    onClear: clear,
    onRefresh: refresh,
    onFocusInput: () => {
      const input = document.querySelector('input[type="url"]') as HTMLInputElement;
      input?.focus();
    },
  });

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col">
      <header className="w-full border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight">LinkScope</span>
              <span className="text-xs text-[#A1A1AA] ml-2">inspect</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSecurityNote(!securityNote)}
                  className="text-[#A1A1AA] hover:text-white transition-colors p-2"
                >
                  <Shield className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Security protected · SSRF safe</p>
              </TooltipContent>
            </Tooltip>
            <a
              href="https://github.com/FaizyabHussain07/linkscope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A1A1AA] hover:text-white transition-colors"
            >
              <GitHubStars repo="FaizyabHussain07/linkscope" stargazersCount={githubStars} />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12 flex-1">
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              Inspect any URL
            </h1>
            <p className="text-[#A1A1AA]">
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
                  <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">TRY THESE</p>
                  <div className="flex flex-wrap gap-4">
                    {EXAMPLE_URLS.map((exampleUrl) => (
                      <button
                        key={exampleUrl}
                        onClick={() => handleExampleClick(exampleUrl)}
                        className="flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors"
                      >
                        <span className="text-[#6366F1]">›</span>
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
                    <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">LOCALHOST</p>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-[#A1A1AA] transition-transform",
                        localhostExpanded ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {localhostExpanded && (
                    <div className="space-y-4 pt-3">
                      <p className="text-sm text-[#A1A1AA]">
                        Test your local server using ngrok
                      </p>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="text-xs text-[#52525B]">1. INSTALL</div>
                          <div className="flex items-center gap-2 group">
                            <code className="flex-1 bg-[#18181B] px-3 py-2 rounded text-sm font-mono text-white/90">
                              npm install -g ngrok
                            </code>
                            <button
                              onClick={handleCopyInstall}
                              className={cn(
                                "transition-all p-1.5 rounded",
                                copiedInstall
                                  ? "opacity-100 bg-green-500/20 text-green-500"
                                  : "opacity-0 group-hover:opacity-100 hover:bg-[#27272A] text-[#A1A1AA]"
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
                          <div className="text-xs text-[#52525B]">
                            2. START YOUR LOCAL SERVER ON PORT 3000
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-xs text-[#52525B]">3. RUN TUNNEL</div>
                          <div className="flex items-center gap-2 group">
                            <code className="flex-1 bg-[#18181B] px-3 py-2 rounded text-sm font-mono text-white/90">
                              ngrok http 3000
                            </code>
                            <button
                              onClick={handleCopyTunnel}
                              className={cn(
                                "transition-all p-1.5 rounded",
                                copiedTunnel
                                  ? "opacity-100 bg-green-500/20 text-green-500"
                                  : "opacity-0 group-hover:opacity-100 hover:bg-[#27272A] text-[#A1A1AA]"
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
                          <div className="text-xs text-[#52525B]">
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

          {securityNote && (
            <div className="flex items-start gap-3 p-4 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-lg">
              <Shield className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-[#6366F1] mb-1">Security Protected</p>
                <p className="text-[#A1A1AA]">
                  All URLs are validated and checked for SSRF vulnerabilities before fetching.
                  Private IPs, localhost, and cloud metadata endpoints are blocked.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-24">
              <div className="loader" style={{ color: 'var(--foreground)' }} />
            </div>
          )}

          {(error || localError) && !loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Unable to fetch preview</h2>
              <p className="text-[#A1A1AA] text-center max-w-md">
                {error || localError}
              </p>
              <Button onClick={clear} variant="outline" className="mt-4 border-[#27272A] hover:bg-[#18181B] text-white">
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
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                  >
                    SCORE
                  </TabsTrigger>
                  <TabsTrigger
                    value="previews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                  >
                    PREVIEWS
                  </TabsTrigger>
                  <TabsTrigger
                    value="basic"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                  >
                    BASIC
                  </TabsTrigger>
                  <TabsTrigger
                    value="opengraph"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                  >
                    OPEN GRAPH
                  </TabsTrigger>
                  <TabsTrigger
                    value="x"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                  >
                    X
                  </TabsTrigger>
                  <TabsTrigger
                    value="images"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                  >
                    IMAGES
                  </TabsTrigger>
                  <TabsTrigger
                    value="raw"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
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
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                      >
                        TELEGRAM
                      </TabsTrigger>
                      <TabsTrigger
                        value="discord"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                      >
                        DISCORD
                      </TabsTrigger>
                      <TabsTrigger
                        value="slack"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                      >
                        SLACK
                      </TabsTrigger>
                      <TabsTrigger
                        value="x"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                      >
                        X
                      </TabsTrigger>
                      <TabsTrigger
                        value="facebook"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                      >
                        FACEBOOK
                      </TabsTrigger>
                      <TabsTrigger
                        value="linkedin"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
                      >
                        LINKEDIN
                      </TabsTrigger>
                      <TabsTrigger
                        value="whatsapp"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#6366F1] data-[state=active]:bg-transparent px-4 py-3 text-[#A1A1AA] hover:text-white"
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
                <BasicMetadata metadata={metadata} url={url} />
              </TabsContent>

              <TabsContent value="opengraph" className="mt-8">
                <OpenGraphMetadata metadata={metadata} url={url} />
              </TabsContent>

              <TabsContent value="x" className="mt-8">
                <TwitterMetadata metadata={metadata} url={url} />
              </TabsContent>

              <TabsContent value="images" className="mt-8">
                <ImagesMetadata metadata={metadata} url={url} />
              </TabsContent>

              <TabsContent value="raw" className="mt-8">
                <RawMetadata metadata={metadata} url={url} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}

function InspectPage() {
  return (
    <SettingsProvider initialSettings={{}}
      setSettings={() => {}}>
      <LinkScopeContent />
    </SettingsProvider>
  );
}

export default InspectPage;
