import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { secureFetch } from '@/lib/security';
import { SECURITY_CONFIG } from '@/config';
import { extractMetadata } from '@/lib/extractors';
import { performAudit, calculateScore } from '@/lib/analyzers';
import { generateMetadataCode } from '@/lib/generators';

// Request schemas
const InspectRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

const BulkRequestSchema = z.object({
  urls: z.array(z.string().url('Invalid URL format')).min(1).max(10),
  concurrency: z.number().min(1).max(5).optional(),
});

const CompareRequestSchema = z.object({
  url1: z.string().url('Invalid URL format'),
  url2: z.string().url('Invalid URL format'),
});

const GenerateRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Invalid URL format'),
  siteName: z.string().optional(),
  imageUrl: z.string().url().optional(),
  contentType: z.enum(['website', 'article', 'product', 'video', 'book', 'profile']).optional(),
  twitterCardType: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
  twitterSite: z.string().optional(),
  twitterCreator: z.string().optional(),
});

// Response schemas
const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  url: z.string(),
  fetchedAt: z.string(),
});

const InspectResponseSchema = z.object({
  success: z.literal(true),
  url: z.string(),
  finalUrl: z.string(),
  fetchedAt: z.string(),
  statusCode: z.number(),
  metadata: z.any(),
  audit: z.any(),
  recommendations: z.array(z.any()),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const cacheKey = `ratelimit:${ip}`;
    
    // Simple in-memory rate limiting (for production, use Redis)
    const timestamps = rateLimitStore.get(cacheKey) || [];
    const now = Date.now();
    const recentRequests = timestamps.filter((t: number) => now - t < 60000);
    
    if (recentRequests.length >= 10) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Please try again in a minute.',
        url: '',
        fetchedAt: new Date().toISOString(),
      }, { status: 429 });
    }
    
    recentRequests.push(now);
    rateLimitStore.set(cacheKey, recentRequests);

    // Parse and validate request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body',
        url: '',
        fetchedAt: new Date().toISOString(),
      }, { status: 400 });
    }

    const validationResult = InspectRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request: ' + validationResult.error.errors[0]?.message,
        url: body.url || '',
        fetchedAt: new Date().toISOString(),
      }, { status: 400 });
    }

    const { url } = validationResult.data;
    const fetchedAt = new Date().toISOString();

    // Fetch the URL securely
    const fetchResult = await secureFetch(url, {
      timeoutMs: SECURITY_CONFIG.timeoutMs,
      maxRedirects: SECURITY_CONFIG.maxRedirects,
      maxSizeBytes: SECURITY_CONFIG.maxSizeBytes,
      connectTimeoutMs: SECURITY_CONFIG.connectTimeoutMs,
      blockedHosts: SECURITY_CONFIG.blockedHosts,
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
    const metadata = extractMetadata(fetchResult.content, fetchResult.finalUrl);

    // Perform audit and calculate score
    const audit = performAudit(metadata);
    const score = calculateScore(audit);
    const recommendations = audit.recommendations;

    return NextResponse.json({
      success: true,
      url,
      finalUrl: fetchResult.finalUrl,
      fetchedAt,
      statusCode: fetchResult.status,
      metadata,
      audit: {
        ...audit,
        score,
      },
      recommendations,
    });
  } catch (error) {
    console.error('Inspect API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      url: '',
      fetchedAt: new Date().toISOString(),
    }, { status: 500 });
  }
}

const rateLimitStore = new Map<string, number[]>();
