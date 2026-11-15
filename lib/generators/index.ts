import type { ExtractedMetadata } from '@/types';
import type { GeneratedMetadata } from '@/types';

export function generateMetadataCode(data: {
  title: string;
  description: string;
  url: string;
  siteName?: string;
  imageUrl?: string;
  contentType?: string;
  twitterCardType?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  locale?: string;
}): GeneratedMetadata {
  const {
    title,
    description,
    url,
    siteName = new URL(url).hostname,
    imageUrl,
    contentType = 'website',
    twitterCardType = 'summary_large_image',
    twitterSite,
    twitterCreator,
    canonicalUrl = url,
    locale = 'en_US',
  } = data;

  const htmlEscape = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const html = `<!-- LinkScope Generated Metadata -->
<title>${htmlEscape(title)}</title>
<meta name="description" content="${htmlEscape(description)}">
<link rel="canonical" href="${htmlEscape(canonicalUrl)}">

<!-- Open Graph -->
<meta property="og:title" content="${htmlEscape(title)}">
<meta property="og:description" content="${htmlEscape(description)}">
<meta property="og:url" content="${htmlEscape(url)}">
<meta property="og:type" content="${htmlEscape(contentType)}">
<meta property="og:site_name" content="${htmlEscape(siteName)}">
<meta property="og:locale" content="${htmlEscape(locale)}">
${imageUrl ? `<meta property="og:image" content="${htmlEscape(imageUrl)}">` : ''}

<!-- Twitter Card -->
<meta name="twitter:card" content="${htmlEscape(twitterCardType)}">
<meta name="twitter:title" content="${htmlEscape(title)}">
<meta name="twitter:description" content="${htmlEscape(description)}">
${imageUrl ? `<meta name="twitter:image" content="${htmlEscape(imageUrl)}">` : ''}
${twitterSite ? `<meta name="twitter:site" content="${htmlEscape(twitterSite)}">` : ''}
${twitterCreator ? `<meta name="twitter:creator" content="${htmlEscape(twitterCreator)}">` : ''}
`;

  const nextjsDynamic = `// Next.js Dynamic Metadata (Server Component)
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${htmlEscape(title)}',
  description: '${htmlEscape(description)}',
  canonical: '${htmlEscape(canonicalUrl)}',
  openGraph: {
    title: '${htmlEscape(title)}',
    description: '${htmlEscape(description)}',
    url: '${htmlEscape(url)}',
    type: '${htmlEscape(contentType)}',
    siteName: '${htmlEscape(siteName)}',
    locale: '${htmlEscape(locale)}',
    ${imageUrl ? `images: ['${htmlEscape(imageUrl)}'],` : 'images: [],'}
  },
  twitter: {
    card: '${htmlEscape(twitterCardType)}',
    title: '${htmlEscape(title)}',
    description: '${htmlEscape(description)}',
    ${imageUrl ? `images: ['${htmlEscape(imageUrl)}'],` : 'images: [],'}
    ${twitterSite ? `site: '${htmlEscape(twitterSite)}',` : ''}
    ${twitterCreator ? `creator: '${htmlEscape(twitterCreator)}',` : ''}
  },
};
`;

  const nextjsStatic = `// Next.js Static Metadata
export const metadata = {
  title: {
    default: '${htmlEscape(title)}',
    template: '%s | ${htmlEscape(siteName)}',
  },
  description: '${htmlEscape(description)}',
  openGraph: {
    title: '${htmlEscape(title)}',
    description: '${htmlEscape(description)}',
    url: '${htmlEscape(url)}',
    type: '${htmlEscape(contentType)}',
    siteName: '${htmlEscape(siteName)}',
    locale: '${htmlEscape(locale)}',
    ${imageUrl ? `images: [{ url: '${htmlEscape(imageUrl)}' }],` : 'images: [],'}
  },
  twitter: {
    card: '${htmlEscape(twitterCardType)}',
    title: '${htmlEscape(title)}',
    description: '${htmlEscape(description)}',
    ${imageUrl ? `images: ['${htmlEscape(imageUrl)}'],` : 'images: [],'}
  },
};
`;

  const react = `// React Helmet (for Create React App or similar)
import { Helmet } from 'react-helmet';

function MetaTags() {
  return (
    <Helmet>
      <title>${htmlEscape(title)}</title>
      <meta name="description" content="${htmlEscape(description)}" />
      <link rel="canonical" href="${htmlEscape(canonicalUrl)}" />
      
      <meta property="og:title" content="${htmlEscape(title)}" />
      <meta property="og:description" content="${htmlEscape(description)}" />
      <meta property="og:url" content="${htmlEscape(url)}" />
      <meta property="og:type" content="${htmlEscape(contentType)}" />
      <meta property="og:site_name" content="${htmlEscape(siteName)}" />
      <meta property="og:locale" content="${htmlEscape(locale)}" />
      ${imageUrl ? `<meta property="og:image" content="${htmlEscape(imageUrl)}" />` : ''}
      
      <meta name="twitter:card" content="${htmlEscape(twitterCardType)}" />
      <meta name="twitter:title" content="${htmlEscape(title)}" />
      <meta name="twitter:description" content="${htmlEscape(description)}" />
      ${imageUrl ? `<meta name="twitter:image" content="${htmlEscape(imageUrl)}" />` : ''}
      ${twitterSite ? `<meta name="twitter:site" content="${htmlEscape(twitterSite)}" />` : ''}
      ${twitterCreator ? `<meta name="twitter:creator" content="${htmlEscape(twitterCreator)}" />` : ''}
    </Helmet>
  );
}
`;

  const openGraph = [
    `og:title: ${title}`,
    `og:description: ${description}`,
    `og:url: ${url}`,
    `og:type: ${contentType}`,
    `og:site_name: ${siteName}`,
    `og:locale: ${locale}`,
    imageUrl ? `og:image: ${imageUrl}` : 'og:image: (not set)',
  ];

  const twitterCards = [
    `twitter:card: ${twitterCardType}`,
    `twitter:title: ${title}`,
    `twitter:description: ${description}`,
    imageUrl ? `twitter:image: ${imageUrl}` : 'twitter:image: (not set)',
    twitterSite ? `twitter:site: ${twitterSite}` : 'twitter:site: (not set)',
    twitterCreator ? `twitter:creator: ${twitterCreator}` : 'twitter:creator: (not set)',
  ];

  return {
    html,
    nextjsDynamic,
    nextjsStatic,
    react,
    openGraph,
    twitterCards,
  };
}
