import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { secureFetch } from '@/lib/security';
import { extractMetadata } from '@/lib/extractors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { url1, url2 } = z.object({
      url1: z.string().url(),
      url2: z.string().url(),
    }).parse(body);

    // Fetch both URLs
    const [result1, result2] = await Promise.all([
      secureFetch(url1, { timeoutMs: 15000, maxRedirects: 5 }),
      secureFetch(url2, { timeoutMs: 15000, maxRedirects: 5 }),
    ]);

    if (!result1.success || !result2.success) {
      return NextResponse.json({
        success: false,
        error: !result1.success && !result2.success
          ? 'Both URLs failed to fetch'
          : !result1.success
          ? 'First URL failed to fetch'
          : 'Second URL failed to fetch',
      }, { status: 400 });
    }

    // Extract metadata from both
    const metadata1 = extractMetadata(result1.content, url1);
    const metadata2 = extractMetadata(result2.content, url2);

    // Compare key fields
    const comparison = {
      title: {
        url1: metadata1.title,
        url2: metadata2.title,
        different: metadata1.title !== metadata2.title,
      },
      description: {
        url1: metadata1.description,
        url2: metadata2.description,
        different: metadata1.description !== metadata2.description,
      },
      ogTitle: {
        url1: metadata1.ogTitle,
        url2: metadata2.ogTitle,
        different: metadata1.ogTitle !== metadata2.ogTitle,
      },
      ogDescription: {
        url1: metadata1.ogDescription,
        url2: metadata2.ogDescription,
        different: metadata1.ogDescription !== metadata2.ogDescription,
      },
      ogImage: {
        url1: metadata1.ogImage,
        url2: metadata2.ogImage,
        different: metadata1.ogImage !== metadata2.ogImage,
      },
      canonical: {
        url1: metadata1.canonical,
        url2: metadata2.canonical,
        different: metadata1.canonical !== metadata2.canonical,
      },
      statusCode: {
        url1: result1.status,
        url2: result2.status,
        different: result1.status !== result2.status,
      },
    };

    const fieldsCompared = Object.keys(comparison);
    const fieldsDifferent = fieldsCompared.filter(
      (key) => comparison[key as keyof typeof comparison].different
    ).length;

    return NextResponse.json({
      success: true,
      url1,
      url2,
      comparison,
      summary: {
        totalFields: fieldsCompared.length,
        differentFields: fieldsDifferent,
        similarity: Math.round(((fieldsCompared - fieldsDifferent) / fieldsCompared) * 100),
      },
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Compare API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
