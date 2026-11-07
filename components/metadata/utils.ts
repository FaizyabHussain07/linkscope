export function parseCanonicalUrl(canonical?: string): string | null {
  if (!canonical) return null
  try {
    const url = new URL(canonical)
    return url.origin + url.pathname
  } catch {
    return canonical
  }
}

export function getBaseUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.origin
  } catch {
    return url
  }
}
