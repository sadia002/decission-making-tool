import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or when available
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Main decision analysis endpoint
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { decision, options, context } = req.body;

    if (!decision || typeof decision !== 'string' || !decision.trim()) {
      res.status(400).json({ error: 'Please provide a decision or dilemma to analyze.' });
      return;
    }

    const ai = getGenAI();

    const promptText = `
You are "The Tiebreaker", an expert strategic decision analyst, executive advisor, and cognitive bias breaker.
The user is facing a tough choice and needs crystal clarity.

User's Decision Question:
"${decision.trim()}"

${options && Array.isArray(options) && options.filter(Boolean).length > 0
  ? `Specified Options:
${options.filter(Boolean).map((opt: string, i: number) => `Option ${i + 1}: ${opt}`).join('\n')}`
  : `The user hasn't explicitly separated options. Extract or define 2 to 3 distinct, realistic, high-contrast paths from their dilemma (e.g. Option A: Move forward with X, Option B: Stay with Y / pursue alternative).`
}

${context && typeof context === 'string' && context.trim()
  ? `User's Personal Priorities, Constraints & Values:
"${context.trim()}"`
  : 'No additional constraints provided.'}

Your task:
Perform a comprehensive, rigorous, and completely objective multi-angle decision breakdown including:
1. Identified Options (2 or 3 paths) with concise descriptions and punchy taglines.
2. Pros and Cons List for EACH option:
   - Provide 3 to 5 realistic, incisive pros with an impact rating ('high', 'medium', 'low') and clear category (e.g. "Career", "Financial", "Lifestyle", "Risk").
   - Provide 3 to 5 honest, unvarnished cons with an impact rating and category.
3. Comparison Table across 4 to 6 critical decision criteria (e.g., Financial Payoff, Mental Energy / Stress, Growth Potential, Risk / Downside Protection, Work-Life Balance, Reversibility):
   - For each criterion: name, category, default weight (1 to 5), short description, and for EACH option a score from 1 (poor) to 10 (exceptional) with a concise, punchy rationale.
4. SWOT Analysis for EACH option:
   - Strengths (Internal advantages)
   - Weaknesses (Internal drawbacks / vulnerabilities)
   - Opportunities (External upsides / future tailwinds)
   - Threats (External risks / worst-case scenarios)
5. The Tiebreaker Verdict:
   - A clear, authoritative summary recommendation.
   - Primary winner option (id and name).
   - Confidence level ('strong', 'moderate', 'nuanced').
   - Summary rationale explaining the core trade-off that tips the scale.
   - Priority Branches: "If your top priority is X, choose Option A because...; If your top priority is Y, choose Option B because...".
   - Hidden Blindspots: 2-3 non-obvious traps, cognitive biases, or regrets people usually encounter with this decision.
   - Immediate Next Steps: 2-3 concrete steps to validate or de-risk the choice in the next 48 hours.
   - Gut-Check Question: One provocative question to ask oneself to instantly cut through mental noise.

Return your response strictly adhering to the JSON schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction:
          'You are The Tiebreaker, an elite decision analyst. Provide crisp, realistic, deeply insightful analysis without generic filler. Return strictly valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            decisionQuestion: { type: Type.STRING },
            userContext: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['id', 'name', 'description'],
              },
            },
            prosCons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  optionName: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        impact: { type: Type.STRING },
                        category: { type: Type.STRING },
                      },
                      required: ['id', 'text', 'impact', 'category'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        impact: { type: Type.STRING },
                        category: { type: Type.STRING },
                      },
                      required: ['id', 'text', 'impact', 'category'],
                    },
                  },
                },
                required: ['optionId', 'optionName', 'tagline', 'pros', 'cons'],
              },
            },
            comparisonTable: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  criterion: { type: Type.STRING },
                  category: { type: Type.STRING },
                  weight: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  scores: {
                    type: Type.OBJECT,
                    description: 'Keyed by optionId containing score (number 1-10) and explanation (string)',
                  },
                },
                required: ['id', 'criterion', 'category', 'weight', 'description', 'scores'],
              },
            },
            swotAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  optionName: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['optionId', 'optionName', 'strengths', 'weaknesses', 'opportunities', 'threats'],
              },
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                recommendation: { type: Type.STRING },
                confidence: { type: Type.STRING },
                primaryWinnerId: { type: Type.STRING },
                primaryWinnerName: { type: Type.STRING },
                summaryRationale: { type: Type.STRING },
                priorityBranches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      priority: { type: Type.STRING },
                      recommendedOptionId: { type: Type.STRING },
                      recommendedOptionName: { type: Type.STRING },
                      rationale: { type: Type.STRING },
                    },
                    required: ['priority', 'recommendedOptionId', 'recommendedOptionName', 'rationale'],
                  },
                },
                hiddenBlindspots: { type: Type.ARRAY, items: { type: Type.STRING } },
                immediateNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                gutCheckQuestion: { type: Type.STRING },
              },
              required: [
                'recommendation',
                'confidence',
                'primaryWinnerId',
                'primaryWinnerName',
                'summaryRationale',
                'priorityBranches',
                'hiddenBlindspots',
                'immediateNextSteps',
                'gutCheckQuestion',
              ],
            },
          },
          required: ['id', 'decisionQuestion', 'options', 'prosCons', 'comparisonTable', 'swotAnalysis', 'verdict'],
        },
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    parsedData.createdAt = new Date().toISOString();
    if (!parsedData.id) parsedData.id = 'dec-' + Date.now();
    if (!parsedData.decisionQuestion) parsedData.decisionQuestion = decision;
    if (context && !parsedData.userContext) parsedData.userContext = context;

    res.json(parsedData);
  } catch (err: any) {
    console.error('Error analyzing decision:', err);
    res.status(500).json({
      error: err.message || 'Failed to analyze decision with AI.',
    });
  }
});

// Vite middleware for development & static for production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Tiebreaker server running on port ${PORT}`);
  });
}

setupViteOrStatic();
