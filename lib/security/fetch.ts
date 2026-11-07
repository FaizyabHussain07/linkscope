/**
 * Secure fetch implementation with SSRF protection
 * Validates destination IP and enforces limits
 */

import { validateFetchUrl, validateRedirectUrl } from './url-validator';
import { DEFAULT_BLOCKED_IPS } from './ip-validator';

export interface FetchConfig {
  timeoutMs?: number;
  maxRedirects?: number;
  maxSizeBytes?: number;
  connectTimeoutMs?: number;
  allowedContentTypes?: string[];
  userAgent?: string;
}

export interface FetchResult {
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

// Default configuration
const DEFAULT_CONFIG: FetchConfig = {
  timeoutMs: 30000,
  maxRedirects: 5,
  maxSizeBytes: 10 * 1024 * 1024,
  connectTimeoutMs: 10000,
  allowedContentTypes: [
    'text/html',
    'text/plain',
    'application/xhtml+xml',
    'application/xml',
  ],
  userAgent: 'LinkScope/1.0 (+https://linkscope.faizyab.me)',
};

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

export async function secureFetch(
  inputUrl: string,
  config: FetchConfig = {}
): Promise<FetchResult> {
  const timeoutMs: number = config.timeoutMs ?? DEFAULT_CONFIG.timeoutMs;
  const maxRedirects: number = config.maxRedirects ?? DEFAULT_CONFIG.maxRedirects;
  const maxSizeBytes: number = config.maxSizeBytes ?? DEFAULT_CONFIG.maxSizeBytes;
  const allowedContentTypes: string[] = config.allowedContentTypes ?? DEFAULT_CONFIG.allowedContentTypes;
  const userAgent: string = config.userAgent ?? DEFAULT_CONFIG.userAgent;

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
  const hostname = new URL(targetUrl).hostname;

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startTime = Date.now();
    let currentUrl = targetUrl;
    let redirectCount = 0;
    let lastResponse: Response | null = null;

    for (let i = 0; i <= maxRedirects; i++) {
      redirectCount = i;
      if (Date.now() - startTime > timeoutMs) {
        return fail('Request timed out', inputUrl, currentUrl, redirectCount);
      }

      const response = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent || 'LinkScope/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        redirect: 'manual',
        signal: controller.signal,
      });
      lastResponse = response;

      if (response.status === 0) {
        return fail('Request was aborted', inputUrl, currentUrl, redirectCount);
      }

      if (response.status >= 400) {
        return fail(`HTTP error: ${response.status}`, inputUrl, currentUrl, redirectCount, {
          status: response.status,
          contentType: response.headers.get('content-type') || '',
        });
      }

      const contentType = response.headers.get('content-type') || '';
      if (!isContentTypeAllowed(contentType, allowedContentTypes)) {
        if (![301, 302, 303, 307, 308].includes(response.status)) {
          return fail(`Content type not allowed: ${contentType}`, inputUrl, currentUrl, redirectCount, {
            contentType,
          });
        }
      }

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          return fail('Redirect without location header', inputUrl, currentUrl, redirectCount, {
            contentType,
          });
        }

        const redirectUrl = new URL(location, currentUrl).toString();
        const redirectValidation = validateRedirectUrl(currentUrl, redirectUrl, targetUrl);
        if (!redirectValidation.valid) {
          return fail(`Invalid redirect: ${redirectValidation.error}`, inputUrl, redirectUrl, redirectCount, {
            contentType,
          });
        }

        currentUrl = redirectValidation.cleanedUrl!;
        continue;
      }

      break;
    }

    if (!lastResponse) {
      return fail('No response received', inputUrl, currentUrl, redirectCount);
    }

    const contentLengthHeader = lastResponse.headers.get('content-length');
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      if (contentLength > maxSizeBytes) {
        return fail(`Response too large: ${contentLength} bytes (max: ${maxSizeBytes})`, inputUrl, currentUrl, redirectCount, {
          status: lastResponse.status,
          contentType: lastResponse.headers.get('content-type') || '',
          contentLength,
        });
      }
    }

    const reader = lastResponse.body?.getReader();
    if (!reader) {
      return fail('No response body', inputUrl, currentUrl, redirectCount, {
        status: lastResponse.status,
        contentType: lastResponse.headers.get('content-type') || '',
      });
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.length;
      if (totalBytes > maxSizeBytes) {
        return fail(`Response too large: ${totalBytes} bytes (max: ${maxSizeBytes})`, inputUrl, currentUrl, redirectCount, {
          status: lastResponse.status,
          contentType: lastResponse.headers.get('content-type') || '',
          contentLength: totalBytes,
          partialContent: chunks.map(c => new TextDecoder().decode(c)).join(''),
        });
      }

      chunks.push(value);

      if (Date.now() - startTime > timeoutMs) {
        return fail('Request timed out while reading body', inputUrl, currentUrl, redirectCount, {
          status: lastResponse.status,
          contentType: lastResponse.headers.get('content-type') || '',
          contentLength: totalBytes,
          partialContent: chunks.map(c => new TextDecoder().decode(c)).join(''),
        });
      }
    }

    const content = chunks.map(c => new TextDecoder().decode(c)).join('');
    const finalContentType = lastResponse.headers.get('content-type') || '';

    const headers: Record<string, string> = {};
    lastResponse.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      success: true,
      url: inputUrl,
      finalUrl: currentUrl,
      status: lastResponse.status,
      headers,
      content,
      contentLength: totalBytes,
      contentType: finalContentType,
      redirectCount,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return fail('Request timed out', inputUrl, targetUrl, 0);
      }
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        return fail('Could not connect to the server', inputUrl, targetUrl, 0);
      }
      return fail('Request failed', inputUrl, targetUrl, 0);
    }
    return fail('Request failed', inputUrl, targetUrl, 0);
  } finally {
    clearTimeout(timeoutId);
  }
}

function fail(
  error: string,
  url: string,
  finalUrl: string,
  redirectCount: number,
  extra?: { status?: number; contentType?: string; contentLength?: number; partialContent?: string }
): FetchResult {
  return {
    success: false,
    url,
    finalUrl,
    status: extra?.status ?? 0,
    headers: {},
    content: extra?.partialContent || '',
    contentLength: extra?.contentLength ?? 0,
    contentType: extra?.contentType || '',
    redirectCount,
    error,
  };
}

export async function secureImageFetch(
  imageUrl: string,
  config: FetchConfig = {}
): Promise<FetchResult> {
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
