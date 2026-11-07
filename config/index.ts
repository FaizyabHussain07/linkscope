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
  /** Enable exports */
  exports: process.env.FEATURE_EXPORTS !== 'false',
  /** Enable API endpoints */
  api: process.env.FEATURE_API !== 'false',
};

// Premium/hosted features configuration
export const PREMIUM_CONFIG = {
  /** Whether premium features are enabled (hosted only) */
  enabled: process.env.PREMIUM_ENABLED === 'true',
  /** Maximum inspections per day for free tier */
  freeTierDailyLimit: parseInt(process.env.PREMIUM_FREE_DAILY_LIMIT || '50', 10),
  /** Whether to require license verification */
  requireLicense: process.env.PREMIUM_REQUIRE_LICENSE === 'true',
};

// Crawler identity
export const CRAWLER = {
  userAgent: process.env.CRAWLER_USER_AGENT || `LinkScope/1.0 (+${APP_URL})`,
  acceptLanguage: 'en-US,en;q=0.5',
};

// Validation messages
export const VALIDATION_MESSAGES = {
  urlRequired: 'URL is required',
  urlInvalid: 'Please enter a valid URL',
  urlTooLong: 'URL is too long',
  schemeNotAllowed: 'Only HTTP and HTTPS URLs are allowed',
  credentialsNotAllowed: 'URLs with credentials are not allowed',
  localhostNotAllowed: 'Localhost URLs are not allowed',
  timeout: 'The request timed out',
  tooLarge: 'The response was too large',
  tooManyRedirects: 'Too many redirects',
  notFound: 'The page could not be found',
  error: 'An error occurred while fetching the URL',
};

// Default recommendations
export const DEFAULT_RECOMMENDATIONS = {
  ogTitle: {
    title: 'Add an Open Graph title',
    description: 'Open Graph titles are used by social platforms to display your page title. Without it, platforms may use your HTML title or truncate the URL.',
    priority: 'high' as const,
  },
  ogDescription: {
    title: 'Add an Open Graph description',
    description: 'Open Graph descriptions provide a summary of your page content for social sharing.',
    priority: 'high' as const,
  },
  ogImage: {
    title: 'Add an Open Graph image',
    description: 'Open Graph images make your links visually appealing when shared. Recommended size: 1200x630 pixels.',
    priority: 'high' as const,
  },
  twitterCard: {
    title: 'Add a Twitter Card type',
    description: 'Twitter Card types define how your content appears on X (Twitter).',
    priority: 'medium' as const,
  },
  canonical: {
    title: 'Add a canonical URL',
    description: 'Canonical URLs help search engines understand which version of a page to index.',
    priority: 'medium' as const,
  },
  favicon: {
    title: 'Add a favicon',
    description: 'Favicons appear in browser tabs and bookmarks, improving brand recognition.',
    priority: 'low' as const,
  },
};
