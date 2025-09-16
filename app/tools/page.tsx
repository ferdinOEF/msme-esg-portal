export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import type { Template } from '@prisma/client';

export default async function ToolsPage() {
  const templates: Template[] = await prisma.template.findMany({
    orderBy: { title: 'asc' },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Compliance Tools</h1>
      <p className="text-sm text-slate-600">
        Downloadable checklists, audit templates, and policy samples.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t: Template) => (
          <div key={t.id} className="card">
            <div className="text-lg font-semibold">{t.title}</div>
            <div className="text-xs text-slate-500">{t.category.toUpperCase()}</div>
            <pre className="bg-slate-50 rounded p-2 mt-2 text-xs whitespace-pre-wrap">
              {t.contentMd}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
