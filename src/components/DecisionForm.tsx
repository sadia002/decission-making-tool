import React, { useState } from 'react';
import { Sparkles, Plus, X, ChevronDown, ChevronUp, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react';
import { SAMPLE_DECISION_JOB, SAMPLE_DECISION_HOUSING } from '../data/sampleDecisions';
import { DecisionAnalysis } from '../types';

interface DecisionFormProps {
  onAnalyze: (decision: string, options: string[], context: string) => Promise<void>;
  onLoadSample: (sample: DecisionAnalysis) => void;
  isLoading: boolean;
}

const PRESET_DILEMMAS = [
  {
    label: '💼 Corporate vs. Startup',
    decision: 'Should I take a higher-paying corporate role or join an early-stage venture-backed startup?',
    context: 'Looking for long-term growth and technical autonomy, but want to maintain reasonable work-life balance.',
    options: ['Corporate Senior Role', 'Early-Stage AI Startup'],
  },
  {
    label: '🏡 Buy vs. Rent',
    decision: 'Should we buy a suburban townhouse or keep renting downtown and invest our savings in index funds?',
    context: 'Young couple, thinking about starting a family in 2 years, currently in a high interest rate market.',
    options: ['Buy Suburban Townhouse', 'Rent Downtown & Invest in S&P 500'],
  },
  {
    label: '🎓 Grad School vs. Stay in Industry',
    decision: 'Should I leave my job to pursue a full-time Master\'s degree or continue advancing in industry?',
    context: 'Mid-level specialist; tuition is $70k; goal is transitioning into higher-level executive strategy.',
    options: ['Full-Time Master\'s Degree', 'Stay in Industry & Self-Study'],
  },
  {
    label: '🌍 Relocate to New City vs. Stay',
    decision: 'Should I relocate across the country for a fresh start or stay close to my current community and network?',
    context: 'Feeling slightly stagnant in current city, but have close lifelong friends and low cost of living here.',
    options: ['Relocate to New City', 'Stay & Invest in Local Community'],
  },
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onAnalyze,
  onLoadSample,
  isLoading,
}) => {
  const [decision, setDecision] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [showOptionsConfig, setShowOptionsConfig] = useState(false);
  const [showContextConfig, setShowContextConfig] = useState(false);

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || isLoading) return;
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    onAnalyze(decision.trim(), cleanOptions, context.trim());
  };

  const handleSelectPreset = (preset: typeof PRESET_DILEMMAS[0]) => {
    setDecision(preset.decision);
    setOptions(preset.options);
    setContext(preset.context);
    setShowOptionsConfig(true);
    setShowContextConfig(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Intro hero copy */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200/60 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          Rigorous Decision Intelligence
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Break through decision paralysis.
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Frame your dilemma. The Tiebreaker runs full-spectrum evaluations through 
          <span className="font-semibold text-slate-800"> Pros & Cons</span>, 
          <span className="font-semibold text-slate-800"> Comparative Matrixes</span>, and 
          <span className="font-semibold text-slate-800"> Strategic SWOT</span> to reveal the clearest path forward.
        </p>
      </div>

      {/* Main input card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main prompt input */}
          <div>
            <label
              htmlFor="decision-input"
              className="block font-serif text-lg font-semibold text-slate-900 mb-2"
            >
              What is the decision you need to make?
            </label>
            <div className="relative">
              <textarea
                id="decision-input"
                rows={3}
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="e.g. Should I accept the senior role at a Fortune 500 company or become the early lead at a Series-A AI startup?"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 sm:text-base transition-colors resize-none leading-relaxed"
                required
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              Be as specific as you like. You can describe two alternatives or simply explain your dilemma.
            </p>
          </div>

          {/* Quick preset selector */}
          <div>
            <span className="block text-xs font-medium text-slate-600 mb-2 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              Or try one of these classic dilemmas:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_DILEMMAS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options Collapsible */}
          <div className="border-t border-slate-100 pt-4">
            <button
              type="button"
              id="toggle-options-section"
              onClick={() => setShowOptionsConfig(!showOptionsConfig)}
              className="flex w-full items-center justify-between py-1 text-left text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {options.filter((o) => o.trim()).length || 2}
                </span>
                Specific Options (Optional)
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                {showOptionsConfig ? 'Collapse' : 'Specify alternatives'}
                {showOptionsConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </button>

            {showOptionsConfig && (
              <div className="mt-3 space-y-3 pl-1">
                <p className="text-xs text-slate-500">
                  Leave blank if you want AI to automatically extract the contrasting options from your dilemma.
                </p>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">
                      #{index + 1}
                    </span>
                    <input
                      type="text"
                      id={`option-input-${index}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1} (e.g. ${
                        index === 0 ? 'Accept the corporate job' : 'Join the seed startup'
                      })`}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        title="Remove option"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                {options.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Another Option
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Context & Priorities Collapsible */}
          <div className="border-t border-slate-100 pt-4">
            <button
              type="button"
              id="toggle-context-section"
              onClick={() => setShowContextConfig(!showContextConfig)}
              className="flex w-full items-center justify-between py-1 text-left text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              <span>Personal Priorities, Values & Constraints (Optional)</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                {showContextConfig ? 'Collapse' : 'Add context'}
                {showContextConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </button>

            {showContextConfig && (
              <div className="mt-3 pl-1">
                <textarea
                  id="context-input"
                  rows={2}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. What matters most to you? Financial safety, work-life balance, risk tolerance, timeline, dependents, or ethical values?"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-submit-analyze"
              disabled={!decision.trim() || isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Multi-Angle Analysis...</span>
                </>
              ) : (
                <>
                  <span>Break the Tie</span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Pre-loaded full demo cases */}
      <div className="mt-8 rounded-xl border border-slate-200/60 bg-white/60 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Instant Preview Examples
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Explore fully formulated sample analyses with live weights, SWOT, and tiebreaker breakdowns:
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              id="btn-sample-job"
              onClick={() => onLoadSample(SAMPLE_DECISION_JOB)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors"
            >
              💼 Career Dilemma
            </button>
            <button
              type="button"
              id="btn-sample-housing"
              onClick={() => onLoadSample(SAMPLE_DECISION_HOUSING)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors"
            >
              🏡 Buy vs. Rent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
