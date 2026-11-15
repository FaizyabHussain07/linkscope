import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateMetadataCode } from '@/lib/generators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const schema = z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      url: z.string().url('Invalid URL'),
      siteName: z.string().optional(),
      imageUrl: z.string().url().optional(),
      contentType: z.enum(['website', 'article', 'product', 'video', 'book', 'profile']).optional(),
      twitterCardType: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
      twitterSite: z.string().optional(),
      twitterCreator: z.string().optional(),
      canonicalUrl: z.string().url().optional(),
      locale: z.string().optional(),
    });

    const data = schema.parse(body);

    // Generate metadata code
    const generated = generateMetadataCode(data);

    return NextResponse.json({
      success: true,
      generated,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
