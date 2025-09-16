import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SchemesPage() {
  const schemes = await prisma.scheme.findMany({
    orderBy: { createdAt: "desc" }
  });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schemes</h1>
      <p className="text-sm text-slate-600">Browse and manage applicable schemes.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map((s) => (
          <div key={s.id} className="rounded-lg border p-4 shadow-sm bg-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-slate-500">{s.shortCode || "—"}</div>
              </div>
            </div>
            <p className="text-sm mt-2 line-clamp-3">{s.description}</p>
          </div>
        ))}
        {schemes.length === 0 && (
          <div className="text-sm text-slate-600">No schemes yet. Import via Admin.</div>
        )}
      </div>
    </div>
  );
}
