import { isIP } from 'node:net';

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
  // Carrier-grade NAT and protocol assignments
  { network: '100.64.0.0', bits: 10 },
  { network: '192.0.0.0', bits: 24 },
  // Benchmarking and reserved for future use
  { network: '198.18.0.0', bits: 15 },
  { network: '240.0.0.0', bits: 4 },
  // Multicast
  { network: '224.0.0.0', bits: 4 },
  // Documentation (RFC 5737)
  { network: '192.0.2.0', bits: 24 },
  { network: '198.51.100.0', bits: 24 },
  { network: '203.0.113.0', bits: 24 },
];

// Blocked IPv6 ranges
const BLOCKED_IPV6_RANGES: Array<{ network: string; bits: number }> = [
  // Unspecified and IPv4-mapped addresses (handled below for mapped IPv4)
  { network: '::', bits: 128 },
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
    if (!/^\d{1,3}$/.test(parts[i])) return null;
    const octet = Number(parts[i]);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
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
    if (parts.length !== 2) return null;

    const left = parts[0].split(':').filter(Boolean);
    const right = parts[1]?.split(':').filter(Boolean) || [];

    const rightSegmentCount = right.some((segment) => segment.includes(".")) ? right.length + 1 : right.length;
    const missing = 8 - left.length - rightSegmentCount;
    if (missing < 1) return null;
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
      if (!/^[\da-f]{1,4}$/i.test(segment)) return null;
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

    const mask = range.bits === 32
      ? 0xffffffff
      : ~(0xffffffff >>> (32 - range.bits)) >>> 0;
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

  // IPv4-mapped IPv6 addresses must inherit the IPv4 policy. Without this,
  // ::ffff:127.0.0.1 and mapped RFC1918 destinations bypass IPv4 checks.
  if (segments.slice(0, 5).every((segment) => segment === 0) && segments[5] === 0xffff) {
    const mappedIpv4 = `${segments[6] >>> 8}.${segments[6] & 0xff}.${segments[7] >>> 8}.${segments[7] & 0xff}`;
    return isIpv4Blocked(mappedIpv4);
  }

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
  return isIP(ip) !== 0;
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
