'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Lightweight Markdown Renderer ──────────────────────────────────────────
// Handles: headings, bold, italic, inline code, code blocks, bullet/numbered
// lists, tables, blockquotes, horizontal rules, and paragraphs.

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const blocks = parseBlocks(content);

  return (
    <div className={cn('space-y-3 text-[15px] leading-relaxed', className)}>
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}

// ─── Block Parser ────────────────────────────────────────────────────────────

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'quote'; text: string }
  | { type: 'hr' }
  | { type: 'paragraph'; text: string };

function parseBlocks(md: string): Block[] {
  const lines = md.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block (```lang ... ```)
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,4})\s+(.*)/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ') });
      continue;
    }

    // Table (line with | and next line with |---|)
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|[\s-:|]+\|?\s*$/.test(lines[i + 1])) {
      const headers = splitTableRow(line);
      i += 2; // skip header and separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Empty line — skip
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].match(/^(#{1,4})\s+/) &&
      !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('>') &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !(lines[i].includes('|') && i + 1 < lines.length && /^\s*\|[\s-:|]+\|?\s*$/.test(lines[i + 1]))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
  }

  return blocks;
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

// ─── Block Renderers ─────────────────────────────────────────────────────────

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      return (
        <h3
          className={cn(
            'font-bold text-slate-900 dark:text-white',
            block.level === 1 && 'text-2xl mt-1',
            block.level === 2 && 'text-xl',
            block.level === 3 && 'text-lg',
            block.level === 4 && 'text-base'
          )}
        >
          <InlineText text={block.text} />
        </h3>
      );

    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} />;

    case 'ul':
      return (
        <ul className="space-y-1.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-500" />
              <span className="flex-1">
                <InlineText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol className="space-y-1.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-sky-100 dark:bg-sky-900/40 text-xs font-bold text-sky-600 dark:text-sky-400">
                {i + 1}
              </span>
              <span className="flex-1 pt-0.5">
                <InlineText text={item} />
              </span>
            </li>
          ))}
        </ol>
      );

    case 'table':
      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80">
                {block.headers.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left font-semibold text-slate-700 dark:text-slate-200">
                    <InlineText text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-slate-100 dark:border-slate-800">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-slate-600 dark:text-slate-300">
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-sky-400 dark:border-sky-600 bg-sky-50/50 dark:bg-sky-900/20 rounded-r-lg px-4 py-2.5 italic text-slate-600 dark:text-slate-300">
          <InlineText text={block.text} />
        </blockquote>
      );

    case 'hr':
      return <hr className="border-slate-200 dark:border-slate-700" />;

    case 'paragraph':
      return (
        <p className="text-slate-700 dark:text-slate-300">
          <InlineText text={block.text} />
        </p>
      );
  }
}

// ─── Inline Text Renderer ────────────────────────────────────────────────────
// Handles: **bold**, *italic*, `code`, [links](url)

function InlineText({ text }: { text: string }) {
  const parts = parseInline(text);
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'bold') {
          return (
            <strong key={i} className="font-semibold text-slate-900 dark:text-white">
              {part.content}
            </strong>
          );
        }
        if (part.type === 'italic') {
          return (
            <em key={i} className="italic">
              {part.content}
            </em>
          );
        }
        if (part.type === 'code') {
          return (
            <code
              key={i}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[13px] font-mono text-rose-600 dark:text-rose-400"
            >
              {part.content}
            </code>
          );
        }
        if (part.type === 'link') {
          return (
            <a
              key={i}
              href={part.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 dark:text-sky-400 underline underline-offset-2 hover:text-sky-700 dark:hover:text-sky-300"
            >
              {part.content}
            </a>
          );
        }
        return <span key={i}>{part.content}</span>;
      })}
    </>
  );
}

type InlinePart =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'code'; content: string }
  | { type: 'link'; content: string; url: string };

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    if (match[2] !== undefined) {
      parts.push({ type: 'bold', content: match[2] });
    } else if (match[3] !== undefined) {
      parts.push({ type: 'italic', content: match[3] });
    } else if (match[4] !== undefined) {
      parts.push({ type: 'code', content: match[4] });
    } else if (match[5] !== undefined) {
      parts.push({ type: 'link', content: match[5], url: match[6] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
}

// ─── Code Block with Copy ─────────────────────────────────────────────────────

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {lang || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-[13px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}
