import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // ---- SCHEMES / CERTIFICATIONS / FRAMEWORKS ----
  const schemes = [
    {
      name: 'MSME Sustainable (ZED) Certification',
      shortCode: 'ZED',
      type: 'Certification',
      authority: 'MSME',
      pillar: 'E,S,G',
      tags: 'central,scheme,quality,sustainability',
      description: 'ZED 2.0 certification for MSMEs with Bronze/Silver/Gold levels',
      benefits: 'Subsidy on certification, handholding, assessments',
      eligibility: 'Registered MSMEs; support varies by category',
      documentsUrl: 'https://zed.msme.gov.in'
    },
    {
      name: 'SIDBI 4E – End to End Energy Efficiency',
      shortCode: 'SIDBI-4E',
      type: 'Scheme',
      authority: 'SIDBI',
      pillar: 'E',
      tags: 'energy-efficiency,finance,loan,central',
      description: 'Loans for MSMEs implementing energy efficiency measures and technology upgrades.',
      benefits: 'Low interest financing, technical support, DPR vetting',
      eligibility: 'MSMEs with DEA/DPR as per SIDBI guidelines',
      documentsUrl: 'https://www.sidbi.in'
    },
    {
      name: 'BIS Product Certification (ISI)',
      shortCode: 'BIS-ISI',
      type: 'Certification',
      authority: 'BIS',
      pillar: 'QMS',
      tags: 'quality,standards,certification,central',
      description: 'BIS certification (ISI mark) for specified products.',
      benefits: 'Market access, credibility, compliance',
      eligibility: 'Manufacturers in notified product categories',
      documentsUrl: 'https://bis.gov.in'
    },
    {
      name: 'Goa – SPICE Circular Economy Subsidy',
      shortCode: 'SPICE-GOA',
      type: 'Subsidy',
      authority: 'Goa State',
      pillar: 'E',
      tags: 'state,goa,circular-economy,subsidy',
      description: 'State incentive for circular economy capex and waste reduction.',
      benefits: 'Capital subsidy, recognition, technical assistance',
      eligibility: 'Eligible MSMEs/units registered in Goa',
      documentsUrl: 'https://goa.gov.in'
    }
  ]

  for (const s of schemes) {
    await prisma.scheme.upsert({
      where: { name: s.name },     // title is unique in schema
      update: { ...s },
      create: { ...s },
    })
  }

  // ---- TEMPLATES ----
  const templates = [
    {
      title: 'Environmental Compliance Checklist',
      category: 'Checklist',
      contentMd:
        '# Environmental Compliance Checklist\n\n' +
        '- CTO/CTE validity\n- Hazardous waste authorization (if applicable)\n' +
        '- EPR (where applicable)\n- Records & manifests up to date\n',
      tags: 'checklist,compliance,environment',
      downloadUrl: null,
    },
    {
      title: 'OSH & Fire Safety Monthly Audit',
      category: 'Audit',
      contentMd:
        '# OSH & Fire Safety Audit\n\n' +
        '- Fire NOC validity\n- Evacuation drill records\n- PPE availability & logs\n',
      tags: 'safety,osh,fire,audit',
      downloadUrl: null,
    },
  ]

  for (const t of templates) {
    await prisma.template.upsert({
      where: { title: t.title },
      update: { ...t },
      create: { ...t },
    })
  }

  // ---- LEGAL DOCS ----
  const legalDocs = [
    {
      title: 'CPCB General Guidelines for MSMEs',
      jurisdiction: 'Central',
      sector: 'General',
      locationTag: null,
      summary: 'Baseline compliance guidance for MSMEs under environmental acts.',
      url: 'https://cpcb.nic.in',
      tags: 'cpcb,guidelines,environment',
    },
    {
      title: 'GSPCB Consent to Operate (CTO) – Goa',
      jurisdiction: 'State',
      sector: 'General',
      locationTag: 'Goa',
      summary: 'Consent to Operate under Air/Water Acts for Goa units.',
      url: 'https://goa.gov.in',
      tags: 'state,goa,cto,consent',
    },
  ]

  for (const d of legalDocs) {
    await prisma.legalDoc.upsert({
      where: { title: d.title },
      update: { ...d },
      create: { ...d },
    })
  }

  // Optional: attach a sample file to ZED
  const zed = await prisma.scheme.findUnique({ where: { name: 'MSME Sustainable (ZED) Certification' } })
  if (zed) {
    await prisma.file.create({
      data: {
        schemeId: zed.id,
        title: 'ZED Guidelines',
        url: 'https://zed.msme.gov.in',
        status: 'UPLOADED',
      },
    })
  }

  console.log('✅ Seed completed.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
