import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const schemes = [
  {
    name: 'MSME Sustainable (ZED) Certification',
    shortCode: 'ZED',
    type: 'Certification',
    authority: 'MSME',
    description: 'ZED 2.0 certification for MSMEs with Bronze/Silver/Gold levels.',
    benefits: 'Subsidy on certification, handholding, assessments.',
    eligibility: 'Registered MSMEs; support varies by category.',
    documentsUrl: 'https://zed.msme.gov.in',
    tags: 'central,certification,quality,sustainability'
  },
  {
    name: 'TEAM Energy Audit Support',
    shortCode: 'TEAM',
    type: 'Scheme',
    authority: 'BEE',
    description: 'Support for energy audits and implementation for MSMEs.',
    benefits: 'Cost-sharing for audits & efficiency improvements.',
    eligibility: 'MSMEs across selected clusters.',
    documentsUrl: 'https://beeindia.gov.in',
    tags: 'central,scheme,energy,efficiency'
  },
  {
    name: 'GIFT Green Finance Facilitation',
    shortCode: 'GIFT',
    type: 'Framework',
    authority: 'SIDBI',
    description: 'Facilitation for green finance and ESG-linked lending.',
    benefits: 'Access to concessional finance and advisory.',
    eligibility: 'Eligible MSMEs seeking green projects.',
    documentsUrl: 'https://sidbi.in',
    tags: 'finance,framework,esg,central'
  }
];

const legalDocs = [
  {
    title: 'CPCB General Guidelines for MSMEs',
    jurisdiction: 'Central',
    sector: 'General',
    locationTag: null,
    summary: 'Baseline compliance guidance for MSMEs under environmental acts.',
    url: 'https://cpcb.nic.in',
    tags: 'central,guideline,environment'
  },
  {
    title: 'Goa SPCB Consent Procedure',
    jurisdiction: 'State',
    sector: 'General',
    locationTag: 'Goa',
    summary: 'Consent to Establish/Operate (Goa) procedures and timelines.',
    url: 'https://gspcb.goa.gov.in',
    tags: 'state,goa,consent,procedure'
  }
];

const templates = [
  {
    title: 'Environmental Compliance Checklist',
    category: 'Checklist',
    contentMd:
`# Environmental Compliance Checklist

- CTO/CTE validity
- Hazardous waste authorization (if applicable)
- EPR (where applicable)
- Records & manifests up to date
`,
    downloadUrl: null,
    tags: 'checklist,compliance,environment'
  },
  {
    title: 'OSH Policy Template',
    category: 'Policy',
    contentMd:
`# OSH Policy

Commitment to occupational safety & health, roles & responsibilities, incident reporting.
`,
    downloadUrl: null,
    tags: 'policy,osh,safety'
  }
];

async function main() {
  // Schemes: upsert by unique name
  for (const s of schemes) {
    await prisma.scheme.upsert({
      where: { name: s.name },
      update: {
        shortCode: s.shortCode,
        type: s.type,
        authority: s.authority,
        description: s.description,
        benefits: s.benefits,
        eligibility: s.eligibility,
        documentsUrl: s.documentsUrl,
        tags: s.tags
      },
      create: s
    });
  }

  // Legal docs: upsert by unique title
  for (const d of legalDocs) {
    await prisma.legalDoc.upsert({
      where: { title: d.title },
      update: {
        jurisdiction: d.jurisdiction,
        sector: d.sector,
        locationTag: d.locationTag,
        summary: d.summary,
        url: d.url,
        tags: d.tags
      },
      create: d
    });
  }

  // Templates: upsert by unique title
  for (const t of templates) {
    await prisma.template.upsert({
      where: { title: t.title },
      update: {
        category: t.category,
        contentMd: t.contentMd,
        downloadUrl: t.downloadUrl,
        tags: t.tags
      },
      create: t
    });
  }

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
