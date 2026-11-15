import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Open Graph Metadata Guide | LinkScope",
  description: "Learn what Open Graph tags do, which values matter for link previews, and how to diagnose missing or incorrect social metadata.",
}

export default function OpenGraphGuidePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/60"><div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4"><Link href="/" className="font-semibold">LinkScope</Link><Link href="/inspect" className="text-sm text-muted-foreground hover:text-foreground">Try the inspector</Link></div></header>
      <article className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Guide</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Open Graph metadata: a practical guide</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Open Graph tags describe a page when it is shared. They give a crawler a title, description, image, URL, and context instead of leaving the platform to guess.</p>
        <h2 className="mt-12 text-2xl font-semibold">The core tags</h2>
        <p className="mt-3 leading-7 text-muted-foreground">A useful baseline is <code>og:title</code>, <code>og:description</code>, <code>og:image</code>, <code>og:url</code>, and <code>og:type</code>. Add <code>og:site_name</code> and <code>og:locale</code> when they describe the page accurately.</p>
        <pre className="mt-6 overflow-x-auto rounded-lg bg-muted p-5 text-sm leading-6"><code>{`<meta property="og:title" content="A clear page title">\n<meta property="og:description" content="A concise summary of the page">\n<meta property="og:image" content="https://example.com/share-image.jpg">\n<meta property="og:url" content="https://example.com/page">\n<meta property="og:type" content="website">`}</code></pre>
        <h2 className="mt-12 text-2xl font-semibold">Common failure modes</h2>
        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-muted-foreground"><li>The image URL is relative, inaccessible, or too small for the intended card.</li><li>The title or description is empty, duplicated, or different from the page’s canonical content.</li><li>The page redirects to a different URL but still declares the old social URL.</li><li>Only Open Graph tags exist while X-specific tags are expected by your sharing workflow.</li></ul>
        <p className="mt-10 leading-7 text-muted-foreground">Use the <Link href="/inspect" className="text-brand-500 hover:underline">LinkScope inspector</Link> to read the values served by a public page and get recommendations based on those values.</p>
      </article>
    </main>
  )
}
