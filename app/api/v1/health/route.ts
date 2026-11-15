import { NextRequest, NextResponse } from 'next/server';
import { secureFetch } from '@/lib/security';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
