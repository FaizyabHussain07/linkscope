/**
 * Security utilities for LinkScope
 * SSRF protection, URL validation, and secure fetching
 */

export { secureFetch, secureImageFetch } from './fetch';
export type { FetchConfig, FetchResult } from './fetch';

export { validateFetchUrl, validateRedirectUrl, checkHostnameSafety, normalizeUrlForComparison } from './url-validator';
export type { UrlValidationResult } from './url-validator';

export { isIpBlocked, isValidIp, getIpVersion, BLOCKED_RANGES, DEFAULT_BLOCKED_IPS } from './ip-validator';

// Export security configuration types
export interface SecurityOptions {
  /** Whether to enforce strict IP blocking */
  enforceIpBlocking: boolean;
  /** Whether to allow HTTP (or HTTPS only) */
  allowHttp: boolean;
  /** Maximum redirects to follow */
  maxRedirects: number;
  /** Request timeout in milliseconds */
  timeoutMs: number;
  /** Maximum response size in bytes */
  maxSizeBytes: number;
  /** Custom blocked hosts in addition to defaults */
  blockedHosts: string[];
}
