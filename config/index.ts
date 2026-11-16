/**
 * Application configuration
 * All configurable values with defaults and environment variable mapping
 */

// Application identity
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'LinkScope';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Whether this is a self-hosted or official hosted instance
export const IS_HOSTED = process.env.NEXT_PUBLIC_IS_HOSTED === 'true';

// Security configuration
export const SECURITY_CONFIG = {
  /** Maximum time to wait for a response */
  timeoutMs: parseInt(process.env.INSPECTION_TIMEOUT_MS || '30000', 10),
  /** Maximum response size in bytes */
  maxSizeBytes: parseInt(process.env.INSPECTION_MAX_SIZE_BYTES || '10485760', 10), // 10MB default
  /** Maximum number of redirects to follow */
  maxRedirects: parseInt(process.env.INSPECTION_MAX_REDIRECTS || '5', 10),
  /** Connect timeout */
  connectTimeoutMs: parseInt(process.env.INSPECTION_CONNECT_TIMEOUT_MS || '10000', 10),
  /** Additional blocked hosts */
  blockedHosts: (process.env.BLOCKED_HOSTS || '').split(',').filter(Boolean),
};

// Inspection limits
export const INSPECTION_LIMITS = {
  /** Maximum URLs per bulk inspection */
  maxBulkUrls: parseInt(process.env.INSPECTION_MAX_BULK_URLS || '10', 10),
  /** Maximum concurrent requests in bulk mode */
  maxConcurrency: parseInt(process.env.INSPECTION_MAX_CONCURRENCY || '3', 10),
  /** Maximum comparison URLs */
  maxCompareUrls: parseInt(process.env.INSPECTION_MAX_COMPARE_URLS || '5', 10),
};

// Feature flags
export const FEATURES = {
  /** Enable bulk inspection */
  bulkInspection: process.env.FEATURE_BULK_INSPECTION !== 'false',
  /** Enable comparison feature */
  comparison: process.env.FEATURE_COMPARISON !== 'false',
  /** Enable image inspection */
  imageInspection: process.env.FEATURE_IMAGE_INSPECTION !== 'false',
  /** Enable metadata generation */
  metadataGeneration: process.env.FEATURE_METADATA_GENERATION !== 'false',
};

export default {
  APP_NAME,
  APP_VERSION,
  APP_URL,
  IS_HOSTED,
  SECURITY_CONFIG,
  INSPECTION_LIMITS,
  FEATURES,
};
