import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Example data arrays: keep your existing arrays for schemes, docs, templates.
 * If you already have these defined elsewhere in your seed file, keep them and
 * remove these placeholders.
 */
const schemes: Array<Prisma.SchemeCreateInput> = [
  // ... your scheme records ...
];

const legalDocs: Array<
  Omit<Prisma.LegalDocCreateInput, 'id'> & { id?: string; title: string }
> = [
  // Each needs a title. Example:
  // { title: 'CPCB Guidelines 2024', jurisdiction: 'Central', sector: null, locationTag: null, summary: '...', url: 'https://...', tags: ['CPCB','Guideline'] }
];

const templates: Array<
  Omit<Prisma.TemplateCreateInput, 'id'> & { id?: string; title: string }
> = [
  // { title: 'ESG Checklist v1', category: 'Checklist', contentMd: '...', downloadUrl: null }
];

/**
 * Helpers that emulate "upsert by title" without requiring a unique index.
 * We look up by title; if found we update by its unique id, otherwise we create.
 */
async function upsertLegalDocByTitle(input: Omit<Prisma.LegalDocCreateInput, 'id'> & { title: string }) {
  const existing = await prisma.legalDoc.findFirst({ where: { title: input.title } });
  if (existing) {
    await prisma.legalDoc.update({
      where: { id: existing.id },
      data: input,
    });
  } else {
    await prisma.legalDoc.create({ data: input });
  }
}

async function upsertTemplateByTitle(input: Omit<Prisma.TemplateCreateInput, 'id'> & { title: string }) {
  const existing = await prisma.template.findFirst({ where: { title: input.title } });
  if (existing) {
    await prisma.template.update({
      where: { id: existing.id },
      data: input,
    });
  } else {
    await prisma.template.create({ data: input });
  }
}

/**
 * If your Scheme model already has `name @unique` (it did earlier), you can
 * keep using upsert by `name`. If not, mirror the pattern above.
 */
async function upsertSchemeByName(input: Prisma.SchemeCreateInput & { name: string }) {
  const existing = await prisma.scheme.findFirst({ where: { name: input.name } });
  if (existing) {
    await prisma.scheme.update({
      where: { id: existing.id },
      data: input,
    });
  } else {
    await prisma.scheme.create({ data: input });
  }
}

async function main() {
  console.log('Seeding…');

  // Seed schemes
  for (const s of schemes) {
    await upsertSchemeByName(s as Prisma.SchemeCreateInput & { name: string });
  }
  console.log(`Seeded/updated ${schemes.length} schemes`);

  // Seed legal docs
  for (const d of legalDocs) {
    await upsertLegalDocByTitle(d);
  }
  console.log(`Seeded/updated ${legalDocs.length} legal docs`);

  // Seed templates
  for (const t of templates) {
    await upsertTemplateByTitle(t);
  }
  console.log(`Seeded/updated ${templates.length} templates`);
}

main()
  .then(async () => {
    console.log('Seed complete.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
