import { MetaData } from "@/hooks/use-metadata"

export function generateHtmlMetaTags(metadata: MetaData): string {
  const tags: string[] = []

  if (metadata.charset) {
    tags.push(`  <meta charset="${escapeHtml(metadata.charset)}">`)
  }

  if (metadata.viewport) {
    tags.push(`  <meta name="viewport" content="${escapeHtml(metadata.viewport)}">`)
  }

  if (metadata.title) {
    tags.push(`  <title>${escapeHtml(metadata.title)}</title>`)
  }

  if (metadata.description) {
    tags.push(`  <meta name="description" content="${escapeHtml(metadata.description)}">`)
  }

  if (metadata.robots) {
    tags.push(`  <meta name="robots" content="${escapeHtml(metadata.robots)}">`)
  }

  if (metadata.author) {
    tags.push(`  <meta name="author" content="${escapeHtml(metadata.author)}">`)
  }

  if (metadata.generator) {
    tags.push(`  <meta name="generator" content="${escapeHtml(metadata.generator)}">`)
  }

  if (metadata.themeColor) {
    tags.push(`  <meta name="theme-color" content="${escapeHtml(metadata.themeColor)}">`)
  }

  if (metadata.canonical) {
    tags.push(`  <link rel="canonical" href="${escapeHtml(metadata.canonical)}">`)
  }

  if (metadata.favicon || metadata.icon) {
    const iconUrl = metadata.favicon || metadata.icon
    tags.push(`  <link rel="icon" href="${escapeHtml(iconUrl!)}">`)
  }

  if (metadata.ogTitle) {
    tags.push(`  <meta property="og:title" content="${escapeHtml(metadata.ogTitle)}">`)
  }

  if (metadata.ogDescription) {
    tags.push(`  <meta property="og:description" content="${escapeHtml(metadata.ogDescription)}">`)
  }

  if (metadata.ogImage) {
    tags.push(`  <meta property="og:image" content="${escapeHtml(metadata.ogImage)}">`)
  }

  if (metadata.ogType) {
    tags.push(`  <meta property="og:type" content="${escapeHtml(metadata.ogType)}">`)
  }

  if (metadata.ogUrl) {
    tags.push(`  <meta property="og:url" content="${escapeHtml(metadata.ogUrl)}">`)
  }

  if (metadata.ogSiteName) {
    tags.push(`  <meta property="og:site_name" content="${escapeHtml(metadata.ogSiteName)}">`)
  }

  if (metadata.ogLocale) {
    tags.push(`  <meta property="og:locale" content="${escapeHtml(metadata.ogLocale)}">`)
  }

  if (metadata.twitterCard) {
    tags.push(`  <meta name="twitter:card" content="${escapeHtml(metadata.twitterCard)}">`)
  }

  if (metadata.twitterTitle) {
    tags.push(`  <meta name="twitter:title" content="${escapeHtml(metadata.twitterTitle)}">`)
  }

  if (metadata.twitterDescription) {
    tags.push(`  <meta name="twitter:description" content="${escapeHtml(metadata.twitterDescription)}">`)
  }

  if (metadata.twitterImage) {
    tags.push(`  <meta name="twitter:image" content="${escapeHtml(metadata.twitterImage)}">`)
  }

  if (metadata.twitterSite) {
    tags.push(`  <meta name="twitter:site" content="${escapeHtml(metadata.twitterSite)}">`)
  }

  if (metadata.twitterCreator) {
    tags.push(`  <meta name="twitter:creator" content="${escapeHtml(metadata.twitterCreator)}">`)
  }

  Object.keys(metadata).forEach((key) => {
    if (key.startsWith("meta_") && metadata[key]) {
      const metaName = key.replace("meta_", "").replace(/_/g, ":")
      tags.push(`  <meta name="${escapeHtml(metaName)}" content="${escapeHtml(metadata[key]!)}">`)
    }

    if (key.startsWith("link_") && metadata[key]) {
      const linkRel = key.replace("link_", "").replace(/_/g, ":")
      tags.push(`  <link rel="${escapeHtml(linkRel)}" href="${escapeHtml(metadata[key]!)}">`)
    }
  })

  return tags.join("\n")
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
