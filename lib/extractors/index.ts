import * as cheerio from 'cheerio';
import type { ExtractedMetadata, RawMetaTag, RawLinkTag } from '@/types';
import { resolveRelativeUrl } from './url-resolver';

export function extractMetadata(html: string, baseUrl: string): ExtractedMetadata {
  const $ = cheerio.load(html);
  const metadata: ExtractedMetadata = {
    duplicates: [],
    emptyTags: [],
    missingRequired: [],
    warnings: [],
    rawMetaTags: [],
    rawLinkTags: [],
  };

  const baseUrlObj = new URL(baseUrl);

  // Extract all meta tags first
  $('meta').each((_i, elem) => {
    const name = $(elem).attr('name');
    const property = $(elem).attr('property');
    const httpEquiv = $(elem).attr('http-equiv');
    const content = $(elem).attr('content');

    if (name || property || httpEquiv) {
      metadata.rawMetaTags.push({
        name: name || '',
        property: property || undefined,
        httpEquiv: httpEquiv || undefined,
        content: content || '',
        index: _i,
      });
    }
  });

  // Extract all link tags
  $('link').each((_i, elem) => {
    const rel = $(elem).attr('rel');
    const href = $(elem).attr('href');
    const type = $(elem).attr('type');
    const sizes = $(elem).attr('sizes');

    if (rel && href) {
      metadata.rawLinkTags.push({
        rel,
        href,
        type: type || undefined,
        sizes: sizes || undefined,
        index: _i,
      });
    }
  });

  // Extract title
  const title = $('title').first().text().trim();
  if (title) metadata.title = title;

  // Extract Open Graph tags
  metadata.ogTitle = getMetaContent($, 'property', 'og:title');
  metadata.ogDescription = getMetaContent($, 'property', 'og:description');
  metadata.ogImage = getMetaContent($, 'property', 'og:image');
  metadata.ogImageSecureUrl = getMetaContent($, 'property', 'og:image:secure_url');
  metadata.ogUrl = getMetaContent($, 'property', 'og:url');
  metadata.ogType = getMetaContent($, 'property', 'og:type');
  metadata.ogSiteName = getMetaContent($, 'property', 'og:site_name');
  metadata.ogLocale = getMetaContent($, 'property', 'og:locale');

  // Extract og:image dimensions
  const ogImageWidth = getMetaContent($, 'property', 'og:image:width');
  const ogImageHeight = getMetaContent($, 'property', 'og:image:height');
  if (ogImageWidth) metadata.ogImageWidth = parseInt(ogImageWidth, 10);
  if (ogImageHeight) metadata.ogImageHeight = parseInt(ogImageHeight, 10);

  // Extract og:image:alt
  metadata.ogImageAlt = getMetaContent($, 'property', 'og:image:alt');

  // Extract Twitter Card tags
  metadata.twitterCard = getMetaContent($, 'name', 'twitter:card');
  metadata.twitterTitle = getMetaContent($, 'name', 'twitter:title');
  metadata.twitterDescription = getMetaContent($, 'name', 'twitter:description');
  metadata.twitterImage = getMetaContent($, 'name', 'twitter:image');
  metadata.twitterImageAlt = getMetaContent($, 'name', 'twitter:image:alt');
  metadata.twitterSite = getMetaContent($, 'name', 'twitter:site');
  metadata.twitterCreator = getMetaContent($, 'name', 'twitter:creator');

  // Extract SEO tags
  metadata.description = getMetaContent($, 'name', 'description');
  metadata.canonical = resolveRelativeUrl(getLinkHref($, 'canonical'), baseUrl);
  metadata.language = $('html').attr('lang');
  metadata.charset = $('meta[charset]').attr('charset');
  metadata.viewport = getMetaContent($, 'name', 'viewport');
  metadata.robots = getMetaContent($, 'name', 'robots');
  metadata.generator = getMetaContent($, 'name', 'generator');
  metadata.themeColor = getMetaContent($, 'name', 'theme-color');

  // Extract favicon
  metadata.favicon = resolveRelativeUrl(
    getLinkHref($, 'icon') ||
    getLinkHref($, 'shortcut icon') ||
    getLinkHref($, 'apple-touch-icon') ||
    getLinkHref($, 'apple-touch-icon-precomposed') ||
    getLinkHref($, 'fluid-icon'),
    baseUrl
  );

  // Fallback favicon
  if (!metadata.favicon) {
    metadata.favicon = `${baseUrlObj.protocol}//${baseUrlObj.host}/favicon.ico`;
  }

  // Detect duplicates
  detectDuplicates(metadata);

  // Detect empty tags
  detectEmptyTags(metadata);

  // Detect missing required tags
  detectMissingRequired(metadata);

  // Detect warnings
  detectWarnings(metadata, baseUrl);

  // Resolve relative URLs
  resolveRelativeUrls(metadata, baseUrl);

  return metadata;
}

function getMetaContent($: cheerio.CheerioAPI, attrName: string, attrValue: string): string | undefined {
  const content = $(`meta[${attrName}="${attrValue}"]`).attr('content');
  return content?.trim();
}

function getLinkHref($: cheerio.CheerioAPI, rel: string): string | undefined {
  const href = $(`link[rel="${rel}"]`).attr('href');
  return href?.trim();
}

