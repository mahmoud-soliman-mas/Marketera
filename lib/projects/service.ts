// ─── Projects Service ────────────────────────────────────────────────────────────
// Database-backed project management

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Client ID Management ─────────────────────────────────────────────────────

const CLIENT_ID_KEY = 'ai-marketing-client-id';

export function getClientId(): string {
  if (typeof window === 'undefined') return '';

  let clientId = localStorage.getItem(CLIENT_ID_KEY);
  if (!clientId) {
    clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }
  return clientId;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProjectItem {
  id: string;
  project_id: string;
  type: string;
  label: string;
  input_data: Record<string, unknown>;
  output_data: unknown[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ProjectNote {
  id: string;
  project_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface CreateProjectItemInput {
  project_id: string;
  type: string;
  label: string;
  input_data?: Record<string, unknown>;
  output_data?: unknown[];
  metadata?: Record<string, unknown>;
}

// ─── Projects CRUD ─────────────────────────────────────────────────────────────

export const projectsService = {
  async list(): Promise<Project[]> {
    const clientId = getClientId();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to list projects:', error);
      return [];
    }

    return data || [];
  },

  async get(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Failed to get project:', error);
      return null;
    }

    return data;
  },

  async create(input: CreateProjectInput): Promise<Project | null> {
    const clientId = getClientId();
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: input.name,
        description: input.description,
        client_id: clientId,
        settings: {},
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to create project:', error);
      return null;
    }

    return data;
  },

  async update(id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'settings'>>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to update project:', error);
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete project:', error);
      return false;
    }

    return true;
  },

  async getStats(id: string): Promise<{
    totalItems: number;
    itemsByType: Record<string, number>;
    notesCount: number;
    lastActivity: string | null;
  }> {
    const [itemsResult, notesResult] = await Promise.all([
      supabase
        .from('project_items')
        .select('type, created_at')
        .eq('project_id', id),
      supabase
        .from('project_notes')
        .select('id')
        .eq('project_id', id),
    ]);

    const items = itemsResult.data || [];
    const notes = notesResult.data || [];

    const itemsByType: Record<string, number> = {};
    let lastActivity: string | null = null;

    items.forEach((item) => {
      itemsByType[item.type] = (itemsByType[item.type] || 0) + 1;
      if (!lastActivity || item.created_at > lastActivity) {
        lastActivity = item.created_at;
      }
    });

    return {
      totalItems: items.length,
      itemsByType,
      notesCount: notes.length,
      lastActivity,
    };
  },
};

// ─── Project Items CRUD ───────────────────────────────────────────────────────

export const projectItemsService = {
  async list(projectId: string): Promise<ProjectItem[]> {
    const { data, error } = await supabase
      .from('project_items')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to list project items:', error);
      return [];
    }

    return data || [];
  },

  async create(input: CreateProjectItemInput): Promise<ProjectItem | null> {
    const { data, error } = await supabase
      .from('project_items')
      .insert({
        project_id: input.project_id,
        type: input.type,
        label: input.label,
        input_data: input.input_data || {},
        output_data: input.output_data || [],
        metadata: input.metadata || {},
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to create project item:', error);
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('project_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete project item:', error);
      return false;
    }

    return true;
  },

  async moveToProject(itemId: string, newProjectId: string): Promise<boolean> {
    const { error } = await supabase
      .from('project_items')
      .update({ project_id: newProjectId })
      .eq('id', itemId);

    if (error) {
      console.error('Failed to move project item:', error);
      return false;
    }

    return true;
  },
};

// ─── Project Notes CRUD ───────────────────────────────────────────────────────

export const projectNotesService = {
  async list(projectId: string): Promise<ProjectNote[]> {
    const { data, error } = await supabase
      .from('project_notes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to list project notes:', error);
      return [];
    }

    return data || [];
  },

  async create(projectId: string, content: string): Promise<ProjectNote | null> {
    const { data, error } = await supabase
      .from('project_notes')
      .insert({
        project_id: projectId,
        content,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to create project note:', error);
      return null;
    }

    return data;
  },

  async update(id: string, content: string): Promise<ProjectNote | null> {
    const { data, error } = await supabase
      .from('project_notes')
      .update({ content })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to update project note:', error);
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('project_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete project note:', error);
      return false;
    }

    return true;
  },
};
