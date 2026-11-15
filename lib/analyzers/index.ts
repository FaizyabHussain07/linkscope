import type { ExtractedMetadata, AuditResult, AuditFinding, AuditCheck, Recommendation, CategoryScore } from '@/types';

// Scoring weights by category
const CATEGORY_WEIGHTS: Record<string, { total: number; checks: Array<{ id: string; name: string; weight: number; check: (m: ExtractedMetadata) => boolean }> }> = {
  seo: {
    total: 25,
    checks: [
      { id: 'has-title', name: 'Has HTML Title', weight: 5, check: (m) => !!m.title },
      { id: 'title-length', name: 'Title Length (50-60 chars)', weight: 5, check: (m) => typeof m.title === 'string' && m.title.length >= 40 && m.title.length <= 70 },
      { id: 'has-description', name: 'Has Meta Description', weight: 5, check: (m) => !!m.description },
      { id: 'description-length', name: 'Description Length (150-160 chars)', weight: 5, check: (m) => typeof m.description === 'string' && m.description.length >= 120 && m.description.length <= 160 },
      { id: 'has-canonical', name: 'Has Canonical URL', weight: 5, check: (m) => !!m.canonical },
    ],
  },
  openGraph: {
    total: 35,
    checks: [
      { id: 'og-title', name: 'Has OG Title', weight: 5, check: (m) => !!m.ogTitle },
      { id: 'og-description', name: 'Has OG Description', weight: 5, check: (m) => !!m.ogDescription },
      { id: 'og-image', name: 'Has OG Image', weight: 8, check: (m) => !!m.ogImage },
      { id: 'og-url', name: 'Has OG URL', weight: 3, check: (m) => !!m.ogUrl },
      { id: 'og-type', name: 'Has OG Type', weight: 3, check: (m) => !!m.ogType },
      { id: 'og-site-name', name: 'Has OG Site Name', weight: 3, check: (m) => !!m.ogSiteName },
      { id: 'og-locale', name: 'Has OG Locale', weight: 2, check: (m) => !!m.ogLocale },
      { id: 'og-image-dims', name: 'OG Image Dimensions', weight: 6, check: (m) => typeof m.ogImageWidth === 'number' && typeof m.ogImageHeight === 'number' && m.ogImageWidth >= 1200 && m.ogImageWidth <= 5000 && m.ogImageHeight >= 630 && m.ogImageHeight <= 2500 },
    ],
  },
  twitter: {
    total: 20,
    checks: [
      { id: 'twitter-card', name: 'Has Twitter Card Type', weight: 4, check: (m) => !!m.twitterCard },
      { id: 'twitter-title', name: 'Has Twitter Title', weight: 4, check: (m) => !!m.twitterTitle },
      { id: 'twitter-description', name: 'Has Twitter Description', weight: 4, check: (m) => !!m.twitterDescription },
      { id: 'twitter-image', name: 'Has Twitter Image', weight: 8, check: (m) => !!m.twitterImage },
    ],
  },
  technical: {
    total: 20,
    checks: [
      { id: 'language', name: 'Has Language Attribute', weight: 4, check: (m) => !!m.language },
      { id: 'viewport', name: 'Has Viewport Meta', weight: 4, check: (m) => !!m.viewport },
      { id: 'charset', name: 'Has Charset', weight: 3, check: (m) => !!m.charset },
      { id: 'robots', name: 'Has Robots Directive', weight: 3, check: (m) => !!m.robots || m.robots === '' },
      { id: 'favicon', name: 'Has Favicon', weight: 3, check: (m) => !!m.favicon },
      { id: 'no-duplicates', name: 'No Duplicate Tags', weight: 3, check: (m) => m.duplicates.length === 0 },
    ],
  },
};

