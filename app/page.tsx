import Link from "next/link"
import { ArrowRight, Check, ExternalLink, Star, Zap, Shield, Code, Download, Globe, MessageCircle, Twitter, Linkedin, Users, MessageSquare, Hash, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { HeroInspector } from "./components/landing/hero-inspector"

const FEATURES = [
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description: "No database. No accounts. No tracking. Your inspection data never leaves your browser or gets stored.",
  },
  {
    icon: Zap,
    title: "Secure Server-Side Fetching",
    description: "Enterprise-grade SSRF protection with IP validation, private range blocking, and redirect security.",
  },
  {
    icon: MessageCircle,
    title: "7 Platform Previews",
    description: "Realistic simulations for WhatsApp, Facebook, LinkedIn, X, Discord, Telegram, and Slack.",
  },
  {
    icon: Code,
    title: "Actionable SEO Audit",
    description: "Deterministic scoring with detailed findings. Get specific recommendations to improve your metadata.",
  },
  {
    icon: Download,
    title: "Flexible Export Options",
    description: "Download inspection reports as JSON, CSV, or printable HTML. Share results with your team.",
  },
  {
    icon: Globe,
    title: "Self-Hostable",
    description: "Deploy your own instance with zero dependencies. No database required. Full control.",
  },
]

const PLATFORMS = [
  { name: "WhatsApp", icon: MessageSquare, color: "#25D366" },
  { name: "Facebook", icon: Globe, color: "#1877F2" },
  { name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { name: "X", icon: Twitter, color: "#000000" },
  { name: "Discord", icon: Users, color: "#5865F2" },
  { name: "Telegram", icon: MessageCircle, color: "#2CABFF" },
  { name: "Slack", icon: Hash, color: "#4A154B" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Header */}
      <header className="border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight">LinkScope</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[#A1A1AA] transition-colors hover:text-white">Features</Link>
            <Link href="#platforms" className="text-sm text-[#A1A1AA] transition-colors hover:text-white">Platforms</Link>
            <Link href="#security" className="text-sm text-[#A1A1AA] transition-colors hover:text-white">Security</Link>
            <Link href="/tools" className="text-sm text-[#A1A1AA] transition-colors hover:text-white">Tools</Link>
            <Link href="https://github.com/FaizyabHussain07/linkscope" className="text-sm text-[#A1A1AA] transition-colors hover:text-white" target="_blank" rel="noopener noreferrer">GitHub</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/FaizyabHussain07/linkscope" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="border-[#27272A] hover:bg-[#18181B] text-white">
                <Star className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </Link>
            <Link href="/inspect">
              <Button size="sm" className="bg-white text-[#09090B] hover:bg-[#FAFAFA] font-medium">
                Try LinkScope
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#6366F1]/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#8B5CF6]/10 blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-8 text-center">
          <Badge variant="secondary" className="mx-auto mb-6 bg-[#18181B] text-[#A1A1AA] border-[#27272A]">
            <Star className="mr-1.5 h-4 w-4 fill-[#A1A1AA]" />
            Open source · MIT licensed
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            See how your links{" "}
            <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              look everywhere
            </span>
            .
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#A1A1AA] max-w-2xl mx-auto">
            Inspect social media previews, debug Open Graph metadata and improve your website's sharing experience. One powerful toolkit built for developers.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/inspect">
              <Button size="lg" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 h-12">
                Inspect a URL
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/FaizyabHussain07/linkscope" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-[#27272A] hover:bg-[#18181B] text-white px-8 h-12">
                <ExternalLink className="mr-2 h-4 w-4" />
                Explore on GitHub
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#52525B]">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              No account required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              No data stored
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              MIT Licensed
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#52525B]">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="flex h-8 w-5 items-center justify-center rounded-full border border-[#27272A]">
            <div className="mt-2 h-1 w-1 animate-bounce rounded-full bg-[#A1A1AA]" />
          </div>
        </div>
      </section>

      {/* Interactive Hero Inspector */}
      <section className="border-t border-[#27272A] bg-[#0a0a0f]">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <p className="text-center text-sm font-medium text-[#A1A1AA] mb-6">Try it now — paste any URL above</p>
          <HeroInspector />
        </div>
      </section>

      {/* Platform Previews Section */}
      <section id="platforms" className="border-t border-[#27272A] bg-[#0a0a0f]">
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Preview across platforms</h2>
            <p className="mt-4 text-lg text-[#A1A1AA] max-w-xl mx-auto">
              See exactly how your content appears when shared. Professional simulations for every major platform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {PLATFORMS.map((platform) => (
              <Link
                key={platform.name}
                href="/inspect"
                className="group flex flex-col items-center gap-4 rounded-2xl border border-[#27272A] bg-[#111113] p-6 transition-all duration-300 hover:border-[#3F3F46] hover:bg-[#18181B]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${platform.color}20` }}>
                  <platform.icon className="h-6 w-6" style={{ color: platform.color }} />
                </div>
                <span className="text-sm font-medium text-[#A1A1AA] group-hover:text-white transition-colors">
                  {platform.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0a0a0f] border-t border-[#27272A]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Professional-grade analysis</h2>
            <p className="mt-4 text-lg text-[#A1A1AA] max-w-xl mx-auto">
              Everything developers and SEO specialists need to perfect their social metadata.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="group border-[#27272A] bg-[#111113] p-6 transition-all duration-300 hover:border-[#3F3F46] hover:bg-[#18181B]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#18181B] group-hover:bg-[#6366F1]/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-[#6366F1] transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-[#6366F1] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#0a0a0f] border-t border-[#27272A]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple workflow</h2>
            <p className="mt-4 text-[#A1A1AA]">
              Three steps to better social previews and metadata.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Enter a URL", desc: "Paste any public website URL and submit for inspection." },
              { step: "2", title: "Secure Analysis", desc: "Our server securely fetches and analyzes your page's metadata." },
              { step: "3", title: "View Results", desc: "See platform previews, scores, and actionable recommendations." },
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/20 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#A1A1AA]">{item.desc}</p>
                {idx < 2 && (
                  <div className="mx-auto mt-12 hidden h-12 w-px bg-gradient-to-r from-[#27272A] to-transparent md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-[#0a0a0f] border-t border-[#27272A]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mx-auto mb-4 border-green-500/30 text-green-400 bg-green-500/10">
              Security
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise security</h2>
            <p className="mt-4 text-lg text-[#A1A1AA] max-w-xl mx-auto">
              Built with security as a priority. Comprehensive protections against SSRF and other threats.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "SSRF Protection", desc: "All URLs validated against private IP ranges, localhost, and cloud metadata endpoints." },
              { icon: Download, title: "Request Limits", desc: "Timeout, size, and redirect limits prevent abuse and ensure fast responses." },
              { icon: Smartphone, title: "No Data Persistence", desc: "We don't store your URLs, HTML, or results. Everything is processed and discarded." },
              { icon: Globe, title: "Self-Hostable", desc: "Deploy your own instance with zero dependencies. No database required." },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="border-[#27272A] bg-[#111113] p-6 transition-all duration-300 hover:border-[#3F3F46] hover:bg-[#18181B]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <item.icon className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#A1A1AA]">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#27272A] py-12 bg-[#0a0a0f]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-semibold">LinkScope</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#52525B]">
              <Link href="https://github.com/FaizyabHussain07/linkscope" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </Link>
              <Link href="https://linkscope.faizyab.me" className="hover:text-white transition-colors">
                linkscope.faizyab.me
              </Link>
            </div>
            <p className="text-sm text-[#52525B]">
              MIT Licensed · Built with Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
