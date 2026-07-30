'use client';

import { useState, useRef } from 'react';
import { FileUp, Trash2, File, Check, Loader2, AlertCircle, Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { knowledgeService } from '@/lib/knowledge/service';
import type { KnowledgeDocument, UploadProgress } from '@/lib/knowledge/types';
import { toast } from 'sonner';

export function KnowledgeCenter() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress({ phase: 'uploading', progress: 0, message: 'Starting upload...' });

    try {
      for (const file of Array.from(files)) {
        const doc = await knowledgeService.uploadDocument(file, setUploadProgress);
        setDocuments((prev) => [doc, ...prev]);
      }
      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (id: string) => {
    knowledgeService.deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.success('Document removed');
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const status = knowledgeService.getStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Center</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Upload documents to enhance AI responses with your knowledge
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5">
          <FolderOpen className="h-3 w-3" />
          {status.documentCount} documents · {status.totalChunks} chunks
        </Badge>
      </div>

      {/* Upload Area */}
      <Card className="border-dashed">
        <CardContent className="p-8">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-4 cursor-pointer transition-all',
              uploading && 'pointer-events-none opacity-50'
            )}
          >
            {uploading && uploadProgress ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                <div className="text-center">
                  <p className="font-medium">{uploadProgress.message}</p>
                  <div className="w-48 h-2 bg-muted rounded-full mt-2">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all"
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                  <Upload className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PDF, DOCX, TXT, MD files
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Uploaded Documents
          </h3>
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <File className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(doc.size)} · {doc.metadata.chunkCount} chunks · {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doc.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Status Card */}
      <Card className="bg-muted/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-medium">Knowledge Base {status.hasEmbeddings ? 'Active' : 'Ready'}</p>
            <p className="text-sm text-muted-foreground">
              {status.hasEmbeddings
                ? 'Semantic search enabled with embeddings'
                : 'Text search ready. Connect an embedding provider for semantic search.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
