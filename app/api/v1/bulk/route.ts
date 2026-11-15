import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { secureFetch } from '@/lib/security';
import { extractMetadata } from '@/lib/extractors';
import { performAudit, calculateScore } from '@/lib/analyzers';
import { SECURITY_CONFIG, INSPECTION_LIMITS } from '@/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { urls, concurrency = INSPECTION_LIMITS.maxConcurrency } = z.object({
      urls: z.array(z.string().url()),
      concurrency: z.number().int().min(1).max(INSPECTION_LIMITS.maxConcurrency).optional(),
    }).parse(body);

    if (urls.length === 0 || urls.length > INSPECTION_LIMITS.maxBulkUrls) {
      return NextResponse.json(
        { error: 'Please provide 1-10 URLs' },
        { status: 400 }
      );
    }

    const workerCount = Math.min(concurrency, urls.length);
    const results: Array<Awaited<ReturnType<typeof inspectUrl>>> = [];
    for (let index = 0; index < urls.length; index += workerCount) {
      const batch = urls.slice(index, index + workerCount);
      results.push(...await Promise.all(batch.map(inspectUrl)));
    }

    const successful = results.filter((result) => result.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      summary: {
        total: urls.length,
        successful,
        failed,
      },
      results,
      fetchedAt: new Date().toISOString(),
    });

    async function inspectUrl(url: string) {
        const fetchResult = await secureFetch(url, {
          timeoutMs: SECURITY_CONFIG.timeoutMs,
          maxRedirects: SECURITY_CONFIG.maxRedirects,
          maxSizeBytes: SECURITY_CONFIG.maxSizeBytes,
          connectTimeoutMs: SECURITY_CONFIG.connectTimeoutMs,
          blockedHosts: SECURITY_CONFIG.blockedHosts,
        });

        if (!fetchResult.success) {
          return {
            url,
            success: false,
            error: fetchResult.error,
            fetchedAt: new Date().toISOString(),
          };
        }

        const metadata = extractMetadata(fetchResult.content, fetchResult.finalUrl);
        const audit = performAudit(metadata);

        return {
          url,
          success: true,
          finalUrl: fetchResult.finalUrl,
          statusCode: fetchResult.status,
          metadata,
          audit: { ...audit, score: calculateScore(audit) },
          fetchedAt: new Date().toISOString(),
        };
      }
  } catch (error) {
    console.error('Bulk API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
