"use client"

import Link from "next/link"
import { useState } from "react"
import type { ReactNode } from "react"
import { ArrowLeft, Check, Clipboard, Download, ExternalLink, Loader2, Search, WandSparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { copyToClipboard } from "@/lib/utils"

type ToolStatus = { loading: boolean; error: string; copied: boolean }
type GeneratorResult = { html: string; nextjsDynamic: string; nextjsStatic: string; react: string }
type BulkResult = { url: string; success: boolean; error?: string; statusCode?: number; metadata?: { title?: string; description?: string; ogImage?: string; twitterCard?: string } }
type CompareResult = {
  summary: { totalFields: number; differentFields: number; similarity: number }
  comparison: Record<string, { url1?: string | number; url2?: string | number; different: boolean }>
}

const initialStatus: ToolStatus = { loading: false, error: "", copied: false }

export default function ToolsPage() {
  const [generator, setGenerator] = useState({ title: "", description: "", url: "", siteName: "", imageUrl: "" })
  const [generated, setGenerated] = useState<GeneratorResult | null>(null)
  const [generatorStatus, setGeneratorStatus] = useState(initialStatus)
  const [bulkUrls, setBulkUrls] = useState("")
  const [bulkResults, setBulkResults] = useState<BulkResult[] | null>(null)
  const [bulkStatus, setBulkStatus] = useState(initialStatus)
  const [compareUrls, setCompareUrls] = useState({ url1: "", url2: "" })
  const [comparison, setComparison] = useState<CompareResult | null>(null)
  const [compareStatus, setCompareStatus] = useState(initialStatus)

  const runGenerator = async () => {
    setGeneratorStatus({ ...initialStatus, loading: true })
    try {
      const payload = {
        ...generator,
        ...(generator.siteName ? { siteName: generator.siteName } : {}),
        ...(generator.imageUrl ? { imageUrl: generator.imageUrl } : {}),
      }
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json() as { generated?: GeneratorResult; error?: string }
      if (!response.ok || !data.generated) throw new Error(data.error || "Could not generate metadata")
      setGenerated(data.generated)
    } catch (error) {
      setGeneratorStatus({ ...initialStatus, error: error instanceof Error ? error.message : "Could not generate metadata" })
    } finally {
      setGeneratorStatus((current) => ({ ...current, loading: false }))
    }
  }

  const runBulk = async () => {
    const urls = bulkUrls.split(/\r?\n|,/).map((value) => value.trim()).filter(Boolean)
    setBulkStatus({ ...initialStatus, loading: true })
    setBulkResults(null)
    try {
      const response = await fetch("/api/v1/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls, concurrency: 3 }),
      })
      const data = await response.json() as { results?: BulkResult[]; error?: string }
      if (!response.ok || !data.results) throw new Error(data.error || "Could not inspect URLs")
      setBulkResults(data.results)
    } catch (error) {
      setBulkStatus({ ...initialStatus, error: error instanceof Error ? error.message : "Could not inspect URLs" })
    } finally {
      setBulkStatus((current) => ({ ...current, loading: false }))
    }
  }

  const runCompare = async () => {
    setCompareStatus({ ...initialStatus, loading: true })
    setComparison(null)
    try {
      const response = await fetch("/api/v1/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compareUrls),
      })
      const data = await response.json() as CompareResult & { error?: string }
      if (!response.ok || !data.comparison) throw new Error(data.error || "Could not compare URLs")
      setComparison(data)
    } catch (error) {
      setCompareStatus({ ...initialStatus, error: error instanceof Error ? error.message : "Could not compare URLs" })
    } finally {
      setCompareStatus((current) => ({ ...current, loading: false }))
    }
  }

  const copyGenerated = async (value: string) => {
    const copied = await copyToClipboard(value)
    if (copied) {
      setGeneratorStatus((current) => ({ ...current, copied: true }))
      window.setTimeout(() => setGeneratorStatus((current) => ({ ...current, copied: false })), 1600)
    }
  }

  const downloadBulk = (format: "json" | "csv") => {
    if (!bulkResults) return
    const content = format === "json"
      ? JSON.stringify(bulkResults, null, 2)
      : [
          "url,success,statusCode,title,description,ogImage,error",
          ...bulkResults.map((result) => [
            result.url, result.success, result.statusCode ?? "", result.metadata?.title ?? "",
            result.metadata?.description ?? "", result.metadata?.ogImage ?? "", result.error ?? "",
          ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")),
        ].join("\n")
    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `linkscope-bulk.${format}`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/inspect" className="flex items-center gap-3 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to inspector
          </Link>
          <span className="font-semibold tracking-tight">LinkScope tools</span>
          <Link href="https://github.com/FaizyabHussain07/linkscope" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Utilities</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Work with inspection data</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Generate production-ready tags, inspect a list of URLs, or compare two pages. All results are computed from real requests.</p>
        </div>

        <Tabs defaultValue="generate">
          <TabsList className="grid h-auto w-full max-w-xl grid-cols-3">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="bulk">Bulk inspect</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
            <Card className="space-y-4 p-5">
              <h2 className="font-semibold">Metadata generator</h2>
              <Input placeholder="Page title" value={generator.title} onChange={(event) => setGenerator({ ...generator, title: event.target.value })} />
              <Textarea placeholder="Description" value={generator.description} onChange={(event) => setGenerator({ ...generator, description: event.target.value })} />
              <Input placeholder="https://example.com/page" value={generator.url} onChange={(event) => setGenerator({ ...generator, url: event.target.value })} />
              <Input placeholder="Site name (optional)" value={generator.siteName} onChange={(event) => setGenerator({ ...generator, siteName: event.target.value })} />
              <Input placeholder="Image URL (optional)" value={generator.imageUrl} onChange={(event) => setGenerator({ ...generator, imageUrl: event.target.value })} />
              <Button onClick={runGenerator} disabled={generatorStatus.loading} className="w-full">
                {generatorStatus.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
                Generate tags
              </Button>
              {generatorStatus.error && <p className="text-sm text-destructive">{generatorStatus.error}</p>}
            </Card>
            <Card className="min-h-[420px] p-5">
              {generated ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">HTML output</h2>
                    <Button variant="outline" size="sm" onClick={() => copyGenerated(generated.html)}>
                      {generatorStatus.copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
                      {generatorStatus.copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <pre className="max-h-[520px] overflow-auto rounded-lg bg-muted p-4 text-xs leading-5"><code>{generated.html}</code></pre>
                </div>
              ) : <EmptyState icon={<WandSparkles className="h-5 w-5" />} text="Fill in the fields to generate valid HTML, Next.js, and React metadata." />}
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="mt-6 space-y-6">
            <Card className="space-y-4 p-5">
              <h2 className="font-semibold">Bulk URL analyzer</h2>
              <Textarea rows={7} placeholder={"https://example.com\nhttps://example.org"} value={bulkUrls} onChange={(event) => setBulkUrls(event.target.value)} />
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={runBulk} disabled={bulkStatus.loading || !bulkUrls.trim()}>
                  {bulkStatus.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Inspect URLs
                </Button>
                {bulkResults && <><Button variant="outline" onClick={() => downloadBulk("json")}><Download className="mr-2 h-4 w-4" /> JSON</Button><Button variant="outline" onClick={() => downloadBulk("csv")}><Download className="mr-2 h-4 w-4" /> CSV</Button></>}
              </div>
              {bulkStatus.error && <p className="text-sm text-destructive">{bulkStatus.error}</p>}
            </Card>
            {bulkResults && <Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/40"><tr><th className="p-3">URL</th><th className="p-3">Status</th><th className="p-3">Title</th><th className="p-3">Metadata</th></tr></thead><tbody>{bulkResults.map((result) => <tr key={result.url} className="border-b last:border-0"><td className="max-w-[280px] truncate p-3 font-mono text-xs">{result.url}</td><td className="p-3">{result.success ? <span className="text-green-600">{result.statusCode}</span> : <span className="text-destructive">Failed</span>}</td><td className="max-w-[260px] truncate p-3">{result.metadata?.title || result.error || "—"}</td><td className="p-3">{result.metadata ? `${[result.metadata.title, result.metadata.description, result.metadata.ogImage, result.metadata.twitterCard].filter(Boolean).length}/4` : "—"}</td></tr>)}</tbody></table></div></Card>}
          </TabsContent>

          <TabsContent value="compare" className="mt-6 space-y-6">
            <Card className="space-y-4 p-5">
              <h2 className="font-semibold">Compare two URLs</h2>
              <div className="grid gap-3 md:grid-cols-2"><Input placeholder="First URL" value={compareUrls.url1} onChange={(event) => setCompareUrls({ ...compareUrls, url1: event.target.value })} /><Input placeholder="Second URL" value={compareUrls.url2} onChange={(event) => setCompareUrls({ ...compareUrls, url2: event.target.value })} /></div>
              <Button onClick={runCompare} disabled={compareStatus.loading}><Search className="mr-2 h-4 w-4" /> Compare metadata</Button>
              {compareStatus.error && <p className="text-sm text-destructive">{compareStatus.error}</p>}
            </Card>
            {comparison && <Card className="overflow-hidden p-0"><div className="flex items-center justify-between border-b p-4"><div><h2 className="font-semibold">Comparison</h2><p className="text-sm text-muted-foreground">{comparison.summary.similarity}% similar · {comparison.summary.differentFields} of {comparison.summary.totalFields} fields differ</p></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/40"><tr><th className="p-3">Field</th><th className="p-3">URL 1</th><th className="p-3">URL 2</th></tr></thead><tbody>{Object.entries(comparison.comparison).map(([field, values]) => <tr key={field} className="border-b last:border-0"><td className="p-3 font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</td><td className={`max-w-[340px] truncate p-3 ${values.different ? "text-amber-600" : ""}`}>{values.url1 ?? "—"}</td><td className={`max-w-[340px] truncate p-3 ${values.different ? "text-amber-600" : ""}`}>{values.url2 ?? "—"}</td></tr>)}</tbody></table></div></Card>}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-center text-muted-foreground"><div className="rounded-full border p-3">{icon}</div><p className="max-w-sm text-sm">{text}</p></div>
}
