// app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const schemeId = req.nextUrl.searchParams.get('schemeId');
  if (!schemeId) return NextResponse.json({ files: [] });
  const rows = await prisma.file.findMany({
    where: { schemeId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ files: rows });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  const schemeId = String(form.get('schemeId') || '');

  if (!file || !schemeId) {
    return new NextResponse('Missing file or schemeId', { status: 400 });
  }

  // Upload to Vercel Blob
  const blob = await put(file.name, file, { access: 'public' });

  // Persist metadata
  const row = await prisma.file.create({
    data: {
      schemeId,
      filename: file.name,
      url: blob.url,
      status: 'Uploaded',
    },
  });

  return NextResponse.json({ file: row });
}
