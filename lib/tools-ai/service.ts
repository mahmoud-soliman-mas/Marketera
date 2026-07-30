// ─── AI Tools Service ─────────────────────────────────────────────────────────
// Executable tool layer for AI actions

import type { ToolCallRequest, ToolCallResult, AITool } from './types';
import { AI_TOOLS, getToolById, getAvailableTools } from './types';

// ─── Tool Executors ──────────────────────────────────────────────────────────

const toolExecutors: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  calculator: async (params) => {
    const expression = String(params.expression);
    // Safe expression evaluation - only allow math operations
    const sanitized = expression.replace(/[^0-9+\-*/.()%\s]/g, '');
    try {
      const result = Function(`"use strict"; return (${sanitized})`)();
      return { expression, result };
    } catch (e) {
      throw new Error('Invalid expression');
    }
  },

  roas_calculator: async (params) => {
    const revenue = Number(params.revenue);
    const adSpend = Number(params.adSpend);
    if (adSpend === 0) throw new Error('Ad spend cannot be zero');
    const roas = revenue / adSpend;
    const percentage = ((roas - 1) * 100).toFixed(2);
    return {
      revenue,
      adSpend,
      roas: roas.toFixed(2),
      percentage: `${percentage}%`,
      profit: revenue - adSpend,
      interpretation: roas >= 1 ? 'Profitable campaign' : 'Unprofitable campaign',
    };
  },

  cpa_calculator: async (params) => {
    const totalCost = Number(params.totalCost);
    const conversions = Number(params.conversions);
    if (conversions === 0) throw new Error('Conversions cannot be zero');
    const cpa = totalCost / conversions;
    return {
      totalCost,
      conversions,
      cpa: cpa.toFixed(2),
      costPerConversion: `$${cpa.toFixed(2)} per conversion`,
    };
  },

  ctr_calculator: async (params) => {
    const clicks = Number(params.clicks);
    const impressions = Number(params.impressions);
    if (impressions === 0) throw new Error('Impressions cannot be zero');
    const ctr = (clicks / impressions) * 100;
    return {
      clicks,
      impressions,
      ctr: `${ctr.toFixed(2)}%`,
      interpretation: ctr >= 2 ? 'Good CTR' : ctr >= 1 ? 'Average CTR' : 'Below average CTR',
    };
  },

  cpm_calculator: async (params) => {
    const totalCost = Number(params.totalCost);
    const impressions = Number(params.impressions);
    if (impressions === 0) throw new Error('Impressions cannot be zero');
    const cpm = (totalCost / impressions) * 1000;
    return {
      totalCost,
      impressions,
      cpm: `$${cpm.toFixed(2)} per 1000 impressions`,
    };
  },
};

// ─── Tool Service ────────────────────────────────────────────────────────────

class ToolService {
  private tools: Map<string, AITool> = new Map();

  constructor() {
    AI_TOOLS.forEach((t) => this.tools.set(t.id, t));
  }

  getTools(): AITool[] {
    return AI_TOOLS;
  }

  getAvailableTools(): AITool[] {
    return getAvailableTools();
  }

  getTool(id: string): AITool | undefined {
    return getToolById(id);
  }

  isAvailable(toolId: string): boolean {
    const tool = this.tools.get(toolId);
    return tool?.available ?? false;
  }

  async execute(request: ToolCallRequest): Promise<ToolCallResult> {
    const tool = this.tools.get(request.toolId);

    if (!tool) {
      return { success: false, error: `Unknown tool: ${request.toolId}` };
    }

    if (!tool.available) {
      return {
        success: false,
        error: tool.requiresSetup || 'Tool not available',
      };
    }

    const executor = toolExecutors[request.toolId];

    if (!executor) {
      return { success: false, error: 'Tool executor not implemented' };
    }

    try {
      const result = await executor(request.parameters);
      return { success: true, result };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  }

  // Generate tool definitions for AI models
  getToolDefinitionsForModel(): Array<{
    type: 'function';
    function: { name: string; description: string; parameters: Record<string, unknown> };
  }> {
    return this.getAvailableTools().map((tool) => ({
      type: 'function' as const,
      function: {
        name: tool.id,
        description: tool.description,
        parameters: {
          type: 'object',
          properties: Object.fromEntries(
            Object.entries(tool.parameters).map(([key, param]) => [
              key,
              {
                type: param.type,
                description: param.description,
                ...(param.enum && { enum: param.enum }),
              },
            ])
          ),
          required: Object.entries(tool.parameters)
            .filter(([_, param]) => param.required)
            .map(([key]) => key),
        },
      },
    }));
  }
}

export const toolService = new ToolService();
