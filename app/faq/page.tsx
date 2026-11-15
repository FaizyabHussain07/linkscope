import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ | LinkScope",
  description: "Answers about URL inspection, Open Graph metadata, social previews, privacy, and LinkScope’s secure fetching model.",
}

const questions = [
  ["What is LinkScope?", "LinkScope is a developer-focused tool for inspecting public URL metadata, previewing social cards, and identifying practical fixes."],
  ["Does LinkScope store inspected pages?", "The application does not use a database for inspection results. Requests are processed by the server and results are returned to your browser. Browser-local recent URL history may be enabled by the interface."],
  ["Can I inspect a private or local URL?", "No. The fetcher allows HTTP and HTTPS destinations but blocks localhost, private and link-local networks, cloud metadata addresses, and unsafe redirects."],
  ["Are previews exact copies of social platforms?", "No. They are estimated previews based on extracted metadata. Platform-specific crawlers and rendering rules can change independently."],
  ["Why is my image missing?", "The image may be absent, relative, inaccessible, unsupported, or unsuitable for the intended card. LinkScope reports the metadata reference; image inspection can provide additional evidence."],
  ["Can I generate tags?", "Yes. Open Tools to generate escaped HTML, Next.js, and React metadata from values you provide."],
] as const

export default function FaqPage() {
  return <main className="min-h-screen bg-background"><header className="border-b border-border/60"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4"><Link href="/" className="font-semibold">LinkScope</Link><Link href="/inspect" className="text-sm text-muted-foreground hover:text-foreground">Inspect a URL</Link></div></header><article className="mx-auto max-w-3xl px-4 py-16"><p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Questions</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Frequently asked questions</h1><div className="mt-12 divide-y divide-border/70">{questions.map(([question, answer]) => <section key={question} className="py-7"><h2 className="text-lg font-semibold">{question}</h2><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></section>)}</div></article></main>
}
