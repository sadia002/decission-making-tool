import { DecisionAnalysis } from '../types';

export const SAMPLE_DECISION_JOB: DecisionAnalysis = {
  id: 'sample-job-offer',
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  decisionQuestion: 'Should I accept a high-paying Corporate Senior role or join a Series-A AI Startup as an early engineering lead?',
  userContext: 'Mid-career software engineer with 6 years experience, saving for a home down-payment, but eager to build 0-to-1 products and avoid corporate politics.',
  options: [
    {
      id: 'opt-corp',
      name: 'Corporate Senior Role (FinTech)',
      description: '$210k base + $50k bonus + public RSUs. Established 40-hour work week, matrixed management, predictable cadence.',
    },
    {
      id: 'opt-startup',
      name: 'Series-A AI Startup (Founding Lead)',
      description: '$165k base + 1.2% equity vesting over 4 years. Fast-moving team of 14, high autonomy, 50-55 hour weeks.',
    },
  ],
  prosCons: [
    {
      optionId: 'opt-corp',
      optionName: 'Corporate Senior Role',
      tagline: 'Predictable wealth building and psychological stability',
      pros: [
        { id: 'p1', text: '$260k+ total guaranteed compensation accelerates home purchase by 2-3 years.', impact: 'high', category: 'Financial' },
        { id: 'p2', text: 'Firm boundary between work and personal life with generous PTO and benefits.', impact: 'high', category: 'Lifestyle' },
        { id: 'p3', text: 'Respected institutional brand name on resume that opens doors for future corporate leadership.', impact: 'medium', category: 'Career' },
        { id: 'p4', text: 'Minimal existential stress; company solvency is not in question.', impact: 'medium', category: 'Risk' },
      ],
      cons: [
        { id: 'c1', text: 'Heavy bureaucratic overhead, quarterly reviews, and slower decision velocity.', impact: 'high', category: 'Culture' },
        { id: 'c2', text: 'Narrower scope of technical ownership; mostly maintaining or extending existing services.', impact: 'medium', category: 'Growth' },
        { id: 'c3', text: 'Risk of career inertia and complacency after 18-24 months.', impact: 'medium', category: 'Career' },
      ],
    },
    {
      optionId: 'opt-startup',
      optionName: 'Series-A AI Startup',
      tagline: 'High-autonomy springboard with venture-scale upside',
      pros: [
        { id: 'p5', text: 'Tremendous 0-to-1 architectural ownership and rapid technical decision-making.', impact: 'high', category: 'Growth' },
        { id: 'p6', text: '1.2% equity provides life-changing upside if company reaches $100M+ valuation.', impact: 'high', category: 'Financial' },
        { id: 'p7', text: 'Direct mentorship and daily proximity to founders and top-tier AI investors.', impact: 'medium', category: 'Network' },
        { id: 'p8', text: 'Steep learning curve accelerates skills by 3x compared to a typical corporate pace.', impact: 'high', category: 'Career' },
      ],
      cons: [
        { id: 'c4', text: '$45k base salary drop directly delays home down payment timeline.', impact: 'high', category: 'Financial' },
        { id: 'c5', text: 'High risk of pivot or failure within 24 months if Series B market tightens.', impact: 'high', category: 'Risk' },
        { id: 'c6', text: 'Irregular hours, on-call firefighting, and potential burnout periods during sprint cycles.', impact: 'medium', category: 'Lifestyle' },
      ],
    },
  ],
  comparisonTable: [
    {
      id: 'crit-fin',
      criterion: 'Near-Term Financial Security',
      category: 'Financial',
      weight: 5,
      description: 'Guaranteed liquidity and certainty for near-term life goals (down-payment).',
      scores: {
        'opt-corp': { score: 9, explanation: '$260k total comp with liquid public equity provides immediate cash accumulation.' },
        'opt-startup': { score: 4, explanation: 'Lower cash base and illiquid paper equity that may take 5-7 years to realize.' },
      },
    },
    {
      id: 'crit-growth',
      criterion: 'Career Acceleration & Autonomy',
      category: 'Career',
      weight: 4,
      description: 'Breadth of influence, speed of skill acquisition, and technical leadership.',
      scores: {
        'opt-corp': { score: 5, explanation: 'Specialized domain scope inside an established engineering org of 300+.' },
        'opt-startup': { score: 10, explanation: 'Founding-tier role dictating architecture, hiring, and product roadmap.' },
      },
    },
    {
      id: 'crit-wlb',
      criterion: 'Work-Life Harmony & Energy',
      category: 'Lifestyle',
      weight: 4,
      description: 'Sustainable hours, predictable weekends, and mental bandwidth outside work.',
      scores: {
        'opt-corp': { score: 8, explanation: 'Standard 40 hrs, established on-call rotations, generous personal leave.' },
        'opt-startup': { score: 4, explanation: 'Startup velocity demands irregular hours and emotional investment.' },
      },
    },
    {
      id: 'crit-upside',
      criterion: 'Long-Term Wealth Asymmetry',
      category: 'Financial',
      weight: 3,
      description: 'Potential for extraordinary financial returns beyond linear compensation.',
      scores: {
        'opt-corp': { score: 6, explanation: 'Steady public equity appreciation, but ceiling is bounded.' },
        'opt-startup': { score: 9, explanation: 'Significant 1.2% stake in a hot sector with 10x-50x multiplier potential.' },
      },
    },
    {
      id: 'crit-reversibility',
      criterion: 'Decision Reversibility',
      category: 'Strategy',
      weight: 3,
      description: 'How easy is it to pivot or return if things do not work out in 12-18 months?',
      scores: {
        'opt-corp': { score: 6, explanation: 'Comfortable golden handcuffs can make leaving difficult psychologically.' },
        'opt-startup': { score: 9, explanation: 'Big tech will always re-hire high-performing engineers who spent time leading a startup.' },
      },
    },
  ],
  swotAnalysis: [
    {
      optionId: 'opt-corp',
      optionName: 'Corporate Senior Role',
      strengths: [
        'Guaranteed high cash liquidity ($260k total target)',
        'Predictable working cadence with minimal emergency fires',
        'Abundant tooling, internal infrastructure, and support teams',
      ],
      weaknesses: [
        'Prolonged consensus-driven decision cycles',
        'Limited direct product influence or company-level strategy exposure',
        'Vulnerability to broad corporate reorganizations',
      ],
      opportunities: [
        'Fast-track to Engineering Manager or Staff IC track in 2 years',
        'Opportunity to amass a solid 6-figure home down payment fund',
        'Internal mobility across international offices or subsidiaries',
      ],
      threats: [
        'Skill atrophy due to proprietary internal tech stack',
        'Risk of corporate inertia and loss of competitive 0-to-1 drive',
        'Layoffs during economic restructuring in tech sector',
      ],
    },
    {
      optionId: 'opt-startup',
      optionName: 'Series-A AI Startup',
      strengths: [
        'Direct architect of core customer-facing AI pipelines',
        'Small, elite team with zero administrative friction',
        'Venture-backed by tier-1 funds with 22 months of cash runway',
      ],
      weaknesses: [
        'Lower immediate cash compensation ($165k vs $260k)',
        'Lack of established CI/CD, documentation, and product structure',
        'Constant context-switching between code, hiring, and customer calls',
      ],
      opportunities: [
        'Becoming VP of Engineering or CTO as company scales from 14 to 100',
        'Acquiring frontier generative AI engineering leadership credentials',
        'Life-changing liquidity event upon secondary sale or acquisition',
      ],
      threats: [
        'Downside dilution or total shutdown if product-market fit falters',
        'Prolonged stress leading to physical and mental fatigue',
        'Investor pressure to shift focus away from foundational tech quality',
      ],
    },
  ],
  verdict: {
    recommendation: 'Choose the Corporate Senior Role if your 18-month priority is personal financial stability (home purchase), OR choose the Series-A Startup if your 5-year priority is transforming your career trajectory into executive leadership.',
    confidence: 'nuanced',
    primaryWinnerId: 'opt-startup',
    primaryWinnerName: 'Series-A AI Startup (Conditional Win)',
    summaryRationale: 'While the corporate compensation is enticing, you are at the exact career inflection point (6 years experience, mid-career) where the asymmetric upside of founding leadership, equity exposure, and cutting-edge technical ownership outweighs incremental base salary. Furthermore, this decision is highly reversible: corporate doors remain wide open if you spend 18 months spearheading an AI startup.',
    priorityBranches: [
      {
        priority: 'Buying a home within 18 months without financial stress',
        recommendedOptionId: 'opt-corp',
        recommendedOptionName: 'Corporate Senior Role',
        rationale: 'The $95k annual pre-tax compensation difference and guaranteed liquidity eliminate down-payment anxiety.',
      },
      {
        priority: 'Maximizing career growth, technical leadership, and 5-year autonomy',
        recommendedOptionId: 'opt-startup',
        recommendedOptionName: 'Series-A AI Startup',
        rationale: 'You will compress 4 years of engineering leadership learning into 12 months with equity upside.',
      },
      {
        priority: 'Protecting mental energy and family/relationship commitments',
        recommendedOptionId: 'opt-corp',
        recommendedOptionName: 'Corporate Senior Role',
        rationale: 'Startup timelines are inherently unpredictable; corporate boundaries protect work-life balance.',
      },
    ],
    hiddenBlindspots: [
      'The "Golden Handcuffs" illusion: Corporate compensation feels like security, but staying 3 years in a bureaucratic role can subtly erode your appetite for high-stakes problem solving.',
      'Startup Equity Illiquidity: Treat startup equity as a potential lottery ticket, not guaranteed savings. If you cannot afford the $165k lifestyle, the stress will bleed into your work.',
      'The Reversibility Asymmetry: Engineers mistakenly believe joining a startup is a permanent risk. In reality, large tech companies actively recruit former startup leads at higher senior bands.',
    ],
    immediateNextSteps: [
      'Ask the startup founders for their current monthly burn rate, runway in months, and the strike price / last 409A valuation of the options.',
      'Negotiate with the startup: Ask if they can close the base salary gap to $180k or add a signing bonus to offset your down-payment timeline.',
      'Audit your personal monthly expenses: Calculate whether $165k base comfortably covers your savings target without living paycheck-to-paycheck.',
    ],
    gutCheckQuestion: 'Five years from now, looking back at your life, will you regret not banking an extra $150k in cash, or will you regret not finding out what you could build when given full technical command of a venture-backed startup?',
  },
};

