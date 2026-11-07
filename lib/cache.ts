import normalizeUrl from "normalize-url"

export function nocache(url: string): string {
  if (!url) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}_t=${Date.now()}`
}

export function formatUrl(url: string): string {
  if (!url) return url
  
  const trimmed = url.trim()
  
  let urlToNormalize = trimmed
  if (!trimmed.match(/^https?:\/\//i)) {
    urlToNormalize = `https://${trimmed}`
  }
  
  try {
    return normalizeUrl(urlToNormalize, {
      forceHttps: true,
      stripHash: false,
      stripWWW: false,
      removeTrailingSlash: false,
      removeDirectoryIndex: false,
    })
  } catch {
    return urlToNormalize
  }
}
