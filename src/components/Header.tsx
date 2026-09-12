import React from 'react';
import { Scale, History, PlusCircle, Sparkles, Share2 } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onExport: () => void;
  savedCount: number;
  hasActiveDecision: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  onExport,
  savedCount,
  hasActiveDecision,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-85"
          role="button"
          tabIndex={0}
          id="brand-logo-button"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-400 shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900">
                The Tiebreaker
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                <Sparkles className="h-3 w-3 text-amber-600" />
                AI Clarity
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Multi-angle decision analysis & objective resolution
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasActiveDecision && (
            <>
              <button
                id="btn-export-decision"
                onClick={onExport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
                title="Export or copy decision summary"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                id="btn-new-decision"
                onClick={onNewDecision}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
              >
                <PlusCircle className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">New Dilemma</span>
              </button>
            </>
          )}

          <button
            id="btn-history-toggle"
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 active:bg-slate-300"
          >
            <History className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
