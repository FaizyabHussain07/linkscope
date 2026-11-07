// Metadata types for LinkScope

export interface ExtractedMetadata {
  // Basic
  title?: string;
  description?: string;

  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageSecureUrl?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  ogLocale?: string;

  // Twitter Card
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  twitterSite?: string;
  twitterCreator?: string;

  // HTML/SEO
  canonical?: string;
  favicon?: string;
  language?: string;
  charset?: string;
  viewport?: string;
  robots?: string;
  generator?: string;
  themeColor?: string;

  // Links
  alternate?: string;
  author?: string;
  prev?: string;
  next?: string;
  search?: string;
  icon?: string;

  // Files
  robotsFile?: string;
  sitemap?: string;

  // Analysis
  duplicates: string[];
  emptyTags: string[];
  missingRequired: string[];
  warnings: MetadataWarning[];

  // Raw data
  rawMetaTags: RawMetaTag[];
  rawLinkTags: RawLinkTag[];
}

export interface MetadataWarning {
  tag: string;
  type: 'missing' | 'empty' | 'duplicate' | 'invalid' | 'suspicious_length' | 'relative_url' | 'conflict';
  message: string;
  severity: 'critical' | 'warning' | 'info';
  suggestion?: string;
}

export interface RawMetaTag {
  name: string;
  property?: string;
  httpEquiv?: string;
  content: string;
  index: number;
}

export interface RawLinkTag {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  index: number;
}

export interface AuditResult {
  score: number;
  maxScore: number;
  categoryScores: CategoryScore[];
  findings: AuditFinding[];
  passed: AuditCheck[];
  failed: AuditCheck[];
  recommendations: Recommendation[];
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
}

export interface AuditFinding {
  id: string;
  category: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affectedTags: string[];
  suggestion?: string;
}

export interface AuditCheck {
  id: string;
  name: string;
  passed: boolean;
  weight: number;
  category: string;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  implementation?: string;
  codeExample?: string;
}

// Image inspection types
export interface ImageInspectResult {
  url: string;
  accessible: boolean;
  status?: number;
  mimeType?: string;
  format?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  fileSize?: number;
  fileSizeHuman?: string;
  recommendations: ImageRecommendation[];
  error?: string;
}

export interface ImageRecommendation {
  type: 'warning' | 'error' | 'info';
  message: string;
  suggestion?: string;
}

// Comparison types
export interface ComparisonResult {
  urls: string[];
  comparison: FieldComparison[];
  summary: ComparisonSummary;
}

export interface FieldComparison {
  field: string;
  label: string;
  values: { url: string; value: string | undefined }[];
  hasDifferences: boolean;
  status: 'identical' | 'different' | 'missing' | 'partial';
}

export interface ComparisonSummary {
  totalFields: number;
  identicalFields: number;
  differentFields: number;
  missingFields: number;
  overallSimilarity: number;
}

// Generation types
export interface MetadataGeneratorInput {
  title: string;
  description: string;
  canonicalUrl?: string;
  imageUrl?: string;
  siteName?: string;
  twitterCardType?: string;
  locale?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

export interface GeneratedMetadata {
  html: string;
  nextjsDynamic: string;
  nextjsStatic: string;
  react: string;
  openGraph: string[];
  twitterCards: string[];
}

// Bulk inspection types
export interface BulkInspectRequest {
  urls: string[];
  concurrency?: number;
}

export interface BulkInspectResult {
  timestamp: string;
  summary: BulkSummary;
  results: BulkResult[];
}

export interface BulkSummary {
  total: number;
  successful: number;
  failed: number;
  withMetadata: number;
  withoutMetadata: number;
}

export interface BulkResult {
  url: string;
  success: boolean;
  error?: string;
  metadata?: ExtractedMetadata;
  audit?: AuditResult;
}

// API request/response types
export interface InspectRequest {
  url: string;
}

export interface InspectResponse {
  success: boolean;
  url: string;
  fetchedAt: string;
  metadata?: ExtractedMetadata;
  audit?: AuditResult;
  error?: string;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  version: string;
  timestamp: string;
}

// Security types
export interface SecurityConfig {
  allowedSchemes: string[];
  blockedIPs: string[];
  blockedRanges: string[];
  maxRedirects: number;
  timeoutMs: number;
  maxSizeBytes: number;
  allowedContentTypes: string[];
}

export interface SecurityValidationResult {
  valid: boolean;
  error?: string;
  blockedReason?: string;
}
