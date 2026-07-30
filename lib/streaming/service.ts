// ─── Streaming Service ───────────────────────────────────────────────────────
// Handles streaming responses with typing animation support

export type StreamStatus = 'idle' | 'streaming' | 'done' | 'error' | 'stopped';

export interface StreamState {
  status: StreamStatus;
  content: string;
  error?: string;
}

export interface StreamingOptions {
  onToken?: (token: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: string) => void;
  typingSpeed?: number; // ms per character for visual effect
}

// ─── Text Stream Handler ──────────────────────────────────────────────────────

export class TextStreamer {
  private content: string = '';
  private status: StreamStatus = 'idle';
  private abortController: AbortController | null = null;
  private listeners: Set<(state: StreamState) => void> = new Set();

  subscribe(listener: (state: StreamState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state: StreamState = {
      status: this.status,
      content: this.content,
    };
    this.listeners.forEach((l) => l(state));
  }

  getStatus(): StreamStatus {
    return this.status;
  }

  getContent(): string {
    return this.content;
  }

  stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.status = 'stopped';
      this.notify();
    }
  }

  reset() {
    this.content = '';
    this.status = 'idle';
    this.abortController = null;
    this.notify();
  }

  async streamFromResponse(response: Response, options?: StreamingOptions): Promise<string> {
    this.content = '';
    this.status = 'streaming';
    this.abortController = new AbortController();
    this.notify();

    try {
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        this.content += buffer;
        options?.onToken?.(buffer);
        buffer = '';
        this.notify();
      }

      this.status = 'done';
      options?.onComplete?.(this.content);
      this.notify();
      return this.content;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        this.status = 'stopped';
      } else {
        this.status = 'error';
        options?.onError?.((err as Error).message);
      }
      this.notify();
      throw err;
    }
  }

  // Simulate typing effect for non-streaming responses
  async simulateTyping(content: string, speed = 10, onToken?: (char: string) => void): Promise<string> {
    this.content = '';
    this.status = 'streaming';
    this.notify();

    for (let i = 0; i < content.length; i++) {
      if (this.abortController?.signal.aborted) break;
      this.content += content[i];
      onToken?.(content[i]);
      this.notify();
      await new Promise((r) => setTimeout(r, speed));
    }

    this.status = 'done';
    this.notify();
    return this.content;
  }
}

// ─── Streaming Hook for React ────────────────────────────────────────────────

export interface UseStreamingReturn {
  content: string;
  status: StreamStatus;
  isStreaming: boolean;
  isDone: boolean;
  error: string | null;
  stop: () => void;
  reset: () => void;
}

// Factory for creating streamers
export function createStreamer(): TextStreamer {
  return new TextStreamer();
}
