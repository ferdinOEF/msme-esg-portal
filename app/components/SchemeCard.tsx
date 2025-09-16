New-Item -ItemType Directory -Force components | Out-Null
@'
"use client";

import { useState } from "react";
import { Download, Upload, Star, CheckCircle, Clock } from "lucide-react";

export type Scheme = {
  id: string;
  name: string;
  shortCode?: string | null;
  type?: string | null;
  authority?: string | null;
  description?: string | null;
  eligibility?: string | null;
  benefits?: string | null;
  documentsUrl?: string | null;
  tags?: string | null; // CSV in DB
  applied?: boolean;    // optional UI state
  favourite?: boolean;  // optional UI state
};

export default function SchemeCard({ scheme }: { scheme: Scheme }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const tags = (scheme.tags || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("schemeId", scheme.id);

      // Your upload endpoint (implement if not present)
      const res = await fetch("/api/schemes/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      alert("Uploaded!");
    } catch (err: any) {
      alert(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{scheme.name}</h3>
            {scheme.shortCode ? (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 border">
                {scheme.shortCode}
              </span>
            ) : null}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            {(scheme.type || scheme.authority) ? `${scheme.type || ""}${scheme.type && scheme.authority ? " • " : ""}${scheme.authority || ""}` : "—"}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1 text-xs px-2 py-1 border rounded hover:bg-slate-50"
            title="Save to favourites"
          >
            <Star size={14} /> Favourite
          </button>
          <button
            className="inline-flex items-center gap-1 text-xs px-2 py-1 border rounded hover:bg-slate-50"
            title="Mark applied"
          >
            <CheckCircle size={14} /> Applied
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <label className="inline-flex items-center gap-1 text-xs px-2 py-1 border rounded cursor-pointer hover:bg-slate-50">
          <Upload size={14} />
          <input type="file" className="hidden" onChange={onUpload} />
          {uploading ? "Uploading..." : "Upload doc"}
        </label>

        {scheme.documentsUrl ? (
          <a
            href={scheme.documentsUrl}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs px-2 py-1 border rounded hover:bg-slate-50"
          >
            <Download size={14} /> Download circulars/FAQ
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 border rounded text-slate-500">
            <Clock size={14} /> No downloads yet
          </span>
        )}

        <button
          onClick={() => setOpen(v => !v)}
          className="ml-auto text-xs px-2 py-1 border rounded hover:bg-slate-50"
          aria-expanded={open}
          aria-controls={`scheme-details-${scheme.id}`}
        >
          {open ? "Hide details" : "View details"}
        </button>
      </div>

      {open && (
        <div id={`scheme-details-${scheme.id}`} className="mt-4 grid gap-3 text-sm">
          <Section label="Description" value={scheme.description} />
          <Section label="Eligibility" value={scheme.eligibility} />
          <Section label="Benefits" value={scheme.benefits} />
          {/* Add “Deadlines” field in your DB if needed and show here */}
        </div>
      )}
    </div>
  );
}

function Section({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
'@ | Set-Content -NoNewline components/SchemeCard.tsx
s