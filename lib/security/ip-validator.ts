/**
 * IP address validation utilities for SSRF protection
 * Validates that resolved IPs are not in blocked ranges
 */

// Blocked IPv4 ranges (CIDR notation)
const BLOCKED_IPV4_RANGES: Array<{ network: string; bits: number }> = [
  // Loopback
  { network: '127.0.0.0', bits: 8 },
  // Link-local
  { network: '169.254.0.0', bits: 16 },
  // Private networks (RFC 1918)
  { network: '10.0.0.0', bits: 8 },
  { network: '172.16.0.0', bits: 12 },
  { network: '192.168.0.0', bits: 16 },
  // Cloud metadata
  { network: '169.254.169.254', bits: 32 },
  // Reserved
  { network: '0.0.0.0', bits: 8 },
  // Multicast
  { network: '224.0.0.0', bits: 4 },
  // Documentation (RFC 5737)
  { network: '192.0.2.0', bits: 24 },
  { network: '198.51.100.0', bits: 24 },
  { network: '203.0.113.0', bits: 24 },
];

// Blocked IPv6 ranges
const BLOCKED_IPV6_RANGES: Array<{ network: string; bits: number }> = [
  // Loopback
  { network: '::1', bits: 128 },
  // Link-local
  { network: 'fe80::', bits: 10 },
  // Unique local (RFC 4193)
  { network: 'fc00::', bits: 7 },
  { network: 'fd00::', bits: 8 },
  // Multicast
  { network: 'ff00::', bits: 8 },
  // Documentation (RFC 3849, RFC 6724)
  { network: '2001:db8::', bits: 32 },
];

/**
 * Convert IPv4 address to 32-bit integer
 */
function ipv4ToInteger(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;

  let result = 0;
  for (let i = 0; i < 4; i++) {
    const octet = parseInt(parts[i], 10);
    if (isNaN(octet) || octet < 0 || octet > 255) return null;
    result = (result << 8) | octet;
  }
  return result >>> 0;
}

/**
 * Convert IPv6 address to array of 32-bit integers (for comparison)
 * Simplified - handles most common formats
 */
function ipv6ToSegments(ip: string): Array<number> | null {
  // Handle compressed format :: 
  let expanded = ip;

  if (expanded.includes('::')) {
    const parts = expanded.split('::');
    if (parts.length > 2) return null;

    const left = parts[0].split(':').filter(Boolean);
    const right = parts[1]?.split(':').filter(Boolean) || [];

    const missing = 8 - left.length - right.length;
    const middle = Array(missing).fill('0');

    expanded = [...left, ...middle, ...right].join(':');
  }

  const segments = expanded.split(':');
  if (segments.length !== 8) return null;

  const result: Array<number> = [];
  for (const segment of segments) {
    // Handle IPv4-mapped IPv6 addresses
    if (segment.includes('.')) {
      const ipv4 = ipv4ToInteger(segment);
      if (ipv4 === null) return null;
      result.push((ipv4 >>> 16) & 0xffff);
      result.push(ipv4 & 0xffff);
    } else {
      const val = parseInt(segment || '0', 16);
      if (isNaN(val) || val < 0 || val > 0xffff) return null;
      result.push(val);
    }
  }

  return result;
}

/**
 * Check if an IPv4 address is in a blocked range
 */
function isIpv4Blocked(ip: string): boolean {
  const ipInt = ipv4ToInteger(ip);
  if (ipInt === null) return false;

  for (const range of BLOCKED_IPV4_RANGES) {
    const networkInt = ipv4ToInteger(range.network);
    if (networkInt === null) continue;

    const mask = ~(0xffffffff >>> (32 - range.bits)) >>> 0;
    if ((ipInt & mask) === (networkInt & mask)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if an IPv6 address is in a blocked range
 */
function isIpv6Blocked(ip: string): boolean {
  const segments = ipv6ToSegments(ip);
  if (!segments) return false;

  for (const range of BLOCKED_IPV6_RANGES) {
    const rangeSegments = ipv6ToSegments(range.network);
    if (!rangeSegments) continue;

    let match = true;
    for (let i = 0; i < range.bits; i += 16) {
      const segIndex = i / 16;
      if (segIndex >= 8) break;

      const maskBits = Math.min(16, range.bits - i);
      const mask = ~(0xffff >>> maskBits) >>> 0;

      if ((segments[segIndex] & mask) !== (rangeSegments[segIndex] & mask)) {
        match = false;
        break;
      }
    }

    if (match) return true;
  }

  return false;
}

/**
 * Check if an IP address is blocked (private, loopback, etc.)
 */
export function isIpBlocked(ip: string): boolean {
  if (ip.includes(':')) {
    return isIpv6Blocked(ip);
  }
  return isIpv4Blocked(ip);
}

/**
 * Parse and validate an IP address string
 */
export function isValidIp(ip: string): ip is string {
  if (ip.includes(':')) {
    return ipv6ToSegments(ip) !== null;
  }
  return ipv4ToInteger(ip) !== null;
}

/**
 * Get the IP version of an address
 */
export function getIpVersion(ip: string): 4 | 6 | null {
  if (ip.includes(':')) {
    return ipv6ToSegments(ip) !== null ? 6 : null;
  }
  return ipv4ToInteger(ip) !== null ? 4 : null;
}

/**
 * Blocked IP ranges for reference/documentation
 */
export const BLOCKED_RANGES = {
  ipv4: BLOCKED_IPV4_RANGES.map(r => `${r.network}/${r.bits}`),
  ipv6: BLOCKED_IPV6_RANGES.map(r => `${r.network}/${r.bits}`),
};

/**
 * Default blocked IPs that should always be blocked
 */
export const DEFAULT_BLOCKED_IPS = [
  // Cloud metadata endpoints
  '169.254.169.254',
  // Additional commonly targeted metadata endpoints
  '100.100.100.200', // Alibaba Cloud metadata
  'metadata.google.internal', // GCP (hostname, but DNS could resolve)
];
