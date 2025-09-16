import { NextRequest, NextResponse } from 'next/server';import { prisma } from '@/lib/db'
function ok(req:NextRequest){const key=req.headers.get('x-admin-key')||'';return !!key&&!!process.env.ADMIN_KEY&&key===process.env.ADMIN_KEY}
export async function POST(req:NextRequest){if(!ok(req))return new NextResponse('Unauthorized',{status:401});const body=await req.json();const pillars = String(body.pillar || '')
  .replace(/\|/g, ',')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean)
  .join(',')

const tags = String(body.tags || '')
  .replace(/\|/g, ',')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean)
  .join(',')
;const item=await prisma.scheme.upsert({where:{name:body.name},update:{shortCode:body.shortCode||null,type:body.type,authority:body.authority,pillar:pillars,description:body.description||'',benefits:body.benefits||null,eligibility:body.eligibility||null,documentsUrl:body.documentsUrl||null,tags},create:{name:body.name,shortCode:body.shortCode||null,type:body.type,authority:body.authority,pillar:pillars,description:body.description||'',benefits:body.benefits||null,eligibility:body.eligibility||null,documentsUrl:body.documentsUrl||null,tags}});return NextResponse.json(item)}
