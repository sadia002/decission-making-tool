import React, { useState } from 'react';
import { TiebreakerVerdict } from '../types';
import { Sparkles, CheckCircle2, ShieldAlert, ListChecks, HelpCircle, ArrowRight } from 'lucide-react';

interface VerdictViewProps {
  verdict: TiebreakerVerdict;
  onNavigateTab: (tab: any) => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({ verdict, onNavigateTab }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-7">
      {/* Supreme Recommendation Card */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 sm:p-9 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                The Tiebreaker Final Recommendation
              </span>
              <div className="text-[11px] text-slate-400">
                Unbiased objective synthesis
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300 capitalize">
              Confidence: {verdict.confidence}
            </span>
            <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950">
              Lead: {verdict.primaryWinnerName}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl leading-snug">
            "{verdict.recommendation}"
          </h2>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-3xl">
            {verdict.summaryRationale}
          </p>
        </div>

        {/* The Mirror Gut-Check Question */}
        <div className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 sm:p-6 backdrop-blur-xs">
          <div className="flex items-start gap-3.5">
            <div className="rounded-xl bg-amber-400 p-2 text-slate-950 shrink-0">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                The Mirror Question (Gut-Check)
              </h3>
              <p className="mt-1 font-serif text-lg font-medium text-slate-100 italic leading-relaxed sm:text-xl">
                "{verdict.gutCheckQuestion}"
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Notice which option your nervous system instinctively defends when reading this question.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Branches (Conditional Paths) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Decision Branches
          </div>
          <h3 className="mt-1 font-serif text-xl font-bold text-slate-900">
            "If Your Priority Is..." Scenario Mapping
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Decisions rarely have a single universal answer. Align your choice to your genuine priority.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {verdict.priorityBranches.map((branch, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:bg-slate-50"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Priority Profile #{i + 1}
                </div>
                <div className="mt-1 font-serif text-base font-bold text-slate-900">
                  {branch.priority}
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {branch.rationale}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Recommended Choice:
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-900">
                  {branch.recommendedOptionName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Grid: Blindspots & Action Checklist */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Hidden Traps & Blindspots */}
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/20 p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-amber-200/60 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Cognitive Traps & Blindspots
              </h3>
              <span className="text-[10px] text-amber-700">
                Subtle biases that lead to post-decision regret
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {verdict.hiddenBlindspots.map((blindspot, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-amber-200/70 bg-white p-3.5 shadow-2xs"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {blindspot}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 48-Hour Action Plan (Interactive) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                <ListChecks className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  48-Hour De-Risking Checklist
                </h3>
                <span className="text-[10px] text-slate-500">
                  Low-friction steps to validate before taking the leap
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {Object.values(completedSteps).filter(Boolean).length}/
              {verdict.immediateNextSteps.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {verdict.immediateNextSteps.map((step, i) => {
              const isDone = completedSteps[i] || false;
              return (
                <div
                  key={i}
                  onClick={() => toggleStep(i)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/40 opacity-75'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleStep(i)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <span
                    className={`text-xs leading-relaxed ${
                      isDone ? 'line-through text-slate-500' : 'text-slate-800 font-medium'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
