/**
 * URL resolution utilities
 */

/**
 * Resolve a relative URL against a base URL
 */
export function resolveRelativeUrl(url: string | undefined, baseUrl: string): string | undefined {
  if (!url) return undefined;

  // Already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Protocol-relative
  if (url.startsWith('//')) {
    try {
      const base = new URL(baseUrl);
      return `${base.protocol}${url}`;
    } catch {
      return url;
    }
  }

  // Absolute path
  if (url.startsWith('/')) {
    try {
      const base = new URL(baseUrl);
      return `${base.origin}${url}`;
    } catch {
      return url;
    }
  }

  // Relative path
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

/**
 * Parse a URL and extract hostname
 */
export function getHostname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Get display URL (hostname + pathname)
 */
export function getDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname + parsed.pathname;
  } catch {
    return url;
  }
}

/**
 * Format URL consistently
 */
export function formatUrl(url: string): string {
  if (!url) return url;

  const trimmed = url.trim();

  // Add protocol if missing
  let urlToParse = trimmed;
  if (!trimmed.match(/^https?:\/\//i)) {
    urlToParse = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(urlToParse);
    // Normalize: lowercase hostname, remove default ports
    parsed.hostname = parsed.hostname.toLowerCase();
    if (parsed.port === '80' && parsed.protocol === 'http:') {
      parsed.port = '';
    }
    if (parsed.port === '443' && parsed.protocol === 'https:') {
      parsed.port = '';
    }
    return parsed.toString();
  } catch {
    return urlToParse;
  }
}

/**
 * Check if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
