/**
 * LinkScope Library
 * Core utilities for metadata inspection and analysis
 */

export { extractMetadata } from './extractors';
export type { ExtractedMetadata, MetadataWarning, RawMetaTag, RawLinkTag } from '@/types';

export { performAudit, calculateScore } from './analyzers';
export type { AuditResult, AuditFinding, AuditCheck, Recommendation, CategoryScore } from '@/types';

export { generateMetadataCode } from './generators';
export type { GeneratedMetadata } from '@/types';

export { resolveRelativeUrl } from './extractors/url-resolver';
