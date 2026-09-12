import React from 'react';
import { DecisionAnalysis } from '../types';
import { X, Trash2, Calendar, Trophy, ArrowRight, BookOpen } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string, e: React.MouseEvent) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-700" />
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Saved Decisions ({savedDecisions.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedDecisions.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">No saved decisions yet.</p>
              <p className="text-xs mt-1">
                Decisions you analyze are automatically stored in your local session.
              </p>
            </div>
          ) : (
            savedDecisions.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectDecision(item);
                  onClose();
                }}
                className="group relative cursor-pointer rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-400 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={(e) => onDeleteDecision(item.id, e)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Delete decision"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h3 className="mt-2 font-serif text-sm font-bold text-slate-900 line-clamp-2">
                  {item.decisionQuestion}
                </h3>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                      {item.verdict.primaryWinnerName}
                    </span>
                  </div>
                  <span className="inline-flex items-center text-slate-400 group-hover:text-slate-900 font-semibold">
                    Open <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
