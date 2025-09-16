// app/schemes/schemes-client.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SchemeCard } from '@/components/SchemeCard';
import { Search, Filter } from 'lucide-react';

type Scheme = {
  id: string;
  name: string;
  shortCode: string | null;
  type: string;
  authority: string;
  description: string;
  benefits: string | null;
  eligibility: string | null;
  documentsUrl: string | null;
  tags: string; // comma-separated
  _count?: { linksFrom: number; linksTo: number };
};

type Props = {
  initialTab: 'schemes' | 'certifications' | 'frameworks';
  initialSchemes: Scheme[];
  initialQuery: Record<string, string | undefined>;
};

const tabs: Array<{ key: Props['initialTab']; label: string }> = [
  { key: 'schemes', label: 'Schemes' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'frameworks', label: 'Frameworks' },
];

export default function SchemesClient({ initialTab, initialSchemes, initialQuery }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [tab, setTab] = React.useState<Props['initialTab']>(initialTab);
  const [q, setQ] = React.useState(initialQuery.q || '');
  const [tag, setTag] = React.useState(initialQuery.tag || 'all');
  const [state, setState] = React.useState(initialQuery.state || 'all');
  const [sector, setSector] = React.useState(initialQuery.sector || '');

  // Re-apply filters by updating the URL (server fetch keeps source of truth)
  const applyFilters = React.useCallback(() => {
    const params = new URLSearchParams(sp.toString());
    params.set('tab', tab);
    q ? params.set('q', q) : params.delete('q');
    sector ? params.set('sector', sector) : params.delete('sector');
    tag && tag !== 'all' ? params.set('tag', tag) : params.delete('tag');
    state && state !== 'all' ? params.set('state', state) : params.delete('state');
    router.push(`/schemes?${params.toString()}`);
  }, [router, sp, tab, q, sector, tag, state]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Schemes, Certifications & Frameworks</h1>
          <p className="text-sm text-slate-600">
            Search, filter, upload circulars, and track application progress.
          </p>
        </div>

        <div className="flex items-center gap-2" role="tablist" aria-label="Scheme Tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => { setTab(t.key); }}
              className={`px-3 py-1.5 rounded-full text-sm border transition 
                ${tab === t.key ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 hover:bg-slate-100'}`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={applyFilters}
            className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-sm"
            aria-label="Apply filters"
            title="Apply filters"
          >
            Apply
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-4 flex items-center gap-2 rounded-lg border p-2">
          <Search className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            aria-label="Search schemes"
            className="w-full outline-none bg-transparent"
            placeholder="Search by name, code, description…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        <div className="md:col-span-3 flex items-center gap-2 rounded-lg border p-2">
          <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <select aria-label="Tag" className="w-full bg-transparent outline-none" value={tag} onChange={e => setTag(e.target.value)}>
            <option value="all">All categories</option>
            <option value="Subsidy">Subsidy</option>
            <option value="Certification">Certification</option>
            <option value="Framework">Framework</option>
            <option value="State">State-specific</option>
          </select>
        </div>

        <div className="md:col-span-3 flex items-center gap-2 rounded-lg border p-2">
          <span className="text-slate-500 text-sm">State</span>
          <select aria-label="State" className="w-full bg-transparent outline-none" value={state} onChange={e => setState(e.target.value)}>
            <option value="all">All</option>
            <option value="Goa">Goa</option>
            {/* add more states as needed */}
          </select>
        </div>

        <div className="md:col-span-2 flex items-center gap-2 rounded-lg border p-2">
          <span className="text-slate-500 text-sm">Sector</span>
          <input
            aria-label="Sector"
            className="w-full outline-none bg-transparent"
            placeholder="e.g., Food, Pharma"
            value={sector}
            onChange={e => setSector(e.target.value)}
          />
        </div>
      </section>

      {/* Results */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {initialSchemes.length === 0 && (
          <div className="text-sm text-slate-600">No results. Try changing filters.</div>
        )}
        {initialSchemes.map((s) => (
          <SchemeCard key={s.id} scheme={s} />
        ))}
      </section>
    </div>
  );
}
