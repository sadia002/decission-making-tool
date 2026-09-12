import React, { useState } from 'react';
import { SWOTData } from '../types';
import { ShieldCheck, AlertCircle, Compass, Zap, Plus } from 'lucide-react';

interface SwotViewProps {
  swotData: SWOTData[];
  onUpdateSwot: (updated: SWOTData[]) => void;
}

export const SwotView: React.FC<SwotViewProps> = ({ swotData, onUpdateSwot }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    swotData[0]?.optionId || ''
  );
  const [activeQuad, setActiveQuad] = useState<'strengths' | 'weaknesses' | 'opportunities' | 'threats' | null>(null);
  const [newBullet, setNewBullet] = useState('');

  const activeOption =
    swotData.find((s) => s.optionId === selectedOptionId) || swotData[0];

  const handleAddBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBullet.trim() || !activeQuad || !activeOption) return;

    const updated = swotData.map((s) => {
      if (s.optionId !== activeOption.optionId) return s;
      return {
        ...s,
        [activeQuad]: [...s[activeQuad], newBullet.trim()],
      };
    });

    onUpdateSwot(updated);
    setNewBullet('');
    setActiveQuad(null);
  };

  const handleRemoveBullet = (
    quad: 'strengths' | 'weaknesses' | 'opportunities' | 'threats',
    index: number
  ) => {
    if (!activeOption) return;
    const updated = swotData.map((s) => {
      if (s.optionId !== activeOption.optionId) return s;
      return {
        ...s,
        [quad]: s[quad].filter((_, i) => i !== index),
      };
    });
    onUpdateSwot(updated);
  };

  if (!activeOption) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header & Option Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Strategic SWOT Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Distinguish internal capabilities from external opportunities and market/life threats.
          </p>
        </div>

        {/* Option Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          {swotData.map((item) => (
            <button
              key={item.optionId}
              type="button"
              onClick={() => setSelectedOptionId(item.optionId)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                item.optionId === selectedOptionId
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.optionName}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 SWOT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths (Internal Positive) */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Strengths
                  </h3>
                  <span className="text-[10px] text-emerald-700">
                    Internal Advantages & Assets
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuad('strengths')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>

            <ul className="mt-4 space-y-2.5">
              {activeOption.strengths.map((item, idx) => (
                <li
                  key={idx}
                  className="group flex items-start justify-between gap-2 text-xs text-slate-800 leading-relaxed"
                >
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet('strengths', idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 text-[10px] transition-opacity"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Weaknesses (Internal Negative) */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-800">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Weaknesses
                  </h3>
                  <span className="text-[10px] text-rose-700">
                    Internal Limitations & Gaps
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuad('weaknesses')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 hover:underline"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>

            <ul className="mt-4 space-y-2.5">
              {activeOption.weaknesses.map((item, idx) => (
                <li
                  key={idx}
                  className="group flex items-start justify-between gap-2 text-xs text-slate-800 leading-relaxed"
                >
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet('weaknesses', idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 text-[10px] transition-opacity"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Opportunities (External Positive) */}
        <div className="rounded-2xl border border-sky-200/80 bg-sky-50/30 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-sky-200/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900">
                    Opportunities
                  </h3>
                  <span className="text-[10px] text-sky-700">
                    External Upsides & Tailwinds
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuad('opportunities')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 hover:underline"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>

            <ul className="mt-4 space-y-2.5">
              {activeOption.opportunities.map((item, idx) => (
                <li
                  key={idx}
                  className="group flex items-start justify-between gap-2 text-xs text-slate-800 leading-relaxed"
                >
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet('opportunities', idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 text-[10px] transition-opacity"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Threats (External Negative) */}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Threats
                  </h3>
                  <span className="text-[10px] text-amber-700">
                    External Hazards & Headwinds
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuad('threats')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:underline"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>

            <ul className="mt-4 space-y-2.5">
              {activeOption.threats.map((item, idx) => (
                <li
                  key={idx}
                  className="group flex items-start justify-between gap-2 text-xs text-slate-800 leading-relaxed"
                >
                  <div className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet('threats', idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 text-[10px] transition-opacity"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add Bullet Modal */}
      {activeQuad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="font-serif text-lg font-bold text-slate-900 capitalize">
              Add to {activeQuad} ({activeOption.optionName})
            </h3>
            <form onSubmit={handleAddBullet} className="mt-4 space-y-4">
              <textarea
                rows={3}
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                placeholder="Enter your observation or strategic factor..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-slate-900"
                required
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveQuad(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Save Bullet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
