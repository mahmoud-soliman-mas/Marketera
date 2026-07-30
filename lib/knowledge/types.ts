// ─── Knowledge Base Types ────────────────────────────────────────────────────
// RAG-ready document storage and retrieval

export type DocumentType = 'pdf' | 'docx' | 'txt' | 'md' | 'html';

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  uploadedAt: string;
  content: string;
  embeddings?: number[];
  metadata: {
    pages?: number;
    author?: string;
    title?: string;
    chunkCount: number;
  };
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  index: number;
}

export interface KnowledgeSearchResult {
  documentId: string;
  documentName: string;
  chunkId: string;
  content: string;
  score: number;
}

export interface KnowledgeBaseStatus {
  documentCount: number;
  totalChunks: number;
  hasEmbeddings: boolean;
  provider: string;
  ready: boolean;
}

export interface UploadProgress {
  phase: 'uploading' | 'parsing' | 'chunking' | 'embedding' | 'done' | 'error';
  progress: number;
  message: string;
}
