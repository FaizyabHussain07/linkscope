import { describe, expect, it } from "vitest"
import { extractMetadata } from "./index"

describe("metadata extraction", () => {
  it("extracts and resolves page metadata", () => {
    const metadata = extractMetadata(`<!doctype html>
      <html lang="en"><head>
        <title>Example page</title>
        <meta name="description" content="A useful description">
        <meta property="og:title" content="Social title">
        <meta property="og:image" content="/share.png">
        <meta name="twitter:card" content="summary_large_image">
        <link rel="canonical" href="/page">
      </head></html>`, "https://example.com/start")

    expect(metadata.title).toBe("Example page")
    expect(metadata.ogImage).toBe("https://example.com/share.png")
    expect(metadata.canonical).toBe("https://example.com/page")
    expect(metadata.twitterCard).toBe("summary_large_image")
  })

  it("reports missing required social metadata", () => {
    const metadata = extractMetadata("<html><head><title>Only title</title></head></html>", "https://example.com")
    expect(metadata.missingRequired).toContain("og:image")
    expect(metadata.missingRequired).toContain("description")
  })
})
