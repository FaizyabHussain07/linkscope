import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Code2, Image, Search, ShieldCheck, SlidersHorizontal } from "lucide-react"

export const metadata: Metadata = {
  title: "Features | LinkScope",
  description: "Inspect URL metadata, validate social tags, preview link cards, and export actionable results with LinkScope.",
}

const features = [
  ["URL inspection", "Fetch a public page securely, follow safe redirects, and see the final response and extracted document metadata.", Search],
  ["Open Graph analysis", "Check og:title, og:description, og:image, canonical social URLs, duplicates, empty values, and image hints.", SlidersHorizontal],
  ["Social previews", "View estimated Facebook, LinkedIn, X, Discord, Slack, Telegram, and WhatsApp previews using extracted values.", Image],
  ["Developer output", "Copy raw JSON or generated HTML metadata and export bulk results as JSON or CSV.", Code2],
  ["Actionable audit", "See deterministic checks, findings, and recommendations based on the page that was actually inspected.", Check],
  ["SSRF-aware fetching", "HTTP(S)-only requests, DNS address validation, redirect revalidation, size limits, and timeouts protect the fetcher.", ShieldCheck],
] as const

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/60"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link href="/" className="font-semibold">LinkScope</Link><Link href="/inspect" className="text-sm text-muted-foreground hover:text-foreground">Inspect a URL <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div></header>
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Product capabilities</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">Everything you need to understand a link before you share it.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">LinkScope keeps the workflow focused: inspect the public page, understand the metadata, preview the result, and make a precise fix.</p>
        <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {features.map(([title, description, Icon]) => <section key={title} className="border-t border-border/70 pt-5"><Icon className="h-5 w-5 text-brand-500" /><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{description}</p></section>)}
        </div>
        <div className="mt-16 border-t border-border/70 pt-8"><Link href="/tools" className="font-medium text-brand-500 hover:underline">Open the generator, bulk inspector, and comparison tools <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div>
      </div>
    </main>
  )
}