export function performAudit(metadata: ExtractedMetadata): Omit<AuditResult, 'score'> {
  const findings: AuditFinding[] = [];
  const passed: AuditCheck[] = [];
  const failed: AuditCheck[] = [];
  const recommendations: Recommendation[] = [];
  const categoryScores: CategoryScore[] = [];

  for (const [categoryName, category] of Object.entries(CATEGORY_WEIGHTS)) {
    let categoryScore = 0;
    const categoryPassed: AuditCheck[] = [];
    const categoryFailed: AuditCheck[] = [];

    for (const check of category.checks) {
      const checkPassed = check.check(metadata);
      
      if (checkPassed) {
        categoryScore += check.weight;
        passed.push({
          id: check.id,
          name: check.name,
          passed: true,
          weight: check.weight,
          category: categoryName,
        });
        categoryPassed.push({
          id: check.id,
          name: check.name,
          passed: true,
          weight: check.weight,
          category: categoryName,
        });
      } else {
        failed.push({
          id: check.id,
          name: check.name,
          passed: false,
          weight: check.weight,
          category: categoryName,
        });
        categoryFailed.push({
          id: check.id,
          name: check.name,
          passed: false,
          weight: check.weight,
          category: categoryName,
        });
      }
    }

    categoryScores.push({
      name: categoryName,
      score: categoryScore,
      maxScore: category.total,
      weight: category.total,
    });

    // Generate findings and recommendations for failed checks
    for (const check of categoryFailed) {
      findings.push({
        id: check.id,
        category: categoryName,
        type: check.weight >= 5 ? 'critical' : 'warning',
        title: check.name,
        description: `This check failed with a weight of ${check.weight} points.`,
        affectedTags: getAffectedTags(categoryName, check.id),
        suggestion: getSuggestion(categoryName, check.id),
      });

      recommendations.push({
        priority: check.weight >= 5 ? 'high' : 'medium',
        category: categoryName,
        title: `Fix: ${check.name}`,
        description: getRecommendationDescription(categoryName, check.id),
        implementation: getImplementation(categoryName, check.id),
      });
    }
  }

  return {
    score: 0, // Will be calculated by calculateScore
    maxScore: 100,
    categoryScores,
    findings,
    passed,
    failed,
    recommendations,
  };
}

export function calculateScore(audit: Omit<AuditResult, 'score'>): number {
  let totalScore = 0;
  let totalMax = 0;

  for (const category of audit.categoryScores) {
    totalScore += category.score;
    totalMax += category.maxScore;
  }

  return totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
}

function getAffectedTags(category: string, checkId: string): string[] {
  const tags: Record<string, Record<string, string[]>> = {
    seo: {
      'has-title': ['title'],
      'title-length': ['title'],
      'has-description': ['description'],
      'description-length': ['description'],
      'has-canonical': ['canonical'],
    },
    openGraph: {
      'og-title': ['og:title'],
      'og-description': ['og:description'],
      'og-image': ['og:image'],
      'og-url': ['og:url'],
      'og-type': ['og:type'],
      'og-site-name': ['og:site_name'],
      'og-locale': ['og:locale'],
      'og-image-dims': ['og:image:width', 'og:image:height'],
    },
    twitter: {
      'twitter-card': ['twitter:card'],
      'twitter-title': ['twitter:title'],
      'twitter-description': ['twitter:description'],
      'twitter-image': ['twitter:image'],
    },
    technical: {
      'language': ['html lang'],
      'viewport': ['viewport'],
      'charset': ['charset'],
      'robots': ['robots'],
      'favicon': ['favicon'],
      'no-duplicates': ['duplicates'],
    },
  };

  return tags[category]?.[checkId] || [];
}

function getSuggestion(category: string, checkId: string): string | undefined {
  const suggestions: Record<string, Record<string, string>> = {
    seo: {
      'has-title': 'Add a <title> tag to your HTML.',
      'title-length': 'Optimize your title to be 50-60 characters long.',
      'has-description': 'Add a <meta name="description"> tag.',
      'description-length': 'Optimize your description to be 150-160 characters long.',
      'has-canonical': 'Add a <link rel="canonical"> tag to prevent duplicate content issues.',
    },
    openGraph: {
      'og-title': 'Add an og:title meta tag for better social sharing.',
      'og-description': 'Add an og:description meta tag for better social sharing.',
      'og-image': 'Add an og:image meta tag with a properly sized image (1200x630 recommended).',
      'og-url': 'Add an og:url meta tag to specify the canonical URL for social sharing.',
      'og-type': 'Add an og:type meta tag to specify the content type (e.g., website, article).',
      'og-site-name': 'Add an og:site_name meta tag to identify your website.',
      'og-locale': 'Add an og:locale meta tag to specify the content language.',
      'og-image-dims': 'Ensure your OG image is at least 1200x630 pixels for optimal display.',
    },
    twitter: {
      'twitter-card': 'Add a twitter:card meta tag to enable Twitter Card previews.',
      'twitter-title': 'Add a twitter:title meta tag for Twitter Card previews.',
      'twitter-description': 'Add a twitter:description meta tag for Twitter Card previews.',
      'twitter-image': 'Add a twitter:image meta tag for Twitter Card previews.',
    },
    technical: {
      'language': 'Add a lang attribute to your <html> tag (e.g., <html lang="en">).',
      'viewport': 'Add a viewport meta tag for mobile responsiveness.',
      'charset': 'Specify the character encoding with a charset meta tag.',
      'robots': 'Add a robots meta tag to control search engine crawling.',
      'favicon': 'Add a favicon to improve brand recognition in browser tabs.',
      'no-duplicates': 'Remove duplicate meta tags to avoid conflicts.',
    },
  };

  return suggestions[category]?.[checkId];
}

