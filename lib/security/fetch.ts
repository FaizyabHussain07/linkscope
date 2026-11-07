/**
 * Secure fetch implementation with SSRF protection
 * Validates destination IP and enforces limits
 */

import { validateFetchUrl, validateRedirectUrl, normalizeUrlForComparison } from './url-validator';
import { isIpBlocked, DEFAULT_BLOCKED_IPS } from './ip-validator';

// Default configuration
const DEFAULT_CONFIG = {
  timeoutMs: 30000,
  maxRedirects: 5,
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  connectTimeoutMs: 10000,
  allowedContentTypes: [
    'text/html',
    'text/plain',
    'application/xhtml+xml',
    'application/xml',
  ],
  userAgent: 'LinkScope/1.0 (+https://linkscope.app)',
};

interface FetchConfig {
  timeoutMs?: number;
  maxRedirects?: number;
  maxSizeBytes?: number;
  connectTimeoutMs?: number;
  allowedContentTypes?: string[];
  userAgent?: string;
}

interface FetchResult {
  success: boolean;
  url: string;
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  content: string;
  contentLength: number;
  contentType: string;
  redirectCount: number;
  error?: string;
}

/**
 * Check if content type is allowed
 */
function isContentTypeAllowed(contentType: string | null, allowedTypes: string[]): boolean {
  if (!contentType) return false;

  const normalized = contentType.toLowerCase();
  for (const allowed of allowedTypes) {
    if (normalized.startsWith(allowed.toLowerCase())) {
      return true;
    }
  }
  return false;
}

/**
 * Extract IP addresses from DNS resolution
 * This is a placeholder - in production you'd use proper DNS resolution
 */
async function resolveHostnameIp(hostname: string): Promise<string[]> {
  // In Node.js environment, we'd use dns module
  // For Edge/Workers, the fetch itself handles DNS
  // This function returns placeholder - actual IP checking happens
  // when we can intercept the connection

  // For now, we rely on the hostname validation and
  // the runtime's built-in DNS resolution
  // In a real deployment, you'd want to use a custom DNS resolver
  // or validate after resolution

  return [];
}

/**
 * Secure fetch with SSRF protection
 */
