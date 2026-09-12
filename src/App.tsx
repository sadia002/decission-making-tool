import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotView } from './components/SwotView';
import { VerdictView } from './components/VerdictView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';
import { DecisionAnalysis, ActiveTab } from './types';
import { SAMPLE_DECISION_JOB } from './data/sampleDecisions';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Columns, 
  Table2, 
  Grid2X2, 
  Award, 
  LayoutDashboard,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_saved_v1';

export default function App() {
  const [activeDecision, setActiveDecision] = useState<DecisionAnalysis | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [calculatedWinnerId, setCalculatedWinnerId] = useState<string | undefined>();

  // Load saved decisions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedDecisions(parsed);
          // Auto-load most recent decision if available
          setActiveDecision(parsed[0]);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load decisions from localStorage:', e);
    }

    // Default to the rich sample decision so the user immediately sees a working, complete app
    setActiveDecision(SAMPLE_DECISION_JOB);
    setSavedDecisions([SAMPLE_DECISION_JOB]);
  }, []);

  // Save decisions to localStorage
  const saveToStorage = (updatedList: DecisionAnalysis[]) => {
    setSavedDecisions(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to persist to localStorage:', e);
    }
  };

  // Handle new analysis request to backend Gemini API
  const handleAnalyze = async (decision: string, options: string[], context: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, options, context }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with code ${res.status}`);
      }

      const newAnalysis: DecisionAnalysis = await res.json();
      setActiveDecision(newAnalysis);
      setActiveTab('overview');

      // Add to saved list
      const updatedList = [newAnalysis, ...savedDecisions.filter((d) => d.id !== newAnalysis.id)];
      saveToStorage(updatedList);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(
        err.message || 'An unexpected error occurred while analyzing your decision. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = (sample: DecisionAnalysis) => {
    setActiveDecision(sample);
    setActiveTab('overview');
    if (!savedDecisions.some((d) => d.id === sample.id)) {
      saveToStorage([sample, ...savedDecisions]);
    }
  };

  const handleUpdateProsCons = (updatedProsCons: DecisionAnalysis['prosCons']) => {
    if (!activeDecision) return;
    const updated = { ...activeDecision, prosCons: updatedProsCons };
    setActiveDecision(updated);
    saveToStorage(savedDecisions.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleUpdateCriteria = (updatedCriteria: DecisionAnalysis['comparisonTable']) => {
    if (!activeDecision) return;
    const updated = { ...activeDecision, comparisonTable: updatedCriteria };
    setActiveDecision(updated);
    saveToStorage(savedDecisions.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleUpdateSwot = (updatedSwot: DecisionAnalysis['swotAnalysis']) => {
    if (!activeDecision) return;
    const updated = { ...activeDecision, swotAnalysis: updatedSwot };
    setActiveDecision(updated);
    saveToStorage(savedDecisions.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDeleteDecision = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedDecisions.filter((d) => d.id !== id);
    saveToStorage(updated);
    if (activeDecision?.id === id) {
      setActiveDecision(updated[0] || null);
    }
  };

  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Executive Summary', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'proscons', label: 'Pros & Cons', icon: <Columns className="h-4 w-4" /> },
    { id: 'comparison', label: 'Comparison Matrix', icon: <Table2 className="h-4 w-4" /> },
    { id: 'swot', label: 'SWOT Analysis', icon: <Grid2X2 className="h-4 w-4" /> },
    { id: 'verdict', label: 'The Tiebreaker', icon: <Award className="h-4 w-4 text-amber-500" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans selection:bg-amber-200">
      {/* Header */}
      <Header
        onNewDecision={() => {
          setActiveDecision(null);
          setError(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExport={() => setIsExportOpen(true)}
        savedCount={savedDecisions.length}
        hasActiveDecision={Boolean(activeDecision)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* Error notification */}
        {error && (
          <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6">
            <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-4 font-bold text-rose-600 hover:text-rose-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!activeDecision ? (
          /* Form Screen */
          <DecisionForm
            onAnalyze={handleAnalyze}
            onLoadSample={handleLoadSample}
            isLoading={isLoading}
          />
        ) : (
          /* Active Analysis Dashboard */
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Top Navigation Tabs */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
              <nav className="flex flex-wrap items-center gap-1.5" aria-label="Analysis Tabs">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => setActiveDecision(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                <span>New Question</span>
              </button>
            </div>

            {/* Tab Views with Animated Transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + activeDecision.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === 'overview' && (
                  <ExecutiveSummary
                    analysis={activeDecision}
                    onNavigateTab={setActiveTab}
                    calculatedWinnerId={calculatedWinnerId}
                  />
                )}

                {activeTab === 'proscons' && (
                  <ProsConsView
                    data={activeDecision.prosCons}
                    onUpdateProsCons={handleUpdateProsCons}
                  />
                )}

                {activeTab === 'comparison' && (
                  <ComparisonTableView
                    criteria={activeDecision.comparisonTable}
                    options={activeDecision.options}
                    onUpdateCriteria={handleUpdateCriteria}
                    onUpdateCalculatedWinner={setCalculatedWinnerId}
                  />
                )}

                {activeTab === 'swot' && (
                  <SwotView
                    swotData={activeDecision.swotAnalysis}
                    onUpdateSwot={handleUpdateSwot}
                  />
                )}

                {activeTab === 'verdict' && (
                  <VerdictView
                    verdict={activeDecision.verdict}
                    onNavigateTab={setActiveTab}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={(d) => {
          setActiveDecision(d);
          setActiveTab('overview');
        }}
        onDeleteDecision={handleDeleteDecision}
      />

      {/* Export Modal */}
      {activeDecision && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          analysis={activeDecision}
        />
      )}
    </div>
  );
}
