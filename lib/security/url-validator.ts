/**
 * URL validation utilities for SSRF protection
 * Validates URLs before they are fetched
 */

import { isIpBlocked } from './ip-validator';

// Allowed URL schemes
const ALLOWED_SCHEMES = ['http:', 'https:'];

// Maximum URL length
const MAX_URL_LENGTH = 2048;

// Blocked ports (privileged and commonly abused)
const BLOCKED_PORTS = new Set([
  // Privileged ports
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
  44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
  58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
  72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
  86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
  100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
  112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
  124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135,
  136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147,
  148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
  160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
  172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183,
  184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195,
  196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207,
  208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219,
  220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231,
  232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243,
  244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255,
  256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267,
  268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279,
  280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291,
  292, 293, 294, 295, 296, 297, 298, 299, 300,
  // Specific dangerous ports
  31337, // Back Orifice
  4444,  // Common backdoor/malware
  5555,  // Android ADB
  6666,  // IRC often used by malware
  6667,  // IRC
  8080,  // Common alternative HTTP (sometimes internal)
  8443,  // Alternative HTTPS
  8888,  // Common dev/alternative
  9999,  // Common backdoor
  1337,  // Leet/backdoor
  17179, // Azure Instance Metadata Service (alternate)
]);

// Hostnames that should be blocked regardless of IP
const BLOCKED_HOSTNAMES = [
  'localhost',
  'localhost.localdomain',
  'localtest.me', // Points to 127.0.0.1
  'test.tsua.pw', // DNS rebinding test domain
  'xip.io',
  'xip.name',
  'nip.io',
  'sslip.io',
  'readme.localtest.me',
];

/**
 * Validate a URL for safe fetching
 * Returns validation result with error message if invalid
 */
export interface UrlValidationResult {
  valid: boolean;
  error?: string;
  cleanedUrl?: string;
}

/**
 * Validate and normalize a URL for fetching
 */
export function validateFetchUrl(inputUrl: string): UrlValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  const trimmed = inputUrl.trim();
  if (!trimmed) {
    return { valid: false, error: 'URL cannot be empty' };
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    return { valid: false, error: 'URL is too long' };
  }

  // Add scheme if missing
  let urlToParse = trimmed;
  if (!trimmed.match(/^https?:\/\//i)) {
    urlToParse = `https://${trimmed}`;
  }

  // Parse URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlToParse);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Check scheme
  if (!ALLOWED_SCHEMES.includes(parsedUrl.protocol.toLowerCase())) {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  // Check for credentials in URL
  if (parsedUrl.username || parsedUrl.password) {
    return { valid: false, error: 'URLs with credentials are not allowed' };
  }

  // Check hostname
  const hostname = parsedUrl.hostname.toLowerCase();

  // Check for empty hostname
  if (!hostname || hostname === 'unknown') {
    return { valid: false, error: 'Invalid hostname' };
  }

  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return { valid: false, error: 'This hostname is not allowed' };
  }

  // Check for localhost variants
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return { valid: false, error: 'Localhost URLs are not allowed' };
  }

  // Check port
  const port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : (parsedUrl.protocol === 'https:' ? 443 : 80);
  if (BLOCKED_PORTS.has(port)) {
    return { valid: false, error: 'This port is not allowed' };
  }

  // Resolve hostname and check IP
  // Note: In a real implementation, you'd want to validate the resolved IP
  // For now, we'll do a basic check that can be enhanced

  return {
    valid: true,
    cleanedUrl: parsedUrl.toString(),
  };
}

/**
 * Validate that a redirect URL is safe to follow
 * Called for each redirect in the chain
 */
export function validateRedirectUrl(
  originalUrl: string,
  redirectUrl: string,
  baseUrl: string
): UrlValidationResult {
  const result = validateFetchUrl(redirectUrl);
  if (!result.valid) {
    return result;
  }

  const parsedRedirect = new URL(result.cleanedUrl!);

  // Ensure redirect stays on same scheme (no HTTPS -> HTTP downgrade)
  const parsedOriginal = new URL(originalUrl);
  if (parsedOriginal.protocol === 'https:' && parsedRedirect.protocol === 'http:') {
    return { valid: false, error: 'Cannot follow redirect to insecure URL' };
  }

  // Ensure redirect doesn't go to a different host without validation
  // (This is checked by the IP validator in the fetch function)

  return { valid: true, cleanedUrl: result.cleanedUrl };
}

/**
 * Check if a hostname might resolve to a dangerous IP
 * This is a preliminary check - actual IP validation happens during fetch
 */
export async function checkHostnameSafety(hostname: string): Promise<{ safe: boolean; error?: string }> {
  const lowerHostname = hostname.toLowerCase();

  // Check blocked hostnames
  if (BLOCKED_HOSTNAMES.includes(lowerHostname)) {
    return { safe: false, error: 'Hostname is blocked' };
  }

  // Check localhost variants
  if (lowerHostname === 'localhost' || lowerHostname.endsWith('.localhost')) {
    return { safe: false, error: 'Localhost is not allowed' };
  }

  // Check for internal domain patterns
  if (lowerHostname.endsWith('.internal') ||
      lowerHostname.endsWith('. intranet') ||
      lowerHostname === 'metadata' ||
      lowerHostname.includes('metadata')) {
    return { safe: false, error: 'Internal hostname detected' };
  }

  return { safe: true };
}

/**
 * Normalize URL for consistent comparison
 */
export function normalizeUrlForComparison(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove fragment, normalize hostname
    parsed.hash = '';
    parsed.hostname = parsed.hostname.toLowerCase();
    // Remove default ports
    if (parsed.port === '80' && parsed.protocol === 'http:') {
      parsed.port = '';
    }
    if (parsed.port === '443' && parsed.protocol === 'https:') {
      parsed.port = '';
    }
    return parsed.toString();
  } catch {
    return url.toLowerCase().trim();
  }
}
