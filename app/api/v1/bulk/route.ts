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

    const { urls } = z.object({
      urls: z.array(z.string().url()),
    }).parse(body);

    if (urls.length === 0 || urls.length > 10) {
      return NextResponse.json(
        { error: 'Please provide 1-10 URLs' },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const fetchResult = await secureFetch(url, {
          timeoutMs: 15000,
          maxRedirects: 5,
          maxSizeBytes: 5 * 1024 * 1024,
        });

        if (!fetchResult.success) {
          return {
            url,
            success: false,
            error: fetchResult.error,
            fetchedAt: new Date().toISOString(),
          };
        }

        const metadata = extractMetadata(fetchResult.content, url);

        return {
          url,
          success: true,
          finalUrl: fetchResult.finalUrl,
          statusCode: fetchResult.status,
          metadata,
          fetchedAt: new Date().toISOString(),
        };
      })
    );

    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length;
    const failed = results.filter(
      (r) => r.status === 'rejected' || (r.value && !r.value.success)
    ).length;

    return NextResponse.json({
      success: true,
      summary: {
        total: urls.length,
        successful,
        failed,
      },
      results: results.map((r) =>
        r.status === 'rejected'
          ? { error: r.reason.message }
          : r.value
      ),
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Bulk API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
