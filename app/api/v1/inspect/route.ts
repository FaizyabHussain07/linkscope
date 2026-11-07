import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { secureFetch } from '@/lib/security';
import { SECURITY_CONFIG } from '@/config';
import { extractMetadata } from '@/lib/extractors';
import { performAudit, calculateScore } from '@/lib/analyzers';

// Request schema
const InspectRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

// Response schemas
const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  url: z.string(),
  fetchedAt: z.string(),
});

const SuccessResponseSchema = z.object({
  success: z.literal(true),
  url: z.string(),
  fetchedAt: z.string(),
  metadata: z.any(),
  audit: z.any(),
});

type InspectRequest = z.infer<typeof InspectRequestSchema>;

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body', url: '', fetchedAt: new Date().toISOString() },
        { status: 400 }
      );
    }

    const validationResult = InspectRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request: ' + validationResult.error.errors[0]?.message, url: body.url || '', fetchedAt: new Date().toISOString() },
        { status: 400 }
      );
    }

    const { url } = validationResult.data;
    const fetchedAt = new Date().toISOString();

    // Fetch the URL securely
    const fetchResult = await secureFetch(url, {
      timeoutMs: SECURITY_CONFIG.timeoutMs,
      maxRedirects: SECURITY_CONFIG.maxRedirects,
      maxSizeBytes: SECURITY_CONFIG.maxSizeBytes,
      connectTimeoutMs: 10000,
      userAgent: `LinkScope/1.0 (+${process.env.NEXT_PUBLIC_SITE_URL || 'https://linkscope.faizyab.me'})`,
    });

    if (!fetchResult.success) {
      return NextResponse.json({
        success: false,
        error: fetchResult.error || 'Failed to fetch URL',
        url,
        fetchedAt,
      }, { status: fetchResult.status >= 400 ? fetchResult.status : 500 });
    }

    // Extract metadata from HTML
    const metadata = extractMetadata(fetchResult.content, url);

    // Perform audit and calculate score
    const audit = performAudit(metadata);
    const score = calculateScore(audit);

    return NextResponse.json({
      success: true,
      url,
      fetchedAt,
      metadata,
      audit: {
        ...audit,
        score,
      },
    });
  } catch (error) {
    console.error('Inspect API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', url: '', fetchedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
