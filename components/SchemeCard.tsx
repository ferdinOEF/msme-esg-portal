'use client';

import { useState } from "react";
import { Download, Upload, Star, CheckCircle, ChevronDown, ChevronUp, Calendar, Building2 } from "lucide-react";
import type { SchemeWithRelations, ApplicationStatus } from "@/lib/types";

type SchemeCardProps = {
  scheme: SchemeWithRelations;
  userId?: string;
  onStatusChange?: (schemeId: string, status: ApplicationStatus, isFavorite?: boolean) => void;
};

export default function SchemeCard({ scheme, userId, onStatusChange }: SchemeCardProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const userScheme = scheme.userSchemes?.[0];
  const isFavorite = userScheme?.isFavorite || false;
  const status = userScheme?.status || 'INTERESTED';
  const hasFiles = (scheme.files?.length || 0) > 0;

  const handleStatusChange = async (newStatus: ApplicationStatus, newFavorite?: boolean) => {
    if (!userId || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/user-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          schemeId: scheme.id,
          status: newStatus,
          isFavorite: newFavorite ?? isFavorite,
        }),
      });

      if (response.ok) {
        onStatusChange?.(scheme.id, newStatus, newFavorite ?? isFavorite);
      }
    } catch (error) {
      console.error('Failed to update scheme status:', error);
    } finally {
      setLoading(false);
    }
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // TODO: Implement file upload to API
      alert(`Selected ${e.target.files[0].name} for upload (demo placeholder).`);
      e.target.value = "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-50 border-green-300 text-green-800';
      case 'APPLIED': return 'bg-blue-50 border-blue-300 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'INTERESTED': return 'bg-gray-50 border-gray-300 text-gray-800';
      default: return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <div>
              <div className="text-base font-semibold">
                {scheme.name}{" "}
                {scheme.shortCode ? (
                  <span className="text-slate-500">({scheme.shortCode})</span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Building2 size={12} />
                  {scheme.type} • {scheme.authority}
                </span>
                {scheme.jurisdiction && (
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full">
                    {scheme.jurisdiction}
                  </span>
                )}
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityColor(scheme.priority)}`}>
              {scheme.priority}
            </span>
          </div>

          {scheme.pillar && (
            <div className="mt-2 flex flex-wrap gap-1">
              {scheme.pillar.split(',').map((pillar) => (
                <span
                  key={pillar}
                  className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200"
                >
                  {pillar.trim()}
                </span>
              ))}
            </div>
          )}

          {scheme.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {scheme.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .slice(0, 4)
                .map((t) => (
                  <span
                    key={t}
                    className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
            </div>
          )}
        </div>

        {userId && (
          <div className="flex flex-col gap-2">
            <button
              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
                isFavorite ? "bg-yellow-50 border-yellow-300 text-yellow-800" : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => handleStatusChange(status, !isFavorite)}
              disabled={loading}
              title="Toggle favorite"
            >
              <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            
            <div className={`text-xs px-2 py-1 rounded border ${getStatusColor(status)}`}>
              {status.replace('_', ' ')}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-sm text-slate-700 line-clamp-2">
        {scheme.description}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={scheme.documentsUrl || "#"}
          target={scheme.documentsUrl ? "_blank" : undefined}
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
            scheme.documentsUrl 
              ? "hover:bg-slate-50 text-slate-700" 
              : "opacity-60 pointer-events-none text-slate-400"
          }`}
          title={scheme.documentsUrl ? "View official documents" : "No documents available"}
        >
          <Download size={14} />
          Official docs
        </a>

        {hasFiles && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle size={14} />
            {scheme.files?.length} files
          </span>
        )}

        <label className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border cursor-pointer hover:bg-slate-50 transition-colors">
          <Upload size={14} />
          Upload
          <input type="file" className="hidden" onChange={onUpload} />
        </label>

        <button
          className="ml-auto inline-flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-slate-50 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {open ? "Less" : "More"}
        </button>
      </div>

      {userId && (
        <div className="mt-3 flex gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
            disabled={loading}
            className="text-xs border rounded px-2 py-1 bg-white"
          >
            <option value="INTERESTED">Interested</option>
            <option value="APPLIED">Applied</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      )}

      {open && (
        <div className="mt-3 space-y-3 text-sm border-t pt-3">
          {scheme.eligibility && (
            <div>
              <span className="font-medium text-slate-900">Eligibility:</span>
              <p className="text-slate-700 mt-1">{scheme.eligibility}</p>
            </div>
          )}
          {scheme.benefits && (
            <div>
              <span className="font-medium text-slate-900">Benefits:</span>
              <p className="text-slate-700 mt-1">{scheme.benefits}</p>
            </div>
          )}
          {userScheme?.appliedAt && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar size={12} />
              Applied: {new Date(userScheme.appliedAt).toLocaleDateString()}
            </div>
          )}
          {userScheme?.completedAt && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle size={12} />
              Completed: {new Date(userScheme.completedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}