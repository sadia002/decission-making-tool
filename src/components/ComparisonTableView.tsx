import React, { useState } from 'react';
import { CriterionComparison, DecisionAnalysis } from '../types';
import { Sliders, Plus, Trophy, HelpCircle, Trash2, ArrowUpDown } from 'lucide-react';

interface ComparisonTableViewProps {
  criteria: CriterionComparison[];
  options: DecisionAnalysis['options'];
  onUpdateCriteria: (updated: CriterionComparison[]) => void;
  onUpdateCalculatedWinner: (winnerId: string) => void;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  criteria,
  options,
  onUpdateCriteria,
  onUpdateCalculatedWinner,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newDescription, setNewDescription] = useState('');
  const [newWeight, setNewWeight] = useState(3);
  const [newScores, setNewScores] = useState<Record<string, { score: number; explanation: string }>>({});

  // Compute live weighted totals
  const totalWeightedScores: Record<string, number> = {};
  let maxPossibleScore = 0;

  options.forEach((opt) => {
    totalWeightedScores[opt.id] = 0;
  });

  criteria.forEach((crit) => {
    maxPossibleScore += crit.weight * 10;
    options.forEach((opt) => {
      const scoreObj = crit.scores[opt.id];
      const val = scoreObj ? scoreObj.score : 5;
      totalWeightedScores[opt.id] = (totalWeightedScores[opt.id] || 0) + val * crit.weight;
    });
  });

  // Determine current winner based on weights
  let leadingOptionId = options[0]?.id;
  let highestScore = -1;
  options.forEach((opt) => {
    const score = totalWeightedScores[opt.id] || 0;
    if (score > highestScore) {
      highestScore = score;
      leadingOptionId = opt.id;
    }
  });

  // Inform parent of live calculated winner
  React.useEffect(() => {
    if (leadingOptionId) {
      onUpdateCalculatedWinner(leadingOptionId);
    }
  }, [leadingOptionId, onUpdateCalculatedWinner]);

  const handleWeightChange = (critId: string, newWeightVal: number) => {
    const updated = criteria.map((c) =>
      c.id === critId ? { ...c, weight: newWeightVal } : c
    );
    onUpdateCriteria(updated);
  };

  const handleScoreChange = (critId: string, optionId: string, newScoreVal: number) => {
    const updated = criteria.map((c) => {
      if (c.id !== critId) return c;
      return {
        ...c,
        scores: {
          ...c.scores,
          [optionId]: {
            score: newScoreVal,
            explanation: c.scores[optionId]?.explanation || 'User adjusted score',
          },
        },
      };
    });
    onUpdateCriteria(updated);
  };

  const handleDeleteCriterion = (critId: string) => {
    const updated = criteria.filter((c) => c.id !== critId);
    onUpdateCriteria(updated);
  };

  const handleOpenAddModal = () => {
    const initialScores: Record<string, { score: number; explanation: string }> = {};
    options.forEach((opt) => {
      initialScores[opt.id] = { score: 7, explanation: '' };
    });
    setNewScores(initialScores);
    setNewCriterionName('');
    setNewCategory('Personal');
    setNewDescription('');
    setNewWeight(4);
    setShowAddModal(true);
  };

  const handleAddCriterionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterionName.trim()) return;

    const newCrit: CriterionComparison = {
      id: 'crit-custom-' + Date.now(),
      criterion: newCriterionName.trim(),
      category: newCategory.trim() || 'General',
      weight: newWeight,
      description: newDescription.trim() || 'Custom user evaluation criteria',
      scores: newScores,
    };

    onUpdateCriteria([...criteria, newCrit]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Weighted Scoreboard Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Sliders className="h-3.5 w-3.5 text-slate-700" />
              Interactive Weighted Decision Matrix
            </div>
            <h2 className="mt-1 font-serif text-xl font-bold text-slate-900">
              Side-by-Side Criteria Scoring
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Slide weights (1-5) according to what matters most to your personal life. Scores dynamically rebalance.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5 text-amber-400" />
            Add Custom Criterion
          </button>
        </div>

        {/* Live Leaderboard Meter */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((opt) => {
            const rawScore = totalWeightedScores[opt.id] || 0;
            const percentage = maxPossibleScore > 0 ? Math.round((rawScore / maxPossibleScore) * 100) : 0;
            const isLeader = opt.id === leadingOptionId;

            return (
              <div
                key={opt.id}
                className={`rounded-xl border p-4 transition-all ${
                  isLeader
                    ? 'border-amber-400 bg-amber-50/50 shadow-xs ring-1 ring-amber-300'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 truncate max-w-[150px]">
                    {opt.name}
                  </span>
                  {isLeader && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      <Trophy className="h-3 w-3" />
                      Leading
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-slate-900">
                    {rawScore}
                  </span>
                  <span className="text-xs text-slate-500">
                    / {maxPossibleScore} pts ({percentage}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isLeader ? 'bg-amber-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Criteria Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-slate-700">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider w-[280px]">
                  Criterion & Importance
                </th>
                {options.map((opt) => (
                  <th key={opt.id} className="py-3.5 px-4 font-bold text-slate-900 min-w-[240px]">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm">{opt.name}</span>
                      {opt.id === leadingOptionId && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                          Lead
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="py-3.5 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criteria.map((crit) => (
                <tr key={crit.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Criterion info & weight slider */}
                  <td className="py-4 px-4 align-top">
                    <div className="font-bold text-slate-900 text-sm">
                      {crit.criterion}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {crit.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-600">
                        Weight: {crit.weight}x
                      </span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={crit.weight}
                        onChange={(e) => handleWeightChange(crit.id, Number(e.target.value))}
                        className="h-1.5 w-24 accent-slate-900 cursor-pointer"
                        title="Adjust importance weight (1 to 5)"
                      />
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                        {crit.category}
                      </span>
                    </div>
                  </td>

                  {/* Option score columns */}
                  {options.map((opt) => {
                    const scoreObj = crit.scores[opt.id] || { score: 5, explanation: '' };
                    const isWinningCell =
                      options.every(
                        (other) =>
                          other.id === opt.id ||
                          scoreObj.score > (crit.scores[other.id]?.score || 0)
                      );

                    return (
                      <td key={opt.id} className="py-4 px-4 align-top">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                                scoreObj.score >= 8
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : scoreObj.score >= 5
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-rose-100 text-rose-900'
                              }`}
                            >
                              {scoreObj.score}
                            </span>
                            <span className="text-[11px] text-slate-400">/10</span>
                          </div>

                          {/* Quick score bump */}
                          <div className="flex items-center gap-1">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={scoreObj.score}
                              onChange={(e) =>
                                handleScoreChange(crit.id, opt.id, Number(e.target.value))
                              }
                              className="h-1.5 w-16 accent-slate-900 cursor-pointer"
                              title="Adjust score rating"
                            />
                          </div>
                        </div>

                        {scoreObj.explanation && (
                          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            {scoreObj.explanation}
                          </p>
                        )}
                      </td>
                    );
                  })}

                  {/* Delete row */}
                  <td className="py-4 px-3 align-top text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteCriterion(crit.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                      title="Remove criterion"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding custom criterion */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Add Custom Evaluation Criterion
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Introduce a dimension that matters specifically to your situation.
            </p>

            <form onSubmit={handleAddCriterionSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Criterion Name
                </label>
                <input
                  type="text"
                  value={newCriterionName}
                  onChange={(e) => setNewCriterionName(e.target.value)}
                  placeholder="e.g. Commute Time, Ethical Alignment, Relocation Friction"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-slate-900"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Importance Weight (1 to 5)
                  </label>
                  <select
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value="5">5x - Critical Must-Have</option>
                    <option value="4">4x - High Importance</option>
                    <option value="3">3x - Moderate Factor</option>
                    <option value="2">2x - Minor Tiebreaker</option>
                    <option value="1">1x - Slight Preference</option>
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
                    placeholder="e.g. Lifestyle, Financial"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Daily round-trip transit time and mental cost"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900"
                />
              </div>

              {/* Initial scores for options */}
              <div className="border-t border-slate-100 pt-3">
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  Initial Scores (1-10) for Options:
                </span>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-700 w-36 truncate">
                        {opt.name}:
                      </span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newScores[opt.id]?.score || 5}
                        onChange={(e) =>
                          setNewScores({
                            ...newScores,
                            [opt.id]: {
                              score: Number(e.target.value),
                              explanation: newScores[opt.id]?.explanation || '',
                            },
                          })
                        }
                        className="h-1.5 flex-1 accent-slate-900"
                      />
                      <span className="text-xs font-bold text-slate-900 w-8 text-right">
                        {newScores[opt.id]?.score || 5}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Add to Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
