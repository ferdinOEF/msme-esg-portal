export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db'

export default async function GoaPage() {
  const goaDocs = await prisma.legalDoc.findMany({
    where: { locationTag: { contains: 'goa', mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
  })
  const goaSchemes = await prisma.scheme.findMany({
    where: { tags: { contains: 'goa', mode: 'insensitive' } },
    orderBy: { name: 'asc' },
  })

  // Narrow the element types so TS doesnâ€™t infer implicit any in map callbacks
  type GoaDoc = typeof goaDocs[number]
  type GoaScheme = typeof goaSchemes[number]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Goa â€” State-specific Incentives & Notices</h1>
      <p className="text-sm text-slate-600">
        Add state subsidies, ZED top-ups, consent procedures, and circulars via Admin.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="text-lg font-semibold mb-2">Goa Circulars / Legal</div>
          {goaDocs.length === 0 && <div className="text-sm">No entries yet. Use Admin to add.</div>}
          <ul className="text-sm list-disc ml-5">
            {goaDocs.map((d: GoaDoc) => (
              <li key={d.id}>{d.title}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="text-lg font-semibold mb-2">Goa-specific Schemes / Top-ups</div>
          {goaSchemes.length === 0 && (
            <div className="text-sm">No entries yet. Tag schemes with &quot;Goa&quot;.</div>
          )}
          <ul className="text-sm list-disc ml-5">
            {goaSchemes.map((s: GoaScheme) => (
              <li key={s.id}>
                {s.name} {s.shortCode ? `(${s.shortCode})` : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