function detectDuplicates(metadata: ExtractedMetadata): void {
  const tagCounts = new Map<string, number>();

  // Count OG tags
  metadata.rawMetaTags.forEach(tag => {
    if (tag.property) {
      const key = `og:${tag.property}`;
      tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
    }
    if (tag.name) {
      const key = `twitter:${tag.name}`;
      tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
    }
  });

  // Count link tags
  metadata.rawLinkTags.forEach(tag => {
    const key = `link:${tag.rel}`;
    tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
  });

  // Find duplicates
  tagCounts.forEach((count, key) => {
    if (count > 1) {
      metadata.duplicates.push(key);
    }
  });
}

function detectEmptyTags(metadata: ExtractedMetadata): void {
  const emptyChecks: Array<{ key: keyof ExtractedMetadata; label: string }> = [
    { key: 'title', label: 'title' },
    { key: 'description', label: 'meta description' },
    { key: 'ogTitle', label: 'og:title' },
    { key: 'ogDescription', label: 'og:description' },
    { key: 'ogImage', label: 'og:image' },
    { key: 'ogUrl', label: 'og:url' },
    { key: 'ogType', label: 'og:type' },
    { key: 'ogSiteName', label: 'og:site_name' },
    { key: 'twitterCard', label: 'twitter:card' },
    { key: 'twitterTitle', label: 'twitter:title' },
    { key: 'twitterDescription', label: 'twitter:description' },
    { key: 'twitterImage', label: 'twitter:image' },
    { key: 'canonical', label: 'canonical URL' },
    { key: 'viewport', label: 'viewport' },
    { key: 'language', label: 'language' },
  ];

  emptyChecks.forEach(check => {
    const value = metadata[check.key];
    if (value === undefined || value === null || value === '') {
      metadata.emptyTags.push(check.label);
    }
  });
}

function detectMissingRequired(metadata: ExtractedMetadata): void {
  const required: Array<{ key: keyof ExtractedMetadata; label: string }> = [
    { key: 'title', label: 'title' },
    { key: 'description', label: 'meta description' },
  ];

  required.forEach(check => {
    const value = metadata[check.key];
    if (!value || value.trim() === '') {
      metadata.missingRequired.push(check.label);
    }
  });
}

function detectWarnings(metadata: ExtractedMetadata, baseUrl: string): void {
  // Check for suspicious title length
  if (metadata.title && metadata.title.length > 70) {
    metadata.warnings.push({
      tag: 'title',
      type: 'suspicious_length',
      message: 'HTML title is longer than 70 characters. Search engines may truncate it.',
      severity: 'warning',
      suggestion: 'Keep your title between 50-60 characters for optimal display.',
    });
  }

  // Check for suspicious description length
  if (metadata.description && metadata.description.length > 320) {
    metadata.warnings.push({
      tag: 'description',
      type: 'suspicious_length',
      message: 'Meta description is longer than 320 characters. Search engines may truncate it.',
      severity: 'warning',
      suggestion: 'Keep your description between 150-160 characters for optimal display.',
    });
  }

  // Check for OG title length
  if (metadata.ogTitle && metadata.ogTitle.length > 95) {
    metadata.warnings.push({
      tag: 'og:title',
      type: 'suspicious_length',
      message: 'Open Graph title is longer than 95 characters. Social platforms may truncate it.',
      severity: 'warning',
      suggestion: 'Keep OG title under 60 characters for best display across platforms.',
    });
  }

  // Check for OG description length
  if (metadata.ogDescription && metadata.ogDescription.length > 300) {
    metadata.warnings.push({
      tag: 'og:description',
      type: 'suspicious_length',
      message: 'Open Graph description is longer than 300 characters. Social platforms may truncate it.',
      severity: 'warning',
      suggestion: 'Keep OG description under 160 characters for best display.',
    });
  }

  // Check for conflicting titles
  if (metadata.title && metadata.ogTitle && metadata.title !== metadata.ogTitle) {
    metadata.warnings.push({
      tag: 'title/og:title',
      type: 'conflict',
      message: 'HTML title and Open Graph title are different.',
      severity: 'info',
      suggestion: 'Consider using the same title for consistency across platforms.',
    });
  }

  // Check for conflicting descriptions
  if (metadata.description && metadata.ogDescription && metadata.description !== metadata.ogDescription) {
    metadata.warnings.push({
      tag: 'description/og:description',
      type: 'conflict',
      message: 'Meta description and Open Graph description are different.',
      severity: 'info',
      suggestion: 'Consider using the same description for consistency across platforms.',
    });
  }

  // Check for missing Twitter Card
  if (!metadata.twitterCard && metadata.ogImage) {
    metadata.warnings.push({
      tag: 'twitter:card',
      type: 'missing',
      message: 'No Twitter Card type specified. X may not display your content optimally.',
      severity: 'info',
      suggestion: 'Add twitter:card with value "summary_large_image" for best display on X.',
    });
  }
}

function resolveRelativeUrls(metadata: ExtractedMetadata, baseUrl: string): void {
  const urlFields: Array<keyof ExtractedMetadata> = [
    'ogImage',
    'ogImageSecureUrl',
    'ogUrl',
    'canonical',
    'twitterImage',
  ];

  urlFields.forEach(field => {
    const value = metadata[field];
    if (value && typeof value === 'string') {
      metadata[field] = resolveRelativeUrl(value, baseUrl) || value;
    }
  });
}
