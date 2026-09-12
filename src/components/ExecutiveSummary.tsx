import React from 'react';
import { DecisionAnalysis, ActiveTab } from '../types';
import { Trophy, HelpCircle, CheckCircle2, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

interface ExecutiveSummaryProps {
  analysis: DecisionAnalysis;
  onNavigateTab: (tab: ActiveTab) => void;
  calculatedWinnerId?: string;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  analysis,
  onNavigateTab,
  calculatedWinnerId,
}) => {
  const winnerOption = analysis.options.find(
    (opt) => opt.id === (calculatedWinnerId || analysis.verdict.primaryWinnerId)
  ) || analysis.options[0];

  return (
    <div className="space-y-6">
      {/* Question Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            Decision Under Evaluation
          </span>
          <span className="text-xs text-slate-400">
            {new Date(analysis.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl leading-snug">
          {analysis.decisionQuestion}
        </h1>

        {analysis.userContext && (
          <div className="mt-3 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-100">
            <span className="font-semibold text-slate-800">Your Specified Context: </span>
            {analysis.userContext}
          </div>
        )}

        {/* Options Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analysis.options.map((opt, i) => {
            const isWinner = opt.id === winnerOption?.id;
            return (
              <div
                key={opt.id}
                className={`relative rounded-xl border p-4 transition-all ${
                  isWinner
                    ? 'border-amber-400/80 bg-amber-50/40 ring-1 ring-amber-400/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isWinner && (
                  <div className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <Trophy className="h-3 w-3" />
                    Tiebreaker Lead
                  </div>
                )}
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Option {i + 1}
                </div>
                <div className="mt-1 font-serif text-lg font-bold text-slate-900">
                  {opt.name}
                </div>
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tiebreaker Verdict Highlight Banner */}
      <div className="rounded-2xl border border-slate-900/10 bg-slate-900 p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="h-4 w-4" />
            The Tiebreaker Synthesis
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300 capitalize">
            Confidence: {analysis.verdict.confidence}
          </span>
        </div>

        <p className="mt-4 font-serif text-xl font-bold leading-snug sm:text-2xl text-white">
          "{analysis.verdict.recommendation}"
        </p>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          {analysis.verdict.summaryRationale}
        </p>

        {/* Gut Check callout */}
        <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-amber-400/20 p-1.5 text-amber-400">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                The Mirror Question (Gut-Check)
              </div>
              <div className="mt-1 text-sm font-medium italic text-slate-100">
                "{analysis.verdict.gutCheckQuestion}"
              </div>
            </div>
          </div>
        </div>

        {/* Action jump links */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => onNavigateTab('proscons')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            Inspect Pros & Cons
            <ArrowRight className="h-3 w-3 text-amber-400" />
          </button>
          <button
            onClick={() => onNavigateTab('comparison')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            Adjust Criteria Weights
            <ArrowRight className="h-3 w-3 text-amber-400" />
          </button>
          <button
            onClick={() => onNavigateTab('swot')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            View SWOT Matrix
            <ArrowRight className="h-3 w-3 text-amber-400" />
          </button>
          <button
            onClick={() => onNavigateTab('verdict')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors ml-auto"
          >
            Full Verdict & Blindspots
            <ArrowRight className="h-3 w-3 text-slate-950" />
          </button>
        </div>
      </div>

      {/* Quick 2-Column Peek: Priority Branches & Blindspots */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Priority Branches */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Priority Pathways
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {analysis.verdict.priorityBranches.map((branch, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="text-xs font-semibold text-slate-500">
                  If your #1 priority is:
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  "{branch.priority}"
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <span>↳ Choose:</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5">
                    {branch.recommendedOptionName}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {branch.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Blindspots */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Cognitive Traps & Blindspots
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {analysis.verdict.hiddenBlindspots.map((blindspot, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/40 p-3.5 text-xs text-slate-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/70 text-[10px] font-bold text-amber-900">
                  !
                </span>
                <p className="leading-relaxed">
                  {blindspot}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
