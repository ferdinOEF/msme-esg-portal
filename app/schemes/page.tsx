// app/schemes/page.tsx
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import SchemesClient from './schemes-client';

type SearchParams = {
  q?: string;
  tag?: string;        // e.g., "Subsidy" | "Certification" | "Framework" | "State"
  state?: string;      // e.g., "Goa"
  sector?: string;     // free text match on description/eligibility
  validity?: 'active' | 'expired' | 'all';
  tab?: 'schemes' | 'certifications' | 'frameworks';
};

export default async function SchemesPage(
  { searchParams }: { searchParams: SearchParams }
) {
  // Base query
  const where: any = {};

  // Text search (name, code, description)
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: 'insensitive' } },
      { shortCode: { contains: searchParams.q, mode: 'insensitive' } },
      { description: { contains: searchParams.q, mode: 'insensitive' } },
    ];
  }

  // Tag/category filter (we store tags as comma-separated string in DB)
  if (searchParams.tag && searchParams.tag !== 'all') {
    where.tags = { contains: searchParams.tag, mode: 'insensitive' };
  }

  // State filter
  if (searchParams.state && searchParams.state !== 'all') {
    // Either a tag like "Goa" or mention in description/eligibility
    where.OR = [
      ...(where.OR || []),
      { tags: { contains: searchParams.state, mode: 'insensitive' } },
      { description: { contains: searchParams.state, mode: 'insensitive' } },
      { eligibility: { contains: searchParams.state, mode: 'insensitive' } },
    ];
  }

  // Sector filter (loose match)
  if (searchParams.sector) {
    where.OR = [
      ...(where.OR || []),
      { description: { contains: searchParams.sector, mode: 'insensitive' } },
      { eligibility: { contains: searchParams.sector, mode: 'insensitive' } },
    ];
  }

  // Validity stub (if you later add fields like `validUntil` or `isActive`)
  // if (searchParams.validity === 'active') where.isActive = true;

  const tab = searchParams.tab ?? 'schemes';

  // Map tabs to a scheme "type" (adjust if your DB uses different values)
  const typeMap: Record<string, string[]> = {
    schemes: ['scheme', 'subsidy', 'fund'],
    certifications: ['certification', 'standard', 'rating'],
    frameworks: ['framework', 'guideline', 'reporting'],
  };

  where.OR = [
    ...(where.OR || []),
    { type: { in: typeMap[tab] || typeMap['schemes'], mode: 'insensitive' } },
  ];

  const schemes = await prisma.scheme.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      linksFrom: true,
      linksTo: true,
      _count: { select: { linksFrom: true, linksTo: true } },
    },
  });

  return <SchemesClient
    initialTab={tab as any}
    initialQuery={searchParams}
    initialSchemes={schemes}
  />;
}