function getRecommendationDescription(category: string, checkId: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    seo: {
      'has-title': 'Your page is missing a title tag, which is essential for SEO and user experience.',
      'title-length': 'Your title length is not optimal for search engine results.',
      'has-description': 'Add a meta description to improve click-through rates from search results.',
      'description-length': 'Optimize your meta description length for better search engine display.',
      'has-canonical': 'Implement canonical URLs to prevent duplicate content penalties.',
    },
    openGraph: {
      'has-title': 'Add Open Graph title for better social media previews.',
      'has-description': 'Add Open Graph description for better social media previews.',
      'has-image': 'Add an Open Graph image to make your links visually appealing when shared.',
      'has-url': 'Specify the canonical URL for Open Graph to ensure consistent sharing.',
      'has-type': 'Specify the content type for proper rendering on social platforms.',
      'has-site-name': 'Identify your website with the site name tag.',
      'has-locale': 'Specify the language locale for international audiences.',
      'image-dims': 'Use properly sized images for optimal display across all platforms.',
    },
    twitter: {
      'has-card': 'Enable Twitter Cards to enhance how your links appear on Twitter.',
      'has-title': 'Add a Twitter-specific title for better engagement on Twitter.',
      'has-description': 'Add a Twitter-specific description for better engagement on Twitter.',
      'has-image': 'Add a Twitter image to make your tweets more visually appealing.',
    },
    technical: {
      'language': 'Specify the language of your content for accessibility and SEO.',
      'viewport': 'Ensure your site is mobile-friendly with proper viewport configuration.',
      'charset': 'Define the character encoding to prevent text rendering issues.',
      'robots': 'Control how search engines interact with your pages.',
      'favicon': 'Add a favicon for better brand recognition.',
      'no-duplicates': 'Clean up duplicate tags to avoid potential conflicts.',
    },
  };

  return descriptions[category]?.[checkId] || 'Review and fix this issue for better metadata quality.';
}

function getImplementation(category: string, checkId: string): string | undefined {
  const implementations: Record<string, Record<string, string>> = {
    seo: {
      'has-title': '<title>Your Page Title</title>',
      'title-length': 'Keep your title between 50-60 characters: <title>Optimal Title length for SEO</title>',
      'has-description': '<meta name="description" content="Your description here">',
      'description-length': 'Write a 150-160 character description: <meta name="description" content="Comprehensive description that provides value and encourages clicks">',
      'has-canonical': '<link rel="canonical" href="https://example.com/page">',
    },
    openGraph: {
      'og-title': '<meta property="og:title" content="Your Title">',
      'og-description': '<meta property="og:description" content="Your description">',
      'og-image': '<meta property="og:image" content="https://example.com/image.jpg">',
      'og-url': '<meta property="og:url" content="https://example.com/page">',
      'og-type': '<meta property="og:type" content="website">',
      'og-site-name': '<meta property="og:site_name" content="Your Site Name">',
      'og-locale': '<meta property="og:locale" content="en_US">',
      'og-image-dims': '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">',
    },
    twitter: {
      'twitter-card': '<meta name="twitter:card" content="summary_large_image">',
      'twitter-title': '<meta name="twitter:title" content="Your Title">',
      'twitter-description': '<meta name="twitter:description" content="Your description">',
      'twitter-image': '<meta name="twitter:image" content="https://example.com/image.jpg">',
    },
    technical: {
      'language': '<html lang="en">',
      'viewport': '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      'charset': '<meta charset="UTF-8">',
      'robots': '<meta name="robots" content="index, follow">',
      'favicon': '<link rel="icon" href="/favicon.ico">',
      'no-duplicates': 'Review your HTML and remove duplicate meta tags.',
    },
  };

  return implementations[category]?.[checkId];
}
