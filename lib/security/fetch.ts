/**
 * Secure fetch implementation with SSRF protection
 * Validates destination IP and enforces limits
 */

import { validateFetchUrl, validateRedirectUrl } from './url-validator';
import { lookup } from 'node:dns/promises';
import { DEFAULT_BLOCKED_IPS, isIpBlocked, isValidIp } from './ip-validator';

export interface FetchConfig {
  timeoutMs?: number;
  maxRedirects?: number;
  maxSizeBytes?: number;
  connectTimeoutMs?: number;
  allowedContentTypes?: string[];
  userAgent?: string;
  blockedHosts?: string[];
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

// Default configuration - using const assertions for type safety
const DEFAULT_TIMEOUT_MS: number = 30000;
const DEFAULT_MAX_REDIRECTS: number = 5;
const DEFAULT_MAX_SIZE_BYTES: number = 10 * 1024 * 1024;
const DEFAULT_CONNECT_TIMEOUT_MS: number = 10000;
const DEFAULT_ALLOWED_CONTENT_TYPES: string[] = [
  'text/html',
  'text/plain',
  'application/xhtml+xml',
  'application/xml',
];
const DEFAULT_USER_AGENT: string = 'LinkScope/1.0 (+https://linkscope.faizyab.me)';

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
<<<<<<< HEAD
  const timeoutMs: number = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRedirects: number = config.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const maxSizeBytes: number = config.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;
  const allowedContentTypes: string[] = config.allowedContentTypes ?? DEFAULT_ALLOWED_CONTENT_TYPES;
  const userAgent: string = config.userAgent ?? DEFAULT_USER_AGENT;
=======
  const timeoutMs = config.timeoutMs ?? 30000;
  const maxRedirects = config.maxRedirects ?? 5;
  const maxSizeBytes = config.maxSizeBytes ?? 10 * 1024 * 1024;
  const allowedContentTypes = config.allowedContentTypes ?? DEFAULT_CONFIG.allowedContentTypes!;
  const userAgent = config.userAgent ?? DEFAULT_CONFIG.userAgent!;
  const blockedHosts = config.blockedHosts ?? [];
>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1

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

      const destinationCheck = await validateResolvedDestination(currentUrl, blockedHosts);
      if (!destinationCheck.valid) {
        return fail(destinationCheck.error || 'This host is not allowed', inputUrl, currentUrl, redirectCount);
      }

      const response = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
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
<<<<<<< HEAD
      ...(config.allowedContentTypes || DEFAULT_ALLOWED_CONTENT_TYPES),
=======
      ...(config.allowedContentTypes ?? DEFAULT_CONFIG.allowedContentTypes ?? []),
>>>>>>> f060bcbb38b2c3f280eec5711da383a7773f5bf1
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

async function validateResolvedDestination(url: string, blockedHosts: string[]): Promise<{ valid: boolean; error?: string }> {
  const hostname = new URL(url).hostname;
  const normalizedHostname = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (DEFAULT_BLOCKED_IPS.includes(normalizedHostname) || blockedHosts.some((host) => host.trim().toLowerCase() === normalizedHostname)) {
    return { valid: false, error: 'This host is not allowed' };
  }

  if (isValidIp(normalizedHostname)) {
    return isIpBlocked(normalizedHostname)
      ? { valid: false, error: 'This host is not allowed' }
      : { valid: true };
  }

  let addresses: Array<{ address: string; family: number }>;
  try {
    addresses = await lookup(normalizedHostname, { all: true, verbatim: true });
  } catch {
    return { valid: false, error: 'Could not resolve the destination host' };
  }

  if (addresses.length === 0 || addresses.some(({ address }) => isIpBlocked(address))) {
    return { valid: false, error: 'This host resolves to a private or restricted network' };
  }

  return { valid: true };
}
