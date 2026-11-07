import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/config';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  });
}
