import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { secureFetch } from '@/lib/security';
import { extractMetadata } from '@/lib/extractors';
import { SECURITY_CONFIG } from '@/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const parsed = z.object({
      url: z.string().url(),
    }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || 'Invalid URL' },
        { status: 400 }
      );
    }
    const { url } = parsed.data;

    // Fetch the URL
    const fetchResult = await secureFetch(url, {
      ...SECURITY_CONFIG,
      allowedContentTypes: [
        'text/html',
        'text/plain',
        'application/xhtml+xml',
        'application/xml',
      ],
    });

    if (!fetchResult.success) {
      return NextResponse.json({
        success: false,
        error: fetchResult.error,
        url,
      }, { status: 400 });
    }

    // Extract metadata
    const metadata = extractMetadata(fetchResult.content, url);

    // Find all image URLs
    const images = [
      metadata.ogImage,
      metadata.twitterImage,
      metadata.favicon,
    ].filter(Boolean);

    // Also extract images from HTML
    const cheerio = await import('cheerio');
    const $ = cheerio.load(fetchResult.content);
    
    $('img').each((_, elem) => {
      const src = $(elem).attr('src');
      const dataSrc = $(elem).attr('data-src');
      const srcset = $(elem).attr('srcset');
      
      if (src && !images.includes(src)) {
        images.push(src);
      }
      if (dataSrc && !images.includes(dataSrc)) {
        images.push(dataSrc);
      }
    });

    return NextResponse.json({
      success: true,
      url,
      finalUrl: fetchResult.finalUrl,
      statusCode: fetchResult.status,
      metadata,
      images: images.slice(0, 20), // Limit to 20 images
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Image inspect API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
