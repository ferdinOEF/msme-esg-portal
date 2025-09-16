import { prisma } from "@/lib/db";
import type { Scheme } from "@prisma/client";   // ⟵ add

export const dynamic = "force-dynamic";         // keep if you’re using it

export default async function SchemesPage() {
  const schemes: Scheme[] = await prisma.scheme.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schemes</h1>
      <p className="text-sm text-slate-600">Browse and manage applicable schemes.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map((s: Scheme) => (
          <div key={s.id} className="rounded-lg border p-4 shadow-sm bg-white">
            {/* ...your card content using s... */}
            <div className="text-lg font-semibold">
              {s.shortCode ? `${s.shortCode} — ` : ""}{s.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