export const SAMPLE_DECISION_HOUSING: DecisionAnalysis = {
  id: 'sample-housing',
  createdAt: new Date(Date.now() - 172800000).toISOString(),
  decisionQuestion: 'Should we buy a $750,000 suburban townhouse with 20% down or continue renting downtown for $3,200/mo and invest the $150,000 in broad-market index funds?',
  userContext: 'Couple in their early 30s, considering starting a family in 2-3 years, hybrid work (3 days remote), enjoy urban walkability.',
  options: [
    {
      id: 'opt-buy',
      name: 'Buy $750k Suburban Townhouse',
      description: '3-bed, 2.5-bath, private backyard, 35-minute commuter rail into downtown, HOA $350/mo, 6.8% mortgage rate.',
    },
    {
      id: 'opt-rent',
      name: 'Rent Downtown & Invest the $150k',
      description: '2-bed modern apartment, walkable to restaurants and offices, flexible 12-month lease, invest cash in S&P 500 / total market ETFs.',
    },
  ],
  prosCons: [
    {
      optionId: 'opt-buy',
      optionName: 'Buy Suburban Townhouse',
      tagline: 'Rooted stability, future family readiness, and forced equity accumulation',
      pros: [
        { id: 'hb1', text: 'Secures permanent housing stability ahead of starting a family without risk of landlord non-renewal.', impact: 'high', category: 'Lifestyle' },
        { id: 'hb2', text: 'Private outdoor yard, dedicated dual home offices, and extra storage space.', impact: 'high', category: 'Comfort' },
        { id: 'hb3', text: 'Principal paydown functions as an automatic forced savings mechanism.', impact: 'medium', category: 'Financial' },
        { id: 'hb4', text: 'Option to refinance when mortgage interest rates eventually decline.', impact: 'medium', category: 'Financial' },
      ],
      cons: [
        { id: 'hbc1', text: 'High monthly carrying cost (~$5,300/mo including P&I, property taxes, insurance, HOA, maintenance).', impact: 'high', category: 'Financial' },
        { id: 'hbc2', text: 'Locks up $150k liquid capital + $25k closing costs into a single illiquid physical asset.', impact: 'high', category: 'Liquidity' },
        { id: 'hbc3', text: 'Adds 70 minutes of daily round-trip commuting on in-office days.', impact: 'medium', category: 'Lifestyle' },
        { id: 'hbc4', text: 'Unexpected maintenance liabilities (appliances, roof, HVAC) rest entirely on you.', impact: 'medium', category: 'Stress' },
      ],
    },
    {
      optionId: 'opt-rent',
      optionName: 'Rent Downtown & Invest',
      tagline: 'Maximum financial agility, zero maintenance liability, and rich urban lifestyle',
      pros: [
        { id: 'hr1', text: 'Fixed $3,200/mo housing cap frees up $2,100/mo in cash flow to invest in high-yield assets.', impact: 'high', category: 'Financial' },
        { id: 'hr2', text: 'Preserves $150,000 liquid capital compounding at historical 8-10% stock market returns.', impact: 'high', category: 'Wealth' },
        { id: 'hr3', text: 'Zero commute stress; 10-minute walk to work, parks, cafes, and cultural amenities.', impact: 'high', category: 'Lifestyle' },
        { id: 'hr4', text: 'Total flexibility to relocate if career opportunities arise or family timing changes.', impact: 'medium', category: 'Flexibility' },
      ],
      cons: [
        { id: 'hrc1', text: 'Rent inflation risk: landlord could raise monthly rent by 5-10% upon lease renewal.', impact: 'high', category: 'Risk' },
        { id: 'hrc2', text: 'Tight quarters for preparing a nursery or accommodating visiting grandparents.', impact: 'medium', category: 'Space' },
        { id: 'hrc3', text: 'Zero direct equity or property appreciation benefits in a competitive metro market.', impact: 'medium', category: 'Equity' },
      ],
    },
  ],
  comparisonTable: [
    {
      id: 'crit-h-cf',
      criterion: 'Monthly Cash Flow Flexibility',
      category: 'Financial',
      weight: 5,
      description: 'Discretionary buffer remaining each month after all housing expenditures.',
      scores: {
        'opt-buy': { score: 4, explanation: 'All-in monthly expense ~$5,300 leaves very narrow discretionary margin.' },
        'opt-rent': { score: 9, explanation: '$3,200 rent leaves over $2,000 monthly cash flow surplus to invest.' },
      },
    },
    {
      id: 'crit-h-growth',
      criterion: '10-Year Wealth Accumulation Potential',
      category: 'Wealth',
      weight: 4,
      description: 'Projected net worth based on historical asset returns vs home equity.',
      scores: {
        'opt-buy': { score: 6, explanation: 'High interest rate environment means first 5-7 years of payments go almost entirely to bank interest and taxes.' },
        'opt-rent': { score: 9, explanation: '$150k compounding in index funds + $2,100/mo surplus historically outperforms residential real estate after costs.' },
      },
    },
    {
      id: 'crit-h-family',
      criterion: 'Family Readiness & Space',
      category: 'Lifestyle',
      weight: 4,
      description: 'Physical square footage, suburban quiet, yard space, and school district access.',
      scores: {
        'opt-buy': { score: 9, explanation: '3 bedrooms + yard provide ample space for nursery, remote work, and child play.' },
        'opt-rent': { score: 4, explanation: '2-bed apartment feels cramped once stroller, baby gear, and remote work clash.' },
      },
    },
    {
      id: 'crit-h-mobility',
      criterion: 'Geographic & Career Mobility',
      category: 'Flexibility',
      weight: 3,
      description: 'Friction and transaction costs involved if you need to move within 3 years.',
      scores: {
        'opt-buy': { score: 3, explanation: '6% realtor fees and transfer taxes mean selling in under 5 years often results in a net financial loss.' },
        'opt-rent': { score: 10, explanation: 'Lease expires annually with zero friction or seller closing costs.' },
      },
    },
  ],
  swotAnalysis: [
    {
      optionId: 'opt-buy',
      optionName: 'Buy Suburban Townhouse',
      strengths: ['Spacious multi-level living with yard', 'Locked-in property foundation for coming decade', 'Psychological satisfaction of homeownership'],
      weaknesses: ['Massive monthly cash commitment (~$5,300/mo)', 'Loss of liquid emergency safety net', 'Commute fatigue on hybrid days'],
      opportunities: ['Refinancing when interest rates pull back below 5.5%', 'Suburban school district appreciation', 'Custom interior modifications'],
      threats: ['Special HOA assessments or major capital repairs', 'Suburban market stagnation in high-rate climate', 'Feeling isolated from city amenities'],
    },
    {
      optionId: 'opt-rent',
      optionName: 'Rent Downtown & Invest',
      strengths: ['Ultra-liquid balance sheet ($150k+ in easily tradeable ETFs)', 'No maintenance, yard work, or surprise HOA bills', 'Prime urban lifestyle vibrancy'],
      weaknesses: ['No building equity in property', 'Lack of dedicated space if child arrives sooner', 'Subject to landlord whims on lease terms'],
      opportunities: ['Entering the housing market later with a much larger down payment cash pool', 'Investing during market pullbacks', 'Testing different neighborhoods'],
      threats: ['Rapid local rent hikes squeezing savings rate', 'Missing a rapid suburban real estate surge', 'Multiple consecutive moves while pregnant or with infant'],
    },
  ],
  verdict: {
    recommendation: 'Continue renting and investing for the next 18 to 24 months, while keeping the down payment fund protected in short-term Treasuries or index funds, and pull the trigger on buying suburban housing only when pregnancy or baby timeline is 6 months away.',
    confidence: 'strong',
    primaryWinnerId: 'opt-rent',
    primaryWinnerName: 'Rent & Invest (for next 18-24 months)',
    summaryRationale: 'With mortgage rates around 6.8%, the price-to-rent ratio heavily favors renting. An all-in monthly payment of ~$5,300 vs $3,200 rent creates a $2,100 monthly penalty to buy before you actually need the suburban space. You are 2-3 years away from needing school districts or backyard play areas. Prematurely buying now forces you to pay heavy interest on unused space while sacrificing your liquid safety net.',
    priorityBranches: [
      {
        priority: 'Maximizing pure 10-year net worth and cash flexibility',
        recommendedOptionId: 'opt-rent',
        recommendedOptionName: 'Rent Downtown & Invest',
        rationale: 'Liquid index funds with $2,100 monthly contributions mathematically outpace leveraged high-rate mortgage amortization in the first 5 years.',
      },
      {
        priority: 'Emotional desire to nest, decorate, and permanently settle right now',
        recommendedOptionId: 'opt-buy',
        recommendedOptionName: 'Buy Suburban Townhouse',
        rationale: 'If moving stresses you and you want the peace of mind of ownership today, financial optimization takes second place to emotional comfort.',
      },
    ],
    hiddenBlindspots: [
      'The "Renting is throwing money away" fallacy: At 6.8% interest on $600k borrowed, over $3,400 of your monthly mortgage payment is pure unrecoverable interest and property tax—meaning you "throw away" more money buying than renting.',
      'HOA Surprise Costs: Townhouse HOAs frequently levy sudden $5,000-$15,000 special assessments for roofs, repaving, or siding.',
      'The 5-Year Break-Even Rule: If you buy and decide you dislike suburban isolation within 3 years, the 6-8% transaction selling costs will wipe out any modest equity built.',
    ],
    immediateNextSteps: [
      'Put the $150,000 into high-yield accounts / short-term Treasuries earning 4.5%+ to generate $560/month in passive income while you decide.',
      'Spend a full weekend in the target suburb: Do the commute on a Tuesday morning at 8:00 AM to feel the real transit friction.',
      'Run a precise amortisation schedule calculator to see how much of your first 36 monthly payments goes to interest vs principal.',
    ],
    gutCheckQuestion: 'If you bought the townhouse this Saturday, would your dominant emotion on Sunday morning be peaceful pride of ownership, or heavy anxiety over the $5,300 monthly bill and the long commute?',
  },
};
