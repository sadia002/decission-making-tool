import React, { useState } from 'react';
import { OptionProsCons, ProConItem, ImpactLevel } from '../types';
import { Plus, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react';

interface ProsConsViewProps {
  data: OptionProsCons[];
  onUpdateProsCons: (updated: OptionProsCons[]) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  data,
  onUpdateProsCons,
}) => {
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [activeModalOptionId, setActiveModalOptionId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'pro' | 'con'>('pro');
  const [newText, setNewText] = useState('');
  const [newImpact, setNewImpact] = useState<ImpactLevel>('high');
  const [newCategory, setNewCategory] = useState('Personal');

  const handleOpenAddModal = (optionId: string, type: 'pro' | 'con') => {
    setActiveModalOptionId(optionId);
    setModalType(type);
    setNewText('');
    setNewImpact('high');
    setNewCategory('Personal');
  };

  const handleSaveCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !activeModalOptionId) return;

    const newItem: ProConItem = {
      id: 'custom-' + Date.now(),
      text: newText.trim(),
      impact: newImpact,
      category: newCategory.trim() || 'Personal',
    };

    const updated = data.map((opt) => {
      if (opt.optionId !== activeModalOptionId) return opt;
      return {
        ...opt,
        pros: modalType === 'pro' ? [...opt.pros, newItem] : opt.pros,
        cons: modalType === 'con' ? [...opt.cons, newItem] : opt.cons,
      };
    });

    onUpdateProsCons(updated);
    setActiveModalOptionId(null);
  };

  const handleDeleteItem = (optionId: string, itemId: string, type: 'pro' | 'con') => {
    const updated = data.map((opt) => {
      if (opt.optionId !== optionId) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? opt.pros.filter((p) => p.id !== itemId) : opt.pros,
        cons: type === 'con' ? opt.cons.filter((c) => c.id !== itemId) : opt.cons,
      };
    });
    onUpdateProsCons(updated);
  };

  const filterItems = (items: ProConItem[]) => {
    if (filterImpact === 'all') return items;
    return items.filter((item) => item.impact === filterImpact);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Pros & Cons Comparative Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            High-contrast advantages and trade-offs side by side. Add your own thoughts or adjust items.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">Impact:</span>
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Impacts</option>
            <option value="high">High Impact Only</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>
        </div>
      </div>

      {/* Grid of Columns (one for each Option) */}
      <div
        className={`grid grid-cols-1 gap-6 ${
          data.length === 2 ? 'lg:grid-cols-2' : data.length >= 3 ? 'lg:grid-cols-3' : ''
        }`}
      >
        {data.map((optGroup) => {
          const displayedPros = filterItems(optGroup.pros);
          const displayedCons = filterItems(optGroup.cons);
          const highImpactPros = optGroup.pros.filter((p) => p.impact === 'high').length;
          const highImpactCons = optGroup.cons.filter((c) => c.impact === 'high').length;

          return (
            <div
              key={optGroup.optionId}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden"
            >
              {/* Option Banner */}
              <div className="border-b border-slate-200 bg-slate-50/90 p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Option Under Review
                </div>
                <h3 className="mt-1 font-serif text-xl font-bold text-slate-900">
                  {optGroup.optionName}
                </h3>
                <p className="mt-1 text-xs text-slate-600 italic">
                  "{optGroup.tagline}"
                </p>

                {/* Score balance meter */}
                <div className="mt-3 flex items-center justify-between rounded-lg bg-white p-2.5 text-xs font-medium text-slate-700 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{optGroup.pros.length} Pros ({highImpactPros} High)</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
                    <XCircle className="h-3.5 w-3.5" />
                    <span>{optGroup.cons.length} Cons ({highImpactCons} High)</span>
                  </div>
                </div>
              </div>

              {/* Content Body: Pros on top, Cons on bottom */}
              <div className="flex-1 p-5 space-y-6 divide-y divide-slate-100">
                {/* Pros Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        +
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Pros & Upsides ({displayedPros.length})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(optGroup.optionId, 'pro')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      Add Pro
                    </button>
                  </div>

                  {displayedPros.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                      No pros match the current filter.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {displayedPros.map((pro) => (
                        <div
                          key={pro.id}
                          className="group relative flex items-start gap-2.5 rounded-xl border border-emerald-100/90 bg-emerald-50/30 p-3 transition-colors hover:bg-emerald-50/60"
                        >
                          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-800 leading-relaxed font-normal">
                              {pro.text}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span
                                className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                                  pro.impact === 'high'
                                    ? 'bg-emerald-200/80 text-emerald-900'
                                    : pro.impact === 'medium'
                                    ? 'bg-slate-200/80 text-slate-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {pro.impact} Impact
                              </span>
                              <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                                {pro.category}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(optGroup.optionId, pro.id, 'pro')}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                            title="Delete item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cons Section */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                        -
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                        Cons & Liabilities ({displayedCons.length})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(optGroup.optionId, 'con')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      Add Con
                    </button>
                  </div>

                  {displayedCons.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                      No cons match the current filter.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {displayedCons.map((con) => (
                        <div
                          key={con.id}
                          className="group relative flex items-start gap-2.5 rounded-xl border border-rose-100/90 bg-rose-50/30 p-3 transition-colors hover:bg-rose-50/60"
                        >
                          <XCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-800 leading-relaxed font-normal">
                              {con.text}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span
                                className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                                  con.impact === 'high'
                                    ? 'bg-rose-200/80 text-rose-900'
                                    : con.impact === 'medium'
                                    ? 'bg-slate-200/80 text-slate-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {con.impact} Impact
                              </span>
                              <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                                {con.category}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(optGroup.optionId, con.id, 'con')}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                            title="Delete item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Adding Custom Pro/Con */}
      {activeModalOptionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Add Custom {modalType === 'pro' ? 'Pro' : 'Con'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add your personal insight or constraint to this option.
            </p>

            <form onSubmit={handleSaveCustomItem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder={`What is the specific ${modalType === 'pro' ? 'benefit' : 'drawback'}?`}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Impact Level
                  </label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value as ImpactLevel)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value="high">High Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="low">Low Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Financial, Family"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalOptionId(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
