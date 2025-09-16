import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Upsert schemes
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
      documentsUrl: 'https://zed.msme.gov.in',
    },
    {
      name: 'Technology and Energy Assessment for MSMEs',
      shortCode: 'TEAM',
      type: 'Scheme',
      authority: 'MSME',
      pillar: 'E',
      tags: 'energy,audit,subsidy',
      description: 'Detailed energy audits and tech upgradation support',
      benefits: 'Co-funding for audits & implementation',
      eligibility: 'Registered MSMEs, sectoral focus',
      documentsUrl: 'https://www.dcmsme.gov.in',
    },
    {
      name: 'MSME SPICE',
      shortCode: 'SPICE',
      type: 'Scheme',
      authority: 'MSME',
      pillar: 'E',
      tags: 'technology,process,efficiency,goa',
      description: 'Support for adoption of specified clean/efficient technologies',
      benefits: 'Subsidy against notified technology list',
      eligibility: 'MSMEs adopting listed tech',
      documentsUrl: null,
    },
    {
      name: 'SIDBI 4E (End-to-End Energy Efficiency)',
      shortCode: 'SIDBI4E',
      type: 'Scheme',
      authority: 'SIDBI',
      pillar: 'E',
      tags: 'finance,loan,energy',
      description: 'Loans + technical assistance for energy efficiency',
      benefits: 'Concessional finance + TA via consultants',
      eligibility: 'Eligible MSMEs across sectors',
      documentsUrl: 'https://www.sidbi.in',
    },
  ]

  for (const s of schemes) {
    await prisma.scheme.upsert({
      where: { name: s.name },
      update: s,
      create: s,
    })
  }

  // Legal docs
  const legal = [
    { title: 'Goa: Plastic Waste Management Advisory (sample)', jurisdiction: 'Goa', sector: 'General', locationTag: 'Goa', summary: 'Illustrative advisory on EPR thresholds for MSMEs', url: null, tags: 'goa,plastic,epr' },
    { title: 'Goa: Consent to Operate timelines (sample)', jurisdiction: 'Goa', sector: 'Manufacturing', locationTag: 'Goa', summary: 'Suggested CTO processing timelines for MSMEs', url: null, tags: 'goa,cto,pollution-control' },
    { title: 'CPCB: Hazardous Waste Guidelines (sample)', jurisdiction: 'Central', sector: 'General', locationTag: null, summary: 'Key requirements on storage/manifest & disposal', url: null, tags: 'cpcb,hazardous-waste' },
  ]
  for (const d of legal) {
    await prisma.legalDoc.upsert({
      where: { title: d.title },
      update: d,
      create: d,
    })
  }

  // Templates
  const templates = [
    { title: 'ESG Starter Checklist', category: 'Checklist', contentMd: '# ESG Starter Checklist\n- Identify legal consents\n- Map E/S/G risks\n- Build 30/60/90 plan', downloadUrl: null },
    { title: 'EIA Input Sheet', category: 'Template', contentMd: '# EIA Input Sheet\nFields: Process, Inputs, Emissions, Effluents, Mitigation', downloadUrl: null },
  ]
  for (const t of templates) {
    await prisma.template.upsert({
      where: { title: t.title },
      update: t,
      create: t,
    })
  }

  // Links (graph)
  const zed = await prisma.scheme.findUnique({ where: { name: 'MSME Sustainable (ZED) Certification' } })
  const spice = await prisma.scheme.findUnique({ where: { name: 'MSME SPICE' } })
  const sidbi4e = await prisma.scheme.findUnique({ where: { name: 'SIDBI 4E (End-to-End Energy Efficiency)' } })

  if (zed && spice) {
    await prisma.link.upsert({
      where: { id: 'zed->spice' },
      update: { relation: 'supports', note: 'ZED compliance strengthens adoption under SPICE', fromId: zed.id, toId: spice.id },
      create: { id: 'zed->spice', relation: 'supports', note: 'ZED compliance strengthens adoption under SPICE', fromId: zed.id, toId: spice.id },
    })
  }
  if (zed && sidbi4e) {
    await prisma.link.upsert({
      where: { id: 'zed->sidbi4e' },
      update: { relation: 'unlocks', note: 'ZED audit outcomes can unlock 4E financing', fromId: zed.id, toId: sidbi4e.id },
      create: { id: 'zed->sidbi4e', relation: 'unlocks', note: 'ZED audit outcomes can unlock 4E financing', fromId: zed.id, toId: sidbi4e.id },
    })
  }
}

main().then(() => {
  console.log('Seed complete')
}).catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
