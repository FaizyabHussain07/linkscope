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
      { id: 'og-image-dims', name: 'OG Image Dimensions', weight: 6, check: (m) => typeof m.ogImageWidth === 'number' && typeof m.ogImageHeight === 'number' && m.ogImageWidth >= 1200 && m.ogImageHeight >= 630 },
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

/**
 * Perform audit on extracted metadata
 */
export function performAudit(metadata: ExtractedMetadata): AuditResult {
  const checks: AuditCheck[] = [];
  const findings: AuditFinding[] = [];
  const recommendations: Recommendation[] = [];
  const categoryScores: CategoryScore[] = [];

  let totalScore = 0;
  let totalMaxScore = 0;

  // Run checks for each category
  Object.entries(CATEGORY_WEIGHTS).forEach(([category, config]) => {
    let categoryScore = 0;

    config.checks.forEach(checkConfig => {
      const passed = checkConfig.check(metadata);
      const check: AuditCheck = {
        id: checkConfig.id,
        name: checkConfig.name,
        passed,
        weight: checkConfig.weight,
        category,
      };
      checks.push(check);

      if (passed) {
        categoryScore += checkConfig.weight;
      }

      // Generate findings for failed checks
      if (!passed) {
        findings.push({
          id: checkConfig.id,
          category,
          type: 'warning',
          title: `Missing: ${checkConfig.name}`,
          description: `The ${checkConfig.name.toLowerCase()} check failed. This may affect how your page is displayed on social platforms and search engines.`,
          affectedTags: getAffectedTags(checkConfig.id, metadata),
          suggestion: getSuggestion(checkConfig.id),
        });
      }
    });

    const maxCategoryScore = config.total;
    categoryScores.push({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      score: categoryScore,
      maxScore: maxCategoryScore,
      weight: maxCategoryScore,
    });

    totalScore += categoryScore;
    totalMaxScore += maxCategoryScore;
  });

  // Add findings for duplicates
  if (metadata.duplicates.length > 0) {
    findings.push({
      id: 'duplicate-tags',
      category: 'Technical',
      type: 'warning',
      title: 'Duplicate Meta Tags Detected',
      description: `Found ${metadata.duplicates.length} duplicate tag(s): ${metadata.duplicates.join(', ')}. Duplicate tags can confuse crawlers and lead to unpredictable behavior.`,
      affectedTags: metadata.duplicates,
      suggestion: 'Remove duplicate tags and keep only one instance of each meta tag.',
    });
    recommendations.push({
      priority: 'medium',
      category: 'Technical',
      title: 'Remove Duplicate Tags',
      description: 'Duplicate meta tags can cause inconsistent behavior across platforms.',
      implementation: 'Remove all but one instance of each duplicate tag.',
    });
  }

  // Add findings for empty tags
  if (metadata.emptyTags.length > 0) {
    findings.push({
      id: 'empty-tags',
      category: 'General',
      type: 'info',
      title: 'Empty or Missing Meta Tags',
      description: `The following tags are empty or missing: ${metadata.emptyTags.join(', ')}.`,
      affectedTags: metadata.emptyTags,
    });
  }

  // Add recommendations based on missing critical elements
  if (!metadata.ogTitle) {
    recommendations.push({
      priority: 'high',
      category: 'Open Graph',
      title: 'Add Open Graph Title',
      description: 'Open Graph titles are used by social platforms to display your page title.',
      implementation: 'Add <meta property="og:title" content="Your Title"> to your page head.',
      codeExample: '<meta property="og:title" content="Your Page Title">',
    });
  }

  if (!metadata.ogDescription) {
    recommendations.push({
      priority: 'high',
      category: 'Open Graph',
      title: 'Add Open Graph Description',
      description: 'Open Graph descriptions provide a summary of your page content for social sharing.',
      implementation: 'Add <meta property="og:description" content="Your description"> to your page head.',
      codeExample: '<meta property="og:description" content="A compelling description of your page content.">',
    });
  }

  if (!metadata.ogImage) {
    recommendations.push({
      priority: 'high',
      category: 'Open Graph',
      title: 'Add Open Graph Image',
      description: 'Open Graph images make your links visually appealing when shared. Recommended size: 1200x630 pixels.',
      implementation: 'Add <meta property="og:image" content="https://your-site.com/image.jpg"> to your page head.',
      codeExample: '<meta property="og:image" content="https://your-site.com/social-image.jpg">',
    });
  }

  if (!metadata.twitterCard) {
    recommendations.push({
      priority: 'medium',
      category: 'Twitter Cards',
      title: 'Add Twitter Card Type',
      description: 'Twitter Card types define how your content appears on X (Twitter).',
      implementation: 'Add <meta name="twitter:card" content="summary_large_image"> to your page head.',
      codeExample: '<meta name="twitter:card" content="summary_large_image">',
    });
  }

  if (!metadata.canonical) {
    recommendations.push({
      priority: 'medium',
      category: 'SEO',
      title: 'Add Canonical URL',
      description: 'Canonical URLs help search engines understand which version of a page to index.',
      implementation: 'Add <link rel="canonical" href="https://your-site.com/page"> to your page head.',
      codeExample: '<link rel="canonical" href="https://your-site.com/current-page">',
    });
  }

  // Check for title/description length issues
  if (metadata.title && typeof metadata.title === 'string' && metadata.title.length < 30) {
    recommendations.push({
      priority: 'medium',
      category: 'SEO',
      title: 'Lengthen Your Title',
      description: 'Your HTML title is very short. Longer titles (50-60 characters) typically perform better in search results.',
      implementation: 'Expand your title to include more relevant keywords while staying under 60 characters.',
    });
  }

  if (metadata.description && typeof metadata.description === 'string' && metadata.description.length < 100) {
    recommendations.push({
      priority: 'medium',
      category: 'SEO',
      title: 'Lengthen Your Description',
      description: 'Your meta description is quite short. Descriptions between 150-160 characters typically perform better.',
      implementation: 'Expand your description to provide more context while staying under 160 characters.',
    });
  }

  // Generate audit result
  const overallScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

  return {
    score: overallScore,
    maxScore: 100,
    categoryScores,
    findings,
    passed: checks.filter(c => c.passed),
    failed: checks.filter(c => !c.passed),
    recommendations,
  };
}

