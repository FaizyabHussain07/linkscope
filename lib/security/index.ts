/**
 * Security utilities for LinkScope
 * SSRF protection, URL validation, and secure fetching
 */

export { secureFetch, secureImageFetch } from './fetch';
export type { FetchConfig, FetchResult } from './fetch';

export { validateFetchUrl, validateRedirectUrl, checkHostnameSafety, normalizeUrlForComparison } from './url-validator';
export type { UrlValidationResult } from './url-validator';

export { isIpBlocked, isValidIp, getIpVersion, BLOCKED_RANGES, DEFAULT_BLOCKED_IPS } from './ip-validator';

export interface SecurityOptions {
  enforceIpBlocking: boolean;
  allowHttp: boolean;
  maxRedirects: number;
  timeoutMs: number;
  maxSizeBytes: number;
  blockedHosts: string[];
}
