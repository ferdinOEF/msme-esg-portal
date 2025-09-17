export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/files?schemeId=...
export async function GET(req: NextRequest) {
  try {
    const schemeId = req.nextUrl.searchParams.get('schemeId');
    if (!schemeId) return NextResponse.json({ files: [] });

    const rows = await prisma.file.findMany({
      where: { schemeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ files: rows });
  } catch (err: any) {
    console.error('[files.GET] error', err);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

// POST /api/files  (multipart/form-data or JSON)
// Accepts either:
// - form-data: schemeId, title, url, type, status
// - JSON: { schemeId, title, url, type, status }
export async function POST(req: NextRequest) {
  try {
    let payload: any;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData();
      payload = {
        schemeId: fd.get('schemeId')?.toString() || null,
        title: fd.get('title')?.toString() || 'Untitled',
        url: fd.get('url')?.toString() || null,
        type: (fd.get('type')?.toString() || 'SUPPORTING') as any, // FileType
        status: (fd.get('status')?.toString() || 'UPLOADED') as any, // FileStatus
      };
    } else {
      payload = await req.json();
      payload = {
        schemeId: payload.schemeId ?? null,
        title: payload.title ?? 'Untitled',
        url: payload.url ?? null,
        type: (payload.type ?? 'SUPPORTING') as any,
        status: (payload.status ?? 'UPLOADED') as any,
      };
    }

    const created = await prisma.file.create({ data: payload });
    return NextResponse.json({ file: created }, { status: 201 });
  } catch (err: any) {
    console.error('[files.POST] error', err);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }
}
