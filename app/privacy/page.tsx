import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy | LinkScope",
  description: "How LinkScope processes URL inspection requests and what data the application does and does not retain.",
}

export default function PrivacyPage() {
  return <main className="min-h-screen bg-background"><header className="border-b border-border/60"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4"><Link href="/" className="font-semibold">LinkScope</Link><Link href="/inspect" className="text-sm text-muted-foreground hover:text-foreground">Open inspector</Link></div></header><article className="mx-auto max-w-3xl px-4 py-16"><p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Privacy</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">A focused, no-account inspection workflow</h1><p className="mt-5 leading-7 text-muted-foreground">When you inspect a URL, LinkScope’s server requests that public URL to read its response and metadata. The fetched HTML and inspection result are not written to a LinkScope database.</p><h2 className="mt-12 text-2xl font-semibold">What is processed</h2><p className="mt-3 leading-7 text-muted-foreground">The submitted URL, request metadata needed to perform the fetch, and the returned page content are processed transiently to produce the result. The browser may keep recent URLs locally for convenience.</p><h2 className="mt-10 text-2xl font-semibold">What is not promised</h2><p className="mt-3 leading-7 text-muted-foreground">A third-party website may log the request made to it, and deployment infrastructure may retain operational logs according to its own policy. LinkScope does not claim control over those systems.</p><h2 className="mt-10 text-2xl font-semibold">Security</h2><p className="mt-3 leading-7 text-muted-foreground">Requests are restricted to safe HTTP(S) destinations, validated against resolved IP addresses, limited by size and time, and revalidated across redirects. See the repository security documentation for implementation details.</p></article></main>
}
