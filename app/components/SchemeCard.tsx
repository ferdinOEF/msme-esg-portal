// components/SchemeCard.tsx
'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Download, UploadCloud, Star, CheckCircle2, Link as LinkIcon, Info } from 'lucide-react';

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
  tags: string; // comma-separated (e.g., "Subsidy,Goa")
  _count?: { linksFrom: number; linksTo: number };
};

type FileRow = {
  id: string;
  schemeId: string;
  filename: string;
  url: string;
  status: 'Uploaded' | 'Pending';
  createdAt: string;
};

export function SchemeCard({ scheme }: { scheme: Scheme }) {
  const [open, setOpen] = React.useState(false);
  const [fav, setFav] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const [files, setFiles] = React.useState<FileRow[]>([]);
  const [busy, setBusy] = React.useState(false);

  const tagList = (scheme.tags || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  React.useEffect(() => {
    // Fetch existing files for this scheme
    void (async () => {
      try {
        const res = await fetch(`/api/files?schemeId=${scheme.id}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setFiles(data.files || []);
        }
      } catch {
        // ignore
      }
    })();
  }, [scheme.id]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setBusy(true);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('schemeId', scheme.id);
      const res = await fetch('/api/files', { method: 'POST', body: fd });
      if (!res.ok) {
        const text = await res.text();
        alert('Upload failed: ' + text);
        return;
      }
      const data = await res.json();
      setFiles(f => [data.file, ...f]);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  async function toggleApplied() {
    // Simple client state; wire to API if you want persistence
    setApplied(a => !a);
  }

  return (
    <article className="card bg-white rounded-2xl shadow-sm border p-4 focus-within:ring-2 focus-within:ring-emerald-500">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{scheme.name}</h3>
            {scheme.shortCode && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 border">
                {scheme.shortCode}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {scheme.type} • {scheme.authority}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-pressed={fav}
            onClick={() => setFav(f => !f)}
            className={`p-2 rounded-lg border transition ${fav ? 'bg-yellow-50 border-yellow-400' : 'hover:bg-slate-50'}`}
            title="Save to favourites"
          >
            <Star className={`w-4 h-4 ${fav ? 'text-yellow-500' : 'text-slate-600'}`} />
          </button>
          <button
            onClick={toggleApplied}
            className={`px-2.5 py-1.5 rounded-md text-xs border transition 
              ${applied ? 'bg-emerald-600 text-white border-emerald-600' : 'hover:bg-slate-50'}`}
            title="Mark as applied"
            aria-pressed={applied}
          >
            {applied ? 'Applied' : 'Mark applied'}
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            className="p-2 rounded-lg border hover:bg-slate-50"
            aria-expanded={open}
            aria-controls={`details-${scheme.id}`}
            title="Toggle details"
          >
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Badges / tags */}
      {tagList.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tagList.map(t => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 border">
              <Info className="w-3 h-3 text-slate-500" aria-hidden="true" />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Key highlights (short description row) */}
      {scheme.description && (
        <p className="mt-3 text-sm line-clamp-3 text-slate-700">{scheme.description}</p>
      )}

      {/* Expandable details */}
      {open && (
        <div id={`details-${scheme.id}`} className="mt-4 space-y-3">
          <fieldset className="border rounded-lg p-3">
            <legend className="text-sm font-medium">Eligibility</legend>
            <p className="text-sm text-slate-700 whitespace-pre-line">{scheme.eligibility || '—'}</p>
          </fieldset>

          <fieldset className="border rounded-lg p-3">
            <legend className="text-sm font-medium">Benefits / Subsidy</legend>
            <p className="text-sm text-slate-700 whitespace-pre-line">{scheme.benefits || '—'}</p>
          </fieldset>

          {/* Links graph hints */}
          <div className="text-xs text-slate-500">
            <LinkIcon className="w-3.5 h-3.5 inline-block mr-1" aria-hidden="true" />
            {scheme._count
              ? `${scheme._count.linksFrom} linkage(s) from this scheme • ${scheme._count.linksTo} linkage(s) to this scheme`
              : 'Linkages available'}
          </div>

          {/* File management */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">Documents</div>
              <label className={`inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md border cursor-pointer ${busy ? 'opacity-60' : 'hover:bg-slate-50'}`}>
                <UploadCloud className="w-4 h-4" aria-hidden="true" />
                <span>Upload</span>
                <input
                  aria-label="Upload document"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={onUpload}
                  disabled={busy}
                />
              </label>
            </div>

            <ul className="mt-2 space-y-1">
              {files.length === 0 && <li className="text-sm text-slate-500">No files yet.</li>}
              {files.map(f => (
                <li key={f.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${f.status === 'Uploaded' ? 'text-emerald-600' : 'text-slate-400'}`} aria-hidden="true" />
                    <span className="truncate" title={f.filename}>{f.filename}</span>
                    <span className="text-xs text-slate-500">• {f.status}</span>
                  </div>
                  <a className="inline-flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-slate-50"
                     href={f.url} target="_blank" rel="noreferrer" aria-label={`Download ${f.filename}`}>
                    <Download className="w-4 h-4" aria-hidden="true" /> Download
                  </a>
                </li>
              ))}
            </ul>

            {/* External docs URL if present */}
            {scheme.documentsUrl && (
              <a
                href={scheme.documentsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
              >
                <Download className="w-4 h-4" aria-hidden />
                Open official circulars/FAQs
              </a>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
