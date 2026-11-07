import Link from "next/link";
import { ArrowRight, Shield, Zap, Layers, BarChart3, Code, Download, Check, Copy, Share2, Globe, MessageCircle, Twitter, Linkedin, Users, MessageSquare, Hash, Star, Cpu, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description: "No database. No accounts. No tracking. Your inspection data never leaves your browser or gets stored on our servers.",
  },
  {
    icon: Cpu,
    title: "Secure Server-Side Fetching",
    description: "Enterprise-grade SSRF protection with IP validation, private range blocking, and redirect security. Built for production use.",
  },
  {
    icon: Layers,
    title: "7 Platform Previews",
    description: "Realistic simulations for WhatsApp, Facebook, LinkedIn, X, Discord, Telegram, and Slack. See exactly how your links appear.",
  },
  {
    icon: BarChart3,
    title: "Actionable SEO Audit",
    description: "Deterministic scoring with detailed findings. Get specific recommendations to improve your metadata quality.",
  },
  {
    icon: Code,
    title: "Multi-Format Code Generation",
    description: "Generate production-ready HTML, Next.js Metadata API, Next.js static metadata, and React code snippets.",
  },
  {
    icon: Download,
    title: "Flexible Export Options",
    description: "Download inspection reports as JSON, CSV, or printable HTML. Share results with your team or clients.",
  },
];

const PLATFORMS = [
  { name: "WhatsApp", icon: MessageSquare, color: "#25D366" },
  { name: "Facebook", icon: Globe, color: "#1877F2" },
  { name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { name: "X", icon: Twitter, color: "#000000" },
  { name: "Discord", icon: Users, color: "#5865F2" },
  { name: "Telegram", icon: Share2, color: "#2CABFF" },
  { name: "Slack", icon: Hash, color: "#4A154B" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">LinkScope</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="#platforms" className="text-sm text-gray-400 hover:text-white transition-colors">Platforms</Link>
            <Link href="#security" className="text-sm text-gray-400 hover:text-white transition-colors">Security</Link>
            <Link href="https://github.com/FaizyabHussain07/linkscope" className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">GitHub</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/inspect">
              <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                Inspect a URL
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-gray-300 border-white/10">
              <Star className="w-3 h-3 mr-1 fill-white" />
              Open Source · MIT License
            </Badge>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white">
              See how your links{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                look everywhere
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              The professional toolkit for inspecting, testing, and debugging how your website links
              appear across social platforms. Analyze Open Graph, Twitter Card, and SEO metadata.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/inspect">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-12 px-8 text-base font-medium">
                  Start Inspecting
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8 text-base font-medium">
                  Explore Features
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                No account required
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                No data stored
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                MIT Licensed
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 border border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gray-400 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Demo preview section */}
      <section id="platforms" className="border-t border-white/10 bg-[#0d0d14]">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Preview across platforms</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              See exactly how your content appears when shared. Professional simulations for every major platform.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className="group p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: `${platform.color}20` }}>
                  <platform.icon className="w-6 h-6" style={{ color: platform.color }} />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0a0a0f]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-gray-300 border-white/10">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Professional-grade analysis</h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Everything developers and SEO specialists need to perfect their social metadata.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#0d0d14] border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple workflow</h2>
            <p className="text-gray-400">
              Three steps to better social previews and metadata.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Enter a URL", desc: "Paste any public website URL and submit for inspection." },
              { step: "2", title: "Secure Analysis", desc: "Our server securely fetches and analyzes your page's metadata." },
              { step: "3", title: "View Results", desc: "See platform previews, scores, and actionable recommendations." },
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 w-12 h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-[#0a0a0f] border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-green-500/30 text-green-400">Security</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Enterprise security</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Built with security as a priority. Comprehensive protections against SSRF and other threats.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "SSRF Protection", desc: "All URLs validated against private IP ranges, localhost, and cloud metadata endpoints." },
              { icon: Zap, title: "Request Limits", desc: "Timeout, size, and redirect limits prevent abuse and ensure fast responses." },
              { icon: Layers, title: "No Data Persistence", desc: "We don't store your URLs, HTML, or results. Everything is processed and discarded." },
              { icon: Monitor, title: "Self-Hostable", desc: "Deploy your own instance with zero dependencies. No database required." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-blue-700/10 to-purple-700/20" />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to perfect your social previews?
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Start inspecting your URLs today. Free, open-source, and built for professionals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/inspect">
              <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-gray-200 h-12 px-8 text-base font-medium">
                Inspect a URL Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="https://github.com/FaizyabHussain07/linkscope" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8 text-base font-medium">
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#0a0a0f]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">LinkScope</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="https://github.com/FaizyabHussain07/linkscope" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </Link>
              <Link href="https://linkscope.faizyab.me" className="hover:text-white transition-colors">
                linkscope.faizyab.me
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              MIT Licensed · Built with Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
