// ─── Knowledge Base Service ───────────────────────────────────────────────────
// Document storage, chunking, and RAG-ready architecture

import type { KnowledgeDocument, DocumentType, KnowledgeBaseStatus, UploadProgress, KnowledgeSearchResult } from './types';

const STORAGE_KEY = 'ai-marketing-knowledge';

// ─── Document Parser ─────────────────────────────────────────────────────────

async function parseDocument(file: File): Promise<string> {
  const type = file.type;
  const text = await file.text();

  // For now, handle text files directly
  if (type === 'text/plain' || file.name.endsWith('.txt')) {
    return text;
  }

  // For PDFs and DOCX, we'd need proper parsers
  // For now, return a placeholder
  if (type === 'application/pdf') {
    return `[PDF Document: ${file.name}]\n\nPDF parsing requires a dedicated parser. Content will be extracted when embeddings are configured.`;
  }

  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return `[Word Document: ${file.name}]\n\nDOCX parsing requires a dedicated parser. Content will be extracted when embeddings are configured.`;
  }

  return text;
}

function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  if (text.length <= chunkSize) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

// ─── Knowledge Base Service ──────────────────────────────────────────────────

class KnowledgeBaseService {
  private documents: Map<string, KnowledgeDocument> = new Map();
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    if (this.initialized) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const docs = JSON.parse(raw) as KnowledgeDocument[];
        docs.forEach((d) => this.documents.set(d.id, d));
      }
    } catch (e) {
      console.error('Failed to load knowledge base:', e);
    }
    this.initialized = true;
  }

  private saveToStorage() {
    try {
      const docs = Array.from(this.documents.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save knowledge base:', e);
    }
  }

  getStatus(): KnowledgeBaseStatus {
    const docs = Array.from(this.documents.values());
    return {
      documentCount: docs.length,
      totalChunks: docs.reduce((sum, d) => sum + d.metadata.chunkCount, 0),
      hasEmbeddings: false,
      provider: 'local',
      ready: true,
    };
  }

  getDocuments(): KnowledgeDocument[] {
    return Array.from(this.documents.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  getDocument(id: string): KnowledgeDocument | undefined {
    return this.documents.get(id);
  }

  async uploadDocument(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<KnowledgeDocument> {
    onProgress?.({ phase: 'uploading', progress: 0, message: 'Reading file...' });
    await new Promise((r) => setTimeout(r, 100));

    onProgress?.({ phase: 'parsing', progress: 30, message: 'Parsing document...' });
    const content = await parseDocument(file);
    await new Promise((r) => setTimeout(r, 100));

    onProgress?.({ phase: 'chunking', progress: 60, message: 'Creating chunks...' });
    const chunks = chunkText(content);
    await new Promise((r) => setTimeout(r, 100));

    onProgress?.({ phase: 'embedding', progress: 80, message: 'Preparing for search...' });
    await new Promise((r) => setTimeout(r, 100));

    const doc: KnowledgeDocument = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: file.name,
      type: file.name.split('.').pop()?.toLowerCase() as DocumentType || 'txt',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      content,
      metadata: {
        chunkCount: chunks.length,
      },
    };

    this.documents.set(doc.id, doc);
    this.saveToStorage();

    onProgress?.({ phase: 'done', progress: 100, message: 'Upload complete!' });

    return doc;
  }

  deleteDocument(id: string): boolean {
    const existed = this.documents.delete(id);
    if (existed) {
      this.saveToStorage();
    }
    return existed;
  }

  clearAll(): void {
    this.documents.clear();
    this.saveToStorage();
  }

  // Simple text search - embeddings would enhance this
  search(query: string, limit = 5): KnowledgeSearchResult[] {
    const results: KnowledgeSearchResult[] = [];
    const queryLower = query.toLowerCase();
    const docsArray = Array.from(this.documents.values());

    for (const doc of docsArray) {
      const content = doc.content.toLowerCase();
      let index = content.indexOf(queryLower);

      while (index !== -1 && results.length < limit) {
        const start = Math.max(0, index - 100);
        const end = Math.min(content.length, index + query.length + 100);
        const snippet = doc.content.slice(start, end);

        results.push({
          documentId: doc.id,
          documentName: doc.name,
          chunkId: `${doc.id}-${index}`,
          content: snippet,
          score: 1 / (1 + index), // Simple relevancy score
        });

        index = content.indexOf(queryLower, index + 1);
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  // Get all content for context
  getAllContent(maxTokens = 4000): string {
    const docs = Array.from(this.documents.values());
    let content = '';

    for (const doc of docs) {
      const docContent = `[${doc.name}]\n${doc.content}\n\n`;
      if ((content.length + docContent.length) > maxTokens * 4) break;
      content += docContent;
    }

    return content;
  }
}

export const knowledgeService = new KnowledgeBaseService();
