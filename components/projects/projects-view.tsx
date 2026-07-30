'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FolderKanban, Plus, Search, Trash2, MoreVertical, Clock,
  FileText, MessageSquare, Wand2, ChevronRight, X, Edit3,
  StickyNote, ArrowRight, FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/section-card';
import { EmptyState } from '@/components/empty-state';
import { projectsService, projectItemsService, projectNotesService, type Project, type ProjectItem, type ProjectNote } from '@/lib/projects/service';
import { useTranslation } from '@/lib/i18n';
import { type ToolId } from '@/lib/tools';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectsViewProps {
  onNavigate?: (toolId: ToolId) => void;
}

export function ProjectsView({ onNavigate }: ProjectsViewProps) {
  const t = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [projectNotes, setProjectNotes] = useState<ProjectNote[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<ProjectNote | null>(null);

  // Load projects
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await projectsService.list();
    setProjects(data);
    setLoading(false);
  };

  // Load project details when selected
  useEffect(() => {
    if (selectedProject) {
      loadProjectDetails(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjectDetails = async (projectId: string) => {
    setItemsLoading(true);
    const [items, notes] = await Promise.all([
      projectItemsService.list(projectId),
      projectNotesService.list(projectId),
    ]);
    setProjectItems(items);
    setProjectNotes(notes);
    setItemsLoading(false);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error('Project name is required');
      return;
    }
    setCreating(true);
    const project = await projectsService.create({
      name: newProjectName.trim(),
      description: newProjectDescription.trim() || undefined,
    });
    if (project) {
      setProjects([project, ...projects]);
      setCreateDialogOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
      toast.success('Project created');
    } else {
      toast.error('Failed to create project');
    }
    setCreating(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    const success = await projectsService.delete(projectId);
    if (success) {
      setProjects(projects.filter((p) => p.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
      toast.success('Project deleted');
    } else {
      toast.error('Failed to delete project');
    }
  };

  const handleAddNote = async () => {
    if (!selectedProject || !newNoteContent.trim()) return;
    setAddingNote(true);
    const note = await projectNotesService.create(selectedProject.id, newNoteContent.trim());
    if (note) {
      setProjectNotes([note, ...projectNotes]);
      setNoteDialogOpen(false);
      setNewNoteContent('');
      toast.success('Note added');
    } else {
      toast.error('Failed to add note');
    }
    setAddingNote(false);
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !newNoteContent.trim()) return;
    setAddingNote(true);
    const note = await projectNotesService.update(editingNote.id, newNoteContent.trim());
    if (note) {
      setProjectNotes(projectNotes.map((n) => (n.id === note.id ? note : n)));
      setNoteDialogOpen(false);
      setEditingNote(null);
      setNewNoteContent('');
      toast.success('Note updated');
    } else {
      toast.error('Failed to update note');
    }
    setAddingNote(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    const success = await projectNotesService.delete(noteId);
    if (success) {
      setProjectNotes(projectNotes.filter((n) => n.id !== noteId));
      toast.success('Note deleted');
    } else {
      toast.error('Failed to delete note');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const success = await projectItemsService.delete(itemId);
    if (success) {
      setProjectItems(projectItems.filter((i) => i.id !== itemId));
      toast.success('Item removed');
    } else {
      toast.error('Failed to remove item');
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    const icons: Record<string, typeof Wand2> = {
      hooks: Wand2,
      'content-ideas': FileText,
      'ad-copy': FileText,
      'video-prompt': FileText,
      persona: FileText,
      'marketing-plan': FileText,
      seo: FileText,
      'social-media': FileText,
      email: FileText,
      'landing-page': FileText,
      'product-description': FileText,
      'brand-voice': FileText,
    };
    return icons[type] || FileText;
  };

  // Project list view
  if (!selectedProject) {
    return (
      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Projects</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Organize your AI generations and notes by project
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Search */}
        <SectionCard padded={false} className="mb-5 overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:bg-white dark:focus:bg-slate-600 focus:ring-4 focus:ring-orange-100/60 dark:focus:ring-orange-900/40"
              />
            </div>
          </div>
        </SectionCard>

        {/* Projects list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title={projects.length === 0 ? 'No projects yet' : 'No matches found'}
            description={
              projects.length === 0
                ? 'Create your first project to organize your work'
                : 'Try a different search term'
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-all hover:shadow-md hover:border-orange-200 dark:hover:border-orange-800 sm:p-5"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
                    <FolderKanban className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                        {project.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(project.updated_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-orange-500" />
                New Project
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., Q4 Product Launch"
                  className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description (optional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="What's this project about?"
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={creating}>
                {creating ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    );
  }

  // Project detail view
  return (
    <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setSelectedProject(null)}
        className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
            <FolderOpen className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedProject.name}
            </h2>
            {selectedProject.description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {selectedProject.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1">
                <Wand2 className="h-3 w-3" />
                {projectItems.length} generations
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1">
                <StickyNote className="h-3 w-3" />
                {projectNotes.length} notes
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Updated {new Date(selectedProject.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Generations */}
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Generations
            </h3>
            {onNavigate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('dashboard' as ToolId)}
                className="text-xs text-orange-600 hover:text-orange-700"
              >
                <Plus className="mr-1 h-3 w-3" />
                Generate
              </Button>
            )}
          </div>

          {itemsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : projectItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
              <Wand2 className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No generations yet
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Generate content and save it to this project
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {projectItems.map((item) => {
                const ItemIcon = getTypeIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 transition-all hover:shadow-sm sm:p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500">
                        <ItemIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                          {item.type} · {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notes</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingNote(null);
                setNewNoteContent('');
                setNoteDialogOpen(true);
              }}
              className="text-xs text-orange-600 hover:text-orange-700"
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Note
            </Button>
          </div>

          {projectNotes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
              <StickyNote className="mx-auto h-6 w-6 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Add notes to track ideas and progress
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {projectNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-3 sm:p-4"
                >
                  <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                    {note.content}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNote(note);
                          setNewNoteContent(note.content);
                          setNoteDialogOpen(true);
                        }}
                        className="rounded p-1 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Dialog */}
      <Dialog
        open={noteDialogOpen}
        onOpenChange={(open) => {
          setNoteDialogOpen(open);
          if (!open) {
            setEditingNote(null);
            setNewNoteContent('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note..."
              rows={5}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNoteDialogOpen(false);
                setEditingNote(null);
                setNewNoteContent('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingNote ? handleUpdateNote : handleAddNote}
              disabled={addingNote || !newNoteContent.trim()}
            >
              {addingNote ? 'Saving...' : editingNote ? 'Save' : 'Add Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
