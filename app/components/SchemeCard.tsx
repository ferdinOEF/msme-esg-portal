$SchemeCard = @'
"use client";

import { useState } from "react";
import { Download, Upload, Star, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

type Scheme = {
  id: string;
  name: string;
  shortCode?: string | null;
  type: string;
  authority: string;
  pillar?: string | null;
  description: string;
  benefits?: string | null;
  eligibility?: string | null;
  documentsUrl?: string | null;
  tags?: string | null; // comma-joined
};

export default function SchemeCard({ scheme }: { scheme: Scheme }) {
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const [applied, setApplied] = useState(false);
  const hasDocs = !!scheme.documentsUrl;

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: wire to API route / storage
    if (e.target.files && e.target.files.length > 0) {
      alert(`Selected ${e.target.files[0].name} for upload (demo placeholder).`);
      e.target.value = "";
    }
  };

  return (
    <div className="rounded-xl border p-4 shadow-sm hover:shadow transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold">
            {scheme.name}{" "}
            {scheme.shortCode ? (
              <span className="text-slate-500">({scheme.shortCode})</span>
            ) : null}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {scheme.type} • {scheme.authority} {scheme.pillar ? `• ${scheme.pillar}` : ""}
          </div>
          {scheme.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {scheme.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => (
                  <span
                    key={t}
                    className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full"
                    aria-label={`Tag ${t}`}
                  >
                    {t}
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${fav ? "bg-yellow-50 border-yellow-300" : "bg-white"}`}
            onClick={() => setFav((v) => !v)}
            aria-pressed={fav}
            aria-label="Save to favourites"
            title="Save to favourites"
          >
            <Star size={14} /> {fav ? "Favourited" : "Favourite"}
          </button>
          <button
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${applied ? "bg-green-50 border-green-300" : "bg-white"}`}
            onClick={() => setApplied((v) => !v)}
            aria-pressed={applied}
            aria-label="Mark applied"
            title="Mark applied"
          >
            <CheckCircle size={14} /> {applied ? "Applied" : "Mark applied"}
          </button>
        </div>
      </div>

      <div className="mt-3 text-sm text-slate-700 line-clamp-3">
        {scheme.description}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={scheme.documentsUrl || "#"}
          target={scheme.documentsUrl ? "_blank" : undefined}
          aria-disabled={!scheme.documentsUrl}
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${hasDocs ? "hover:bg-slate-50" : "opacity-60 pointer-events-none"}`}
          title={hasDocs ? "Download circulars / FAQs" : "No documents uploaded"}
        >
          <Download size={14} />
          Download docs
          <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded ${hasDocs ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {hasDocs ? "Available" : "Pending"}
          </span>
        </a>

        <label className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border cursor-pointer hover:bg-slate-50" title="Upload supporting document">
          <Upload size={14} />
          Upload support
          <input type="file" className="hidden" onChange={onUpload} aria-label="Upload supporting document" />
        </label>

        <button
          className="ml-auto inline-flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-slate-50"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`scheme-details-${scheme.id}`}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {open ? "Hide details" : "View details"}
        </button>
      </div>

      {open && (
        <div id={`scheme-details-${scheme.id}`} className="mt-3 space-y-2 text-sm">
          <div><span className="font-medium">Eligibility:</span> {scheme.eligibility || "—"}</div>
          <div><span className="font-medium">Benefits:</span> {scheme.benefits || "—"}</div>
          {/* Add other fields like deadlines as you store them */}
        </div>
      )}
    </div>
  );
}
'@
Set-Content -Path "components\SchemeCard.tsx" -Value $SchemeCard -Encoding utf8