/**
 * Calculate overall score from audit
 */
export function calculateScore(audit: AuditResult): number {
  return audit.score;
}

function getAffectedTags(checkId: string, metadata: ExtractedMetadata): string[] {
  const tagMap: Record<string, string[]> = {
    'has-title': ['title'],
    'title-length': ['title'],
    'has-description': ['description'],
    'description-length': ['description'],
    'has-canonical': ['canonical'],
    'og-title': ['og:title'],
    'og-description': ['og:description'],
    'og-image': ['og:image'],
    'og-url': ['og:url'],
    'og-type': ['og:type'],
    'og-site-name': ['og:site_name'],
    'og-locale': ['og:locale'],
    'og-image-dims': ['og:image'],
    'twitter-card': ['twitter:card'],
    'twitter-title': ['twitter:title'],
    'twitter-description': ['twitter:description'],
    'twitter-image': ['twitter:image'],
    'language': ['html lang'],
    'viewport': ['viewport'],
    'charset': ['charset'],
    'robots': ['robots'],
    'favicon': ['favicon'],
    'no-duplicates': metadata.duplicates,
  };

  return tagMap[checkId] || [];
}

function getSuggestion(checkId: string): string {
  const suggestions: Record<string, string> = {
    'has-title': 'Add a descriptive <title> tag to your HTML head.',
    'title-length': 'Adjust your title to be between 50-60 characters for optimal display.',
    'has-description': 'Add a <meta name="description"> tag with a summary of your page content.',
    'description-length': 'Adjust your description to be between 150-160 characters for optimal display.',
    'has-canonical': 'Add a <link rel="canonical"> tag pointing to the preferred URL.',
    'og-title': 'Add <meta property="og:title"> with your page title.',
    'og-description': 'Add <meta property="og:description"> with a compelling description.',
    'og-image': 'Add <meta property="og:image"> with a URL to your social sharing image.',
    'og-url': 'Add <meta property="og:url"> with the canonical URL of this page.',
    'og-type': 'Add <meta property="og:type"> with the appropriate type (website, article, etc.).',
    'og-site-name': 'Add <meta property="og:site_name"> with your website name.',
    'og-locale': 'Add <meta property="og:locale"> with the appropriate locale (e.g., en_US).',
    'og-image-dims': 'Ensure your OG image is at least 1200x630 pixels for optimal display.',
    'twitter-card': 'Add <meta name="twitter:card"> with a card type (summary or summary_large_image).',
    'twitter-title': 'Add <meta name="twitter:title"> with your page title.',
    'twitter-description': 'Add <meta name="twitter:description"> with a description.',
    'twitter-image': 'Add <meta name="twitter:image"> with a URL to your image.',
    'language': 'Add the lang attribute to your <html> tag (e.g., <html lang="en">).',
    'viewport': 'Add <meta name="viewport"> for proper mobile rendering.',
    'charset': 'Add a charset meta tag (e.g., <meta charset="UTF-8">).',
    'robots': 'Add <meta name="robots"> to control crawler behavior.',
    'favicon': 'Add a favicon <link> tag for browser tab icons.',
    'no-duplicates': 'Remove duplicate tags and keep only one instance of each.',
  };

  return suggestions[checkId] || 'Review and fix this issue for better metadata compatibility.';
}

/**
 * Get score breakdown for display
 */
export function getScoreBreakdown(audit: AuditResult): {
  overall: number;
  categories: Array<{ name: string; score: number; maxScore: number; percentage: number }>;
} {
  return {
    overall: audit.score,
    categories: audit.categoryScores.map(cat => ({
      name: cat.name,
      score: cat.score,
      maxScore: cat.maxScore,
      percentage: Math.round((cat.score / cat.maxScore) * 100),
    })),
  };
}
