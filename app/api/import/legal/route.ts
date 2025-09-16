import { NextRequest, NextResponse } from 'next/server';import { prisma } from '@/lib/db'
function ok(req:NextRequest){const key=req.headers.get('x-admin-key')||'';return !!key&&!!process.env.ADMIN_KEY&&key===process.env.ADMIN_KEY}
export async function POST(req:NextRequest){if(!ok(req))return new NextResponse('Unauthorized',{status:401});const text=await req.text();const lines=text.split(/\r?\n/).filter(Boolean);const header=lines.shift()?.split(',').map(s=>s.trim())||[];if(!header.includes('title')) return new NextResponse('Bad CSV header',{status:400});const idx=(k:string)=>header.indexOf(k);let count=0;for(const line of lines){const cells=line.split(',');const tags = String(body.tags || '')
  .replace(/\|/g, ',')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean)
  .join(',')
;await prisma.legalDoc.create({data:{title:cells[idx('title')],jurisdiction:cells[idx('jurisdiction')]||'Central',sector:cells[idx('sector')]||null,locationTag:cells[idx('locationTag')]||null,summary:cells[idx('summary')]||'',url:cells[idx('url')]||null,tags}});count++}return NextResponse.json({count})}
