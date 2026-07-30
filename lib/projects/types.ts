export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  outputs: ProjectOutput[];
}

export interface ProjectOutput {
  id: string;
  toolId: string;
  label: string;
  result: unknown;
  createdAt: string;
  isFavorite: boolean;
}

export interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
}
