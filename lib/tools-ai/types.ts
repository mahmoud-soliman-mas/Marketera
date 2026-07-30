// ─── AI Tools Types ───────────────────────────────────────────────────────────
// Tool definitions for AI action layer

export type ToolCategory = 'web' | 'calculation' | 'marketing' | 'api' | 'utility';

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  parameters: Record<string, ToolParameter>;
  available: boolean;
  requiresSetup?: string;
}

export interface ToolParameter {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  enum?: string[];
  default?: unknown;
}

export interface ToolCallRequest {
  toolId: string;
  parameters: Record<string, unknown>;
}

export interface ToolCallResult {
  success: boolean;
  result?: unknown;
  error?: string;
}

// ─── Available Tools ────────────────────────────────────────────────────────

export const AI_TOOLS: AITool[] = [
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform mathematical calculations for marketing metrics',
    category: 'calculation',
    parameters: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate',
        required: true,
      },
    },
    available: true,
  },
  {
    id: 'currency_convert',
    name: 'Currency Converter',
    description: 'Convert amounts between different currencies',
    category: 'calculation',
    parameters: {
      amount: { type: 'number', description: 'Amount to convert', required: true },
      from: { type: 'string', description: 'Source currency code', required: true },
      to: { type: 'string', description: 'Target currency code', required: true },
    },
    available: false,
    requiresSetup: 'Currency API key required',
  },
  {
    id: 'web_search',
    name: 'Web Search',
    description: 'Search the web for current information',
    category: 'web',
    parameters: {
      query: { type: 'string', description: 'Search query', required: true },
      limit: { type: 'number', description: 'Number of results', required: false, default: 5 },
    },
    available: false,
    requiresSetup: 'Search API key required',
  },
  {
    id: 'seo_lookup',
    name: 'SEO Lookup',
    description: 'Get SEO metrics for a domain or keyword',
    category: 'marketing',
    parameters: {
      target: { type: 'string', description: 'Domain or keyword to analyze', required: true },
      type: { type: 'string', description: 'domain or keyword', required: true, enum: ['domain', 'keyword'] },
    },
    available: false,
    requiresSetup: 'SEO API key required',
  },
  {
    id: 'roas_calculator',
    name: 'ROAS Calculator',
    description: 'Calculate Return on Ad Spend',
    category: 'marketing',
    parameters: {
      revenue: { type: 'number', description: 'Revenue generated', required: true },
      adSpend: { type: 'number', description: 'Total ad spend', required: true },
    },
    available: true,
  },
  {
    id: 'cpa_calculator',
    name: 'CPA Calculator',
    description: 'Calculate Cost Per Acquisition',
    category: 'marketing',
    parameters: {
      totalCost: { type: 'number', description: 'Total campaign cost', required: true },
      conversions: { type: 'number', description: 'Number of conversions', required: true },
    },
    available: true,
  },
  {
    id: 'ctr_calculator',
    name: 'CTR Calculator',
    description: 'Calculate Click-Through Rate',
    category: 'marketing',
    parameters: {
      clicks: { type: 'number', description: 'Number of clicks', required: true },
      impressions: { type: 'number', description: 'Number of impressions', required: true },
    },
    available: true,
  },
  {
    id: 'cpm_calculator',
    name: 'CPM Calculator',
    description: 'Calculate Cost Per Mille (thousand impressions)',
    category: 'marketing',
    parameters: {
      totalCost: { type: 'number', description: 'Total campaign cost', required: true },
      impressions: { type: 'number', description: 'Number of impressions', required: true },
    },
    available: true,
  },
];

export function getAvailableTools(): AITool[] {
  return AI_TOOLS.filter((t) => t.available);
}

export function getToolById(id: string): AITool | undefined {
  return AI_TOOLS.find((t) => t.id === id);
}
