/**
 * LinkScope Library
 * Core utilities for metadata inspection and analysis
 */

export { extractMetadata } from './extractors';
export type { ExtractedMetadata, MetadataWarning, RawMetaTag, RawLinkTag } from './extractors';

export { performAudit, calculateScore } from './analyzers';
export type { AuditResult, AuditFinding, AuditCheck, Recommendation, CategoryScore } from './analyzers';

export { generateMetadataCode } from './generators';
export type { GeneratedMetadata } from './generators';

export { resolveRelativeUrl } from './extractors/url-resolver';