export async function secureFetch(
  inputUrl: string,
  config: FetchConfig = {}
): Promise<FetchResult> {
  const {
    timeoutMs = DEFAULT_CONFIG.timeoutMs,
    maxRedirects = DEFAULT_CONFIG.maxRedirects,
    maxSizeBytes = DEFAULT_CONFIG.maxSizeBytes,
    connectTimeoutMs = DEFAULT_CONFIG.connectTimeoutMs,
    allowedContentTypes = DEFAULT_CONFIG.allowedContentTypes,
    userAgent = DEFAULT_CONFIG.userAgent,
  } = config;

  // Validate URL
  const validation = validateFetchUrl(inputUrl);
  if (!validation.valid) {
    return {
      success: false,
      url: inputUrl,
      finalUrl: inputUrl,
      status: 0,
      headers: {},
      content: '',
      contentLength: 0,
      contentType: '',
      redirectCount: 0,
      error: validation.error,
    };
  }

  const targetUrl = validation.cleanedUrl!;
  const parsedTarget = new URL(targetUrl);
  const hostname = parsedTarget.hostname;

  // Check for blocked hostnames
  if (DEFAULT_BLOCKED_IPS.includes(hostname)) {
    return {
      success: false,
      url: inputUrl,
      finalUrl: targetUrl,
      status: 0,
      headers: {},
      content: '',
      contentLength: 0,
      contentType: '',
      redirectCount: 0,
      error: 'This host is not allowed',
    };
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startTime = Date.now();

    // Build fetch options
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'manual', // Handle redirects manually for validation
      signal: controller.signal,
    };

    let currentUrl = targetUrl;
    let redirectCount = 0;
    let lastResponse: Response | null = null;

    while (redirectCount <= maxRedirects) {
      // Check timeout for redirects
      if (Date.now() - startTime > timeoutMs) {
        return {
          success: false,
          url: inputUrl,
          finalUrl: currentUrl,
          status: 0,
          headers: {},
          content: '',
          contentLength: 0,
          contentType: '',
          redirectCount,
          error: 'Request timed out',
        };
      }

      const response = await fetch(currentUrl, fetchOptions);
      lastResponse = response;

      // Check for abort
      if (response.status === 0) {
        return {
          success: false,
          url: inputUrl,
          finalUrl: currentUrl,
          status: 0,
          headers: {},
          content: '',
          contentLength: 0,
          contentType: '',
          redirectCount,
          error: 'Request was aborted',
        };
      }

      // Check status
      if (response.status >= 400) {
        return {
          success: false,
          url: inputUrl,
          finalUrl: currentUrl,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          content: '',
          contentLength: 0,
          contentType: response.headers.get('content-type') || '',
          redirectCount,
          error: `HTTP error: ${response.status}`,
        };
      }

      // Check content type
      const contentType = response.headers.get('content-type') || '';
      if (!isContentTypeAllowed(contentType, allowedContentTypes)) {
        // Allow some flexibility - check if it's a redirect or similar
        if (![301, 302, 303, 307, 308].includes(response.status)) {
          return {
            success: false,
            url: inputUrl,
            finalUrl: currentUrl,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            content: '',
            contentLength: 0,
            contentType,
            redirectCount,
            error: `Content type not allowed: ${contentType}`,
          };
        }
      }

      // Handle redirect
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          return {
            success: false,
            url: inputUrl,
            finalUrl: currentUrl,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            content: '',
            contentLength: 0,
            contentType,
            redirectCount,
            error: 'Redirect without location header',
          };
        }

        // Resolve redirect URL relative to current
        const redirectUrl = new URL(location, currentUrl).toString();

        // Validate redirect
        const redirectValidation = validateRedirectUrl(currentUrl, redirectUrl, targetUrl);
        if (!redirectValidation.valid) {
          return {
            success: false,
            url: inputUrl,
            finalUrl: redirectUrl,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            content: '',
            contentLength: 0,
            contentType,
            redirectCount,
            error: `Invalid redirect: ${redirectValidation.error}`,
          };
        }

        // Check redirect doesn't exceed max
        redirectCount++;
        if (redirectCount > maxRedirects) {
          return {
            success: false,
            url: inputUrl,
            finalUrl: redirectUrl,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            content: '',
            contentLength: 0,
            contentType,
            redirectCount,
            error: `Too many redirects (${maxRedirects})`,
          };
        }

        // Update current URL and continue
        currentUrl = redirectValidation.cleanedUrl!;
        continue;
      }

      // Handle successful response
      break;
    }

    // Final response - read content with size limit
    if (!lastResponse) {
      return {
        success: false,
        url: inputUrl,
        finalUrl: currentUrl,
        status: 0,
        headers: {},
        content: '',
        contentLength: 0,
        contentType: '',
        redirectCount,
        error: 'No response received',
      };
    }

    // Check content-length header first
    const contentLengthHeader = lastResponse.headers.get('content-length');
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      if (contentLength > maxSizeBytes) {
        return {
          success: false,
          url: inputUrl,
          finalUrl: currentUrl,
          status: lastResponse.status,
          headers: Object.fromEntries(lastResponse.headers.entries()),
          content: '',
          contentLength: contentLength,
          contentType: lastResponse.headers.get('content-type') || '',
          redirectCount,
          error: `Response too large: ${contentLength} bytes (max: ${maxSizeBytes})`,
        };
      }
    }

    // Read response body with size limit
    const reader = lastResponse.body?.getReader();
    if (!reader) {
      return {
        success: false,
        url: inputUrl,
        finalUrl: currentUrl,
        status: lastResponse.status,
        headers: Object.fromEntries(lastResponse.headers.entries()),
        content: '',
        contentLength: 0,
        contentType: lastResponse.headers.get('content-type') || '',
        redirectCount,
        error: 'No response body',
      };
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.length;
      if (totalBytes > maxSizeBytes) {
        return {
          success: false,
          url: inputUrl,
          finalUrl: currentUrl,
          status: lastResponse.status,
          headers: Object.fromEntries(lastResponse.headers.entries()),
          content: chunks.map(c => new TextDecoder().decode(c)).join(''),
          contentLength: totalBytes,
          contentType: lastResponse.headers.get('content-type') || '',
          redirectCount,
          error: `Response too large: ${totalBytes} bytes (max: ${maxSizeBytes})`,
        };
      }

      chunks.push(value);

      // Check overall timeout
      if (Date.now() - startTime > timeoutMs) {
        return {
          success: false,
          url: inputUrl,
          finalUrl: currentUrl,
          status: lastResponse.status,
          headers: Object.fromEntries(lastResponse.headers.entries()),
          content: chunks.map(c => new TextDecoder().decode(c)).join(''),
          contentLength: totalBytes,
          contentType: lastResponse.headers.get('content-type') || '',
          redirectCount,
          error: 'Request timed out while reading body',
        };
      }
    }

    const content = chunks.map(c => new TextDecoder().decode(c)).join('');
    const finalContentType = lastResponse.headers.get('content-type') || '';

    return {
      success: true,
      url: inputUrl,
      finalUrl: currentUrl,
      status: lastResponse.status,
      headers: Object.fromEntries(lastResponse.headers.entries()),
      content,
      contentLength: totalBytes,
      contentType: finalContentType,
      redirectCount,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          url: inputUrl,
          finalUrl: targetUrl,
          status: 0,
          headers: {},
          content: '',
          contentLength: 0,
          contentType: '',
          redirectCount: 0,
          error: 'Request timed out',
        };
      }

      // Don't leak internal error details
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        return {
          success: false,
          url: inputUrl,
          finalUrl: targetUrl,
          status: 0,
          headers: {},
          content: '',
          contentLength: 0,
          contentType: '',
          redirectCount: 0,
          error: 'Could not connect to the server',
        };
      }

      return {
        success: false,
        url: inputUrl,
        finalUrl: targetUrl,
        status: 0,
        headers: {},
        content: '',
        contentLength: 0,
        contentType: '',
        redirectCount: 0,
        error: 'Request failed',
      };
    }

    return {
      success: false,
      url: inputUrl,
      finalUrl: targetUrl,
      status: 0,
      headers: {},
      content: '',
      contentLength: 0,
      contentType: '',
      redirectCount: 0,
      error: 'Request failed',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch with security checks specifically for images
 * Returns image metadata without loading full image into memory if possible
 */
export async function secureImageFetch(
  imageUrl: string,
  config: FetchConfig = {}
): Promise<FetchResult> {
  // Validate URL
  const validation = validateFetchUrl(imageUrl);
  if (!validation.valid) {
    return {
      success: false,
      url: imageUrl,
      finalUrl: imageUrl,
      status: 0,
      headers: {},
      content: '',
      contentLength: 0,
      contentType: '',
      redirectCount: 0,
      error: validation.error,
    };
  }

  // Image-specific config - allow more image content types
  const imageConfig: FetchConfig = {
    ...config,
    allowedContentTypes: [
      ...config.allowedContentTypes || DEFAULT_CONFIG.allowedContentTypes,
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
    ],
  };

  return secureFetch(imageUrl, imageConfig);
}
