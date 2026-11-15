import { describe, expect, it } from "vitest"
import { generateMetadataCode } from "./index"

describe("metadata generation", () => {
  it("escapes values in generated HTML", () => {
    const generated = generateMetadataCode({
      title: 'A "safe" <title>',
      description: "Description",
      url: "https://example.com",
    })

    expect(generated.html).toContain("&quot;safe&quot; &lt;title&gt;")
    expect(generated.html).not.toContain('<title>A "safe"')
  })
})
