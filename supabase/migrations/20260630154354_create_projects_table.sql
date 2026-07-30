/*
# Create projects table (single-tenant, no auth required)

1. New Tables
- `projects`
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `description` (text, optional)
  - `client_id` (text, unique identifier for anonymous users stored in localStorage)
  - `settings` (jsonb, project-specific settings)
  - `created_at` (timestamp with timezone)
  - `updated_at` (timestamp with timezone)

- `project_items`
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `type` (text, type of generation: hooks, ad-copy, content-ideas, etc.)
  - `label` (text, display label)
  - `input_data` (jsonb, original inputs)
  - `output_data` (jsonb, generated results)
  - `metadata` (jsonb, additional metadata)
  - `created_at` (timestamp with timezone)

- `project_notes`
  - `id` (uuid, primary key)
  - `project_id` (uuid, foreign key to projects)
  - `content` (text, note content)
  - `created_at` (timestamp with timezone)
  - `updated_at` (timestamp with timezone)

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD because this is single-tenant (no auth).
- client_id column used for soft multi-tenancy (anonymous users identified by localStorage client_id).

3. Indexes
- Index on projects.client_id for fast lookup
- Index on project_items.project_id for fast retrieval
- Index on project_notes.project_id for fast retrieval
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  client_id text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

-- Project items table (stores generated content)
CREATE TABLE IF NOT EXISTS project_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,
  label text NOT NULL,
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_items_project_id ON project_items(project_id);
CREATE INDEX IF NOT EXISTS idx_project_items_type ON project_items(type);

ALTER TABLE project_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_project_items" ON project_items;
CREATE POLICY "anon_select_project_items" ON project_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_project_items" ON project_items;
CREATE POLICY "anon_insert_project_items" ON project_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_project_items" ON project_items;
CREATE POLICY "anon_update_project_items" ON project_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_project_items" ON project_items;
CREATE POLICY "anon_delete_project_items" ON project_items FOR DELETE
  TO anon, authenticated USING (true);

-- Project notes table
CREATE TABLE IF NOT EXISTS project_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_notes_project_id ON project_notes(project_id);

ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_project_notes" ON project_notes;
CREATE POLICY "anon_select_project_notes" ON project_notes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_project_notes" ON project_notes;
CREATE POLICY "anon_insert_project_notes" ON project_notes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_project_notes" ON project_notes;
CREATE POLICY "anon_update_project_notes" ON project_notes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_project_notes" ON project_notes;
CREATE POLICY "anon_delete_project_notes" ON project_notes FOR DELETE
  TO anon, authenticated USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_notes_updated_at ON project_notes;
CREATE TRIGGER update_project_notes_updated_at
  BEFORE UPDATE ON project_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();