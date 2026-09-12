export type ImpactLevel = 'high' | 'medium' | 'low';

export interface ProConItem {
  id: string;
  text: string;
  impact: ImpactLevel;
  category: string;
}

export interface OptionProsCons {
  optionId: string;
  optionName: string;
  tagline: string;
  pros: ProConItem[];
  cons: ProConItem[];
}

export interface CriterionComparison {
  id: string;
  criterion: string;
  category: string;
  weight: number; // 1 to 5
  description: string;
  scores: Record<string, {
    score: number; // 1 to 10
    explanation: string;
  }>;
}

export interface SWOTData {
  optionId: string;
  optionName: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PriorityBranch {
  priority: string;
  recommendedOptionId: string;
  recommendedOptionName: string;
  rationale: string;
}

export interface TiebreakerVerdict {
  recommendation: string;
  confidence: 'strong' | 'moderate' | 'nuanced';
  primaryWinnerId: string;
  primaryWinnerName: string;
  summaryRationale: string;
  priorityBranches: PriorityBranch[];
  hiddenBlindspots: string[];
  immediateNextSteps: string[];
  gutCheckQuestion: string;
}

export interface DecisionAnalysis {
  id: string;
  createdAt: string;
  decisionQuestion: string;
  userContext?: string;
  options: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  prosCons: OptionProsCons[];
  comparisonTable: CriterionComparison[];
  swotAnalysis: SWOTData[];
  verdict: TiebreakerVerdict;
}

export interface SavedDecisionMeta {
  id: string;
  title: string;
  createdAt: string;
  optionsCount: number;
  winnerName?: string;
}

export type ActiveTab = 'overview' | 'proscons' | 'comparison' | 'swot' | 'verdict';
