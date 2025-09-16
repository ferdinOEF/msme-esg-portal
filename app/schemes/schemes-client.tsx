@'
"use client";

import { useMemo, useState } from "react";
import SchemeCard, { Scheme } from "@/components/SchemeCard";

type Props = {
  schemes: Scheme[];
};

export default function SchemesClient({ schemes }: Props) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const s of schemes) {
      (s.tags || "")
        .split(",")
        .map(t => t.trim())
        .filter(Boolean)
        .forEach(t => set.add(t));
    }
    return Array.from(set).sort();
  }, [schemes]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const tt = tag.trim().toLowerCase();
    return schemes.filter(s => {
      const hay =
        (s.name || "") +
        " " +
        (s.shortCode || "") +
        " " +
        (s.description || "") +
        " " +
        (s.eligibility || "") +
        " " +
        (s.benefits || "") +
        " " +
        (s.tags || "");
      const okQ = qq ? hay.toLowerCase().includes(qq) : true;
      const okT = tt ? (s.tags || "").toLowerCase().split(",").map(x => x.trim()).includes(tt) : true;
      return okQ && okT;
    });
  }, [schemes, q, tag]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Schemes, Certifications & Frameworks</h1>
          <p className="text-sm text-slate-600">
            Search, filter, upload supporting docs, download circulars, and track status.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search name / text…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-56 rounded border px-3 py-2 text-sm"
            aria-label="Search schemes"
          />
          <select
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
            aria-label="Filter by tag"
          >
            <option value="">All tags</option>
            {allTags.map(t => (
              <option key={t} value={t.toLowerCase()}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="text-sm text-slate-600 border rounded bg-white p-6">No schemes match the current filters.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      )}
    </div>
  );
}
'@ | Set-Content -NoNewline app/schemes/schemes-client.tsx
