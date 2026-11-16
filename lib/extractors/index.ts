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
  metadata.ogImage = resolveMetadataUrl(getMetaContent($, 'property', 'og:image'), baseUrl);
  metadata.ogImageSecureUrl = resolveMetadataUrl(getMetaContent($, 'property', 'og:image:secure_url'), baseUrl);
  metadata.ogUrl = resolveMetadataUrl(getMetaContent($, 'property', 'og:url'), baseUrl);
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
  metadata.twitterImage = resolveMetadataUrl(getMetaContent($, 'name', 'twitter:image'), baseUrl);
  metadata.twitterImageAlt = getMetaContent($, 'name', 'twitter:image:alt');
  metadata.twitterSite = getMetaContent($, 'name', 'twitter:site');
  metadata.twitterCreator = getMetaContent($, 'name', 'twitter:creator');

  // Extract SEO tags
  metadata.description = getMetaContent($, 'name', 'description');
  metadata.canonical = resolveMetadataUrl(getLinkHref($, 'rel', 'canonical'), baseUrl);
  metadata.language = $('html').attr('lang') || $('html').attr('xml:lang');
  metadata.charset = $('meta[http-equiv="Content-Type"]').attr('content')?.match(/charset=([^;]+)/)?.[1];
  metadata.viewport = getMetaContent($, 'name', 'viewport');
  metadata.robots = getMetaContent($, 'name', 'robots');
  metadata.generator = getMetaContent($, 'name', 'generator');
  metadata.themeColor = getMetaContent($, 'name', 'theme-color');

  // Extract favicon
  const favicon = getLinkHref($, 'rel', /^(icon|shortcut icon|x-icon)$/i);
  if (favicon) metadata.favicon = resolveMetadataUrl(favicon, baseUrl);

  // Extract alternate links
  metadata.alternate = resolveMetadataUrl(getLinkHref($, 'rel', 'alternate'), baseUrl);
  metadata.author = getMetaContent($, 'name', 'author');
  metadata.prev = resolveMetadataUrl(getLinkHref($, 'rel', 'prev'), baseUrl);
  metadata.next = resolveMetadataUrl(getLinkHref($, 'rel', 'next'), baseUrl);
  metadata.search = resolveMetadataUrl(getLinkHref($, 'rel', 'search'), baseUrl);
  metadata.icon = resolveMetadataUrl(getLinkHref($, 'rel', 'icon'), baseUrl);

  // Extract robots.txt and sitemap
  try {
    metadata.robotsFile = new URL('/robots.txt', baseUrlObj).href;
    metadata.sitemap = new URL('/sitemap.xml', baseUrlObj).href;
  } catch {
    // Invalid base URL
  }

  // Detect duplicates and issues
  detectDuplicates(metadata);
  detectMissingRequired(metadata);
  detectWarnings(metadata);

  return metadata;
}

function getMetaContent($: cheerio.CheerioAPI, attrName: string, attrValue: string): string | undefined {
  const elem = $(`meta[${attrName}="${attrValue}"]`).first();
  return elem.attr('content') || undefined;
}

function resolveMetadataUrl(value: string | undefined, baseUrl: string): string | undefined {
  if (!value) return undefined;
  return resolveRelativeUrl(value.trim(), baseUrl);
}

function getLinkHref($: cheerio.CheerioAPI, attrName: string, attrValue: string | RegExp): string | undefined {
  let elem;
  if (attrValue instanceof RegExp) {
    elem = $(`link[rel]`).filter((_, el) => {
      const rel = $(el).attr('rel') || '';
      return attrValue.test(rel);
    }).first();
  } else {
    elem = $(`link[rel="${attrValue}"]`).first();
  }
  return elem.attr('href') || undefined;
}

function detectDuplicates(metadata: ExtractedMetadata): void {
  const tagMap = new Map<string, RawMetaTag[]>();
  
  for (const tag of metadata.rawMetaTags) {
    const key = `${tag.name || tag.property || tag.httpEquiv}`;
    if (!tagMap.has(key)) {
      tagMap.set(key, []);
    }
    tagMap.get(key)!.push(tag);
  }

  for (const [key, tags] of tagMap) {
    if (tags.length > 1) {
      metadata.duplicates.push(key);
    }
  }
}

function detectMissingRequired(metadata: ExtractedMetadata): void {
  if (!metadata.title) metadata.missingRequired.push('title');
  if (!metadata.description) metadata.missingRequired.push('description');
  if (!metadata.ogTitle) metadata.missingRequired.push('og:title');
  if (!metadata.ogDescription) metadata.missingRequired.push('og:description');
  if (!metadata.ogImage) metadata.missingRequired.push('og:image');
}

function detectWarnings(metadata: ExtractedMetadata): void {
  // Check for empty tags
  for (const tag of metadata.rawMetaTags) {
    if (!tag.content || tag.content.trim() === '') {
      metadata.emptyTags.push(`${tag.name || tag.property || tag.httpEquiv}`);
    }
  }

  // Check OG image
  if (metadata.ogImage) {
    try {
      const imgUrl = new URL(metadata.ogImage, metadata.ogUrl || '');
      if (!imgUrl.hostname.includes('.')) {
        metadata.warnings.push({
          tag: 'og:image',
          type: 'suspicious_length',
          message: 'OG image URL appears to be relative or invalid',
          severity: 'warning',
          suggestion: 'Use an absolute URL for og:image',
        });
      }
    } catch {
      metadata.warnings.push({
        tag: 'og:image',
        type: 'invalid',
        message: 'OG image URL is malformed',
        severity: 'critical',
        suggestion: 'Fix the og:image URL format',
      });
    }
  }

  // Check description length
  if (metadata.description && metadata.description.length < 50) {
    metadata.warnings.push({
      tag: 'description',
      type: 'suspicious_length',
      message: 'Meta description is shorter than 50 characters',
      severity: 'warning',
      suggestion: 'Aim for 150-160 characters for optimal SEO',
    });
  }

  if (metadata.description && metadata.description.length > 160) {
    metadata.warnings.push({
      tag: 'description',
      type: 'suspicious_length',
      message: 'Meta description is longer than 160 characters',
      severity: 'warning',
      suggestion: 'Consider shortening to 150-160 characters',
    });
  }

  // Check title length
  if (metadata.title && metadata.title.length < 30) {
    metadata.warnings.push({
      tag: 'title',
      type: 'suspicious_length',
      message: 'Page title is shorter than 30 characters',
      severity: 'warning',
      suggestion: 'Aim for 50-60 characters for optimal SEO',
    });
  }

  if (metadata.title && metadata.title.length > 70) {
    metadata.warnings.push({
      tag: 'title',
      type: 'suspicious_length',
      message: 'Page title is longer than 70 characters',
      severity: 'warning',
      suggestion: 'Consider shortening to 50-60 characters',
    });
  }
}

export { detectDuplicates, detectMissingRequired, detectWarnings };
