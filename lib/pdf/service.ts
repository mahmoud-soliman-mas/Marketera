'use client';

import type { HistoryItem } from '@/lib/history';
import type { Language } from '@/lib/translations';
import type { ToolMeta } from '@/lib/tools';

export interface PDFOptions {
  title?: string;
  subtitle?: string;
  toolName?: string;
  toolDescription?: string;
  language?: Language;
  onProgress?: (progress: number) => void;
}

export interface PDFContent {
  title?: string;
  sections: PDFSection[];
}

export interface PDFSection {
  title?: string;
  content: string | PDFContentItem[];
}

export interface PDFContentItem {
  type: 'text' | 'heading' | 'bullet' | 'numbered' | 'divider' | 'card';
  text: string;
  level?: number;
  number?: number;
  rtl?: boolean;
}

export type HistoryExportFormat = 'pdf' | 'txt';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

const COLORS = {
  primary: '#0ea5e9',
  primaryDark: '#0284c7',
  secondary: '#06b6d4',
  text: '#1e293b',
  textLight: '#64748b',
  textMuted: '#94a3b8',
  background: '#f8fafc',
  backgroundDark: '#e2e8f0',
  border: '#e2e8f0',
  white: '#ffffff',
  headerBg: '#0ea5e9',
  headerText: '#ffffff',
  success: '#10b981',
};

const ARABIC_CHARS = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function detectContentLanguage(text: string): Language {
  if (!text) return 'en';
  const arabicCount = (text.match(ARABIC_CHARS) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  const arabicRatio = totalChars > 0 ? arabicCount / totalChars : 0;
  return arabicRatio > 0.3 ? 'ar' : 'en';
}

export function isRTL(text: string): boolean {
  return detectContentLanguage(text) === 'ar';
}

function processTextForRTL(text: string): string {
  if (!text) return '';
  return text;
}

function createTextObject(text: string, options: {
  fontSize?: number;
  bold?: boolean;
  color?: string;
  alignment?: 'left' | 'right' | 'center' | 'justify';
  rtl?: boolean;
  margin?: [number, number, number, number];
  lineHeight?: number;
} = {}): Record<string, unknown> {
  const {
    fontSize = 11,
    bold = false,
    color = COLORS.text,
    alignment: _alignment,
    rtl = false,
    margin,
    lineHeight = 1.4,
  } = options;

  const alignment = _alignment || (rtl ? 'right' : 'left');

  return {
    text: rtl ? text : text,
    fontSize,
    bold,
    color,
    alignment,
    margin: margin || [0, 4, 0, 4],
    lineHeight,
    ...(rtl && { preserveNL: true }),
  };
}

function createHeaderContent(options: PDFOptions): Record<string, unknown>[] {
  const isArabic = options.language === 'ar';
  const content: Record<string, unknown>[] = [];

  content.push({
    columns: [
      {
        width: 50,
        stack: [
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 36,
                h: 36,
                r: 8,
                color: COLORS.primary,
              },
            ],
            margin: [0, 0, 0, 0],
          },
        ],
      },
      {
        width: '*',
        stack: [
          {
            text: options.title || 'Marketra AI',
            fontSize: 20,
            bold: true,
            color: COLORS.text,
            margin: [0, 0, 0, 4],
          },
          {
            text: options.subtitle || (isArabic ? 'تقرير المحتوى المُنشأ' : 'Generated Content Report'),
            fontSize: 12,
            color: COLORS.textLight,
            margin: [0, 0, 0, 0],
          },
        ],
        margin: [10, 5, 0, 0],
      },
    ],
    margin: [0, 0, 0, 20],
  });

  if (options.toolName) {
    content.push({
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: CONTENT_WIDTH,
          h: 40,
          r: 8,
          color: COLORS.background,
        },
      ],
      margin: [0, 0, 0, 10],
    });

    content.push({
      columns: [
        {
          width: '*',
          stack: [
            {
              text: options.toolName,
              fontSize: 14,
              bold: true,
              color: COLORS.primary,
              margin: [0, 0, 0, 4],
            },
            ...(options.toolDescription ? [{
              text: options.toolDescription,
              fontSize: 10,
              color: COLORS.textLight,
              margin: [0, 0, 0, 0],
            }] : []),
          ],
          margin: [15, -35, 0, 0],
        },
      ],
      margin: [0, 0, 0, 15],
    });
  }

  content.push({
    canvas: [
      {
        type: 'line',
        x1: 0,
        y1: 0,
        x2: CONTENT_WIDTH,
        y2: 0,
        lineWidth: 1,
        lineColor: COLORS.border,
      },
    ],
    margin: [0, 0, 0, 20],
  });

  const dateStr = new Date().toLocaleString(
    isArabic ? 'ar-SA' : 'en-US',
    { dateStyle: 'full', timeStyle: 'short' }
  );

  content.push({
    columns: [
      {
        width: '*',
        text: isArabic ? `التاريخ: ${dateStr}` : `Generated: ${dateStr}`,
        fontSize: 9,
        color: COLORS.textMuted,
        alignment: 'left',
      },
    ],
    margin: [0, 0, 0, 20],
  });

  return content;
}

function createFooterContent(pageNumber: number, pageCount: number, isArabic: boolean): Record<string, unknown>[] {
  return [
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: CONTENT_WIDTH,
          y2: 0,
          lineWidth: 0.5,
          lineColor: COLORS.border,
        },
      ],
      margin: [0, 10, 0, 5],
    },
    {
      columns: [
        {
          width: '*',
          text: isArabic ? 'مدعوم من MW' : 'Powered by MW',
          fontSize: 8,
          color: COLORS.primary,
          alignment: 'left',
        },
        {
          width: 'auto',
          text: isArabic
            ? `صفحة ${pageNumber} من ${pageCount}`
            : `Page ${pageNumber} of ${pageCount}`,
          fontSize: 8,
          color: COLORS.textMuted,
          alignment: 'right',
        },
      ],
      margin: [0, 5, 0, 0],
    },
  ];
}

function createSectionContent(section: PDFSection, index: number): Record<string, unknown>[] {
  const content: Record<string, unknown>[] = [];
  const sectionRTL = typeof section.content === 'string' ? isRTL(section.content) : false;

  if (section.title) {
    if (index > 0) {
      content.push({
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: CONTENT_WIDTH,
            y2: 0,
            lineWidth: 0.5,
            lineColor: COLORS.border,
          },
        ],
        margin: [0, 15, 0, 15],
      });
    }

    content.push({
      text: section.title,
      fontSize: 13,
      bold: true,
      color: COLORS.text,
      margin: [0, 0, 0, 10],
      alignment: sectionRTL ? 'right' : 'left',
    });
  }

  if (typeof section.content === 'string') {
    const lines = section.content.split('\n').filter(l => l.trim());
    const detectedRTL = isRTL(section.content);

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      const isNumbered = /^[\d]+[\.\)]\s/.test(trimmedLine);
      const isBullet = /^[•\-\*]\s/.test(trimmedLine);
      const isHeading = /^[#]+\s/.test(trimmedLine);
      const lineRTL = isRTL(trimmedLine);

      if (isHeading) {
        const level = (trimmedLine.match(/^#+/) || ['#'])[0].length;
        const text = trimmedLine.replace(/^#+\s*/, '');
        content.push({
          text: text,
          fontSize: Math.max(14 - level, 11),
          bold: true,
          color: COLORS.text,
          margin: [0, 8, 0, 6],
          alignment: lineRTL ? 'right' : 'left',
        });
      } else if (isNumbered) {
        const match = trimmedLine.match(/^([\d]+)[\.\)]\s*(.*)$/);
        if (match) {
          content.push({
            columns: [
              {
                width: 25,
                text: match[1] + '.',
                fontSize: 10,
                color: COLORS.primary,
                bold: true,
                alignment: lineRTL ? 'left' : 'right',
              },
              {
                width: '*',
                text: match[2],
                fontSize: 10,
                color: COLORS.text,
                alignment: lineRTL ? 'right' : 'left',
              },
            ],
            margin: [0, 4, 0, 4],
            ...(lineRTL ? { rtl: true, columnGap: 5 } : { columnGap: 5 }),
          });
        }
      } else if (isBullet) {
        const text = trimmedLine.replace(/^[•\-\*]\s*/, '');
        content.push({
          columns: [
            {
              width: 15,
              text: lineRTL ? '•' : '•',
              fontSize: 10,
              color: COLORS.primary,
              alignment: lineRTL ? 'left' : 'right',
            },
            {
              width: '*',
              text: text,
              fontSize: 10,
              color: COLORS.text,
              alignment: lineRTL ? 'right' : 'left',
            },
          ],
          margin: [0, 3, 0, 3],
          columnGap: 5,
        });
      } else {
        content.push({
          text: trimmedLine,
          fontSize: 10,
          color: COLORS.text,
          margin: [0, 3, 0, 3],
          alignment: lineRTL ? 'right' : 'left',
          lineHeight: 1.5,
        });
      }
    });
  } else if (Array.isArray(section.content)) {
    section.content.forEach((item) => {
      const itemRTL = item.rtl ?? isRTL(item.text);

      switch (item.type) {
        case 'heading':
          content.push({
            text: item.text,
            fontSize: item.level === 1 ? 14 : item.level === 2 ? 12 : 11,
            bold: true,
            color: item.level === 1 ? COLORS.primary : COLORS.text,
            margin: [0, 10, 0, 6],
            alignment: itemRTL ? 'right' : 'left',
          });
          break;

        case 'bullet':
          content.push({
            columns: [
              {
                width: 15,
                text: itemRTL ? '•' : '•',
                fontSize: 10,
                color: COLORS.primary,
                alignment: itemRTL ? 'left' : 'right',
              },
              {
                width: '*',
                text: item.text,
                fontSize: 10,
                color: COLORS.text,
                alignment: itemRTL ? 'right' : 'left',
              },
            ],
            margin: [0, 3, 0, 3],
            columnGap: 5,
          });
          break;

        case 'numbered':
          content.push({
            columns: [
              {
                width: 25,
                text: `${item.number}.`,
                fontSize: 10,
                color: COLORS.primary,
                bold: true,
                alignment: itemRTL ? 'left' : 'right',
              },
              {
                width: '*',
                text: item.text,
                fontSize: 10,
                color: COLORS.text,
                alignment: itemRTL ? 'right' : 'left',
              },
            ],
            margin: [0, 4, 0, 4],
            columnGap: 5,
          });
          break;

        case 'divider':
          content.push({
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: CONTENT_WIDTH,
                y2: 0,
                lineWidth: 0.5,
                lineColor: COLORS.border,
              },
            ],
            margin: [0, 10, 0, 10],
          });
          break;

        case 'card':
          content.push({
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: CONTENT_WIDTH,
                h: 50,
                r: 6,
                color: COLORS.background,
              },
            ],
            margin: [0, 0, 0, 5],
          });
          content.push({
            text: item.text,
            fontSize: 10,
            color: COLORS.text,
            margin: [15, -35, 15, 0],
            alignment: itemRTL ? 'right' : 'left',
          });
          content.push({ text: '', margin: [0, 20, 0, 0] });
          break;

        default:
          content.push({
            text: item.text,
            fontSize: 10,
            color: COLORS.text,
            margin: [0, 3, 0, 3],
            alignment: itemRTL ? 'right' : 'left',
            lineHeight: 1.5,
          });
      }
    });
  }

  return content;
}

function createDocumentDefinition(
  content: PDFContent,
  options: PDFOptions
): unknown {
  const isArabic = options.language === 'ar';
  const allContent: Record<string, unknown>[] = [];

  allContent.push(...createHeaderContent(options));

  content.sections.forEach((section, index) => {
    allContent.push(...createSectionContent(section, index));
  });

  return {
    pageSize: 'A4',
    pageMargins: [MARGIN, 60, MARGIN, 60],
    content: allContent,
    defaultStyle: {
      font: 'Roboto',
      fontSize: 11,
      color: COLORS.text,
      lineHeight: 1.4,
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: COLORS.text,
      },
      subheader: {
        fontSize: 13,
        bold: true,
        color: COLORS.primary,
      },
      body: {
        fontSize: 11,
        color: COLORS.text,
        lineHeight: 1.5,
      },
    },
    footer: (currentPage: number, pageCount: number) => ({
      stack: createFooterContent(currentPage, pageCount, isArabic),
      margin: [MARGIN, 0, MARGIN, 0],
    }),
    header: {
      text: '',
      margin: [MARGIN, 20, MARGIN, 0],
    },
  };
}

export async function generatePDF(
  content: PDFContent,
  options: PDFOptions = {}
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfMake = require('pdfmake/build/pdfmake');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const vfsFonts = require('pdfmake/build/vfs_fonts');

  pdfMake.vfs = vfsFonts.pdfMake.vfs;

  if (!options.language) {
    const allText = content.sections
      .map(s => typeof s.content === 'string' ? s.content : s.content.map(c => c.text).join(' '))
      .join(' ');
    options.language = detectContentLanguage(allText);
  }

  const docDefinition = createDocumentDefinition(content, options);

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  return new Promise((resolve, reject) => {
    pdfDocGenerator.download(
      `marketra-${Date.now()}.pdf`,
      () => {
        resolve();
      },
      (error: Error) => {
        reject(error);
      }
    );
  });
}

export function historyItemToPDFContent(
  item: HistoryItem,
  tool?: ToolMeta,
  language?: Language
): PDFContent {
  const sections: PDFSection[] = [];
  const isArabic = language === 'ar' || detectContentLanguage(item.label) === 'ar';

  const headerContent: PDFContentItem[] = [];

  if (tool) {
    const toolName = isArabic ? tool.labelAr : tool.label;
    const createdAt = new Date(item.createdAt).toLocaleString(
      isArabic ? 'ar-SA' : 'en-US',
      { dateStyle: 'medium', timeStyle: 'short' }
    );
    headerContent.push({
      type: 'text',
      text: isArabic
        ? `الأداة: ${toolName}`
        : `Tool: ${toolName}`,
      rtl: isArabic,
    });
    headerContent.push({
      type: 'text',
      text: isArabic
        ? `التاريخ: ${createdAt}`
        : `Date: ${createdAt}`,
      rtl: isArabic,
    });
    headerContent.push({ type: 'divider', text: '' });
  }

  sections.push({
    title: item.label,
    content: headerContent,
  });

  const resultsContent: PDFContentItem[] = [];

  if (Array.isArray(item.results)) {
    if (item.type === 'hooks' || item.type === 'content-ideas') {
      (item.results as string[]).forEach((result, index) => {
        resultsContent.push({
          type: 'numbered',
          text: result,
          number: index + 1,
          rtl: isRTL(result),
        });
      });
    } else if (typeof item.results[0] === 'object' && item.results[0] !== null) {
      const resultObj = item.results[0] as Record<string, unknown>;

      Object.entries(resultObj).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());

          resultsContent.push({
            type: 'heading',
            text: label,
            level: 2,
            rtl: isRTL(value),
          });

          const lines = value.split('\n').filter(l => l.trim());
          lines.forEach(line => {
            resultsContent.push({
              type: 'text',
              text: line.trim(),
              rtl: isRTL(line),
            });
          });
        }
      });
    } else {
      (item.results as string[]).forEach((result, index) => {
        resultsContent.push({
          type: 'numbered',
          text: result,
          number: index + 1,
          rtl: isRTL(result),
        });
      });
    }
  }

  sections.push({
    title: isArabic ? 'النتائج' : 'Results',
    content: resultsContent,
  });

  return { sections };
}

export function historyItemsToPDFContent(
  items: HistoryItem[],
  tools: ToolMeta[],
  language?: Language
): PDFContent {
  const isArabic = language === 'ar' || items.some(i => isRTL(i.label));

  const sections: PDFSection[] = items.map((item, index) => {
    const tool = tools.find(t => t.id === item.type);
    const content: PDFContentItem[] = [];

    const createdAt = new Date(item.createdAt).toLocaleString(
      isArabic ? 'ar-SA' : 'en-US',
      { dateStyle: 'medium', timeStyle: 'short' }
    );

    if (tool) {
      const toolName = isArabic ? (tool.shortLabelAr || tool.labelAr) : (tool.shortLabel || tool.label);
      content.push({
        type: 'text',
        text: isArabic ? `الأداة: ${toolName}` : `Tool: ${toolName}`,
        rtl: isArabic,
      });
    }

    content.push({
      type: 'text',
      text: isArabic ? `التاريخ: ${createdAt}` : `Date: ${createdAt}`,
      rtl: isArabic,
    });

    content.push({ type: 'divider', text: '' });

    if (Array.isArray(item.results)) {
      if (item.type === 'hooks' || item.type === 'content-ideas') {
        (item.results as string[]).forEach((result, idx) => {
          content.push({
            type: 'numbered',
            text: result,
            number: idx + 1,
            rtl: isRTL(result),
          });
        });
      } else if (typeof item.results[0] === 'object' && item.results[0] !== null) {
        const resultObj = item.results[0] as Record<string, unknown>;
        Object.entries(resultObj).forEach(([key, value]) => {
          if (value && typeof value === 'string') {
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());

            content.push({
              type: 'heading',
              text: label,
              level: 2,
              rtl: isRTL(value),
            });

            const lines = value.split('\n').filter(l => l.trim());
            lines.forEach(line => {
              content.push({
                type: 'text',
                text: line.trim(),
                rtl: isRTL(line),
              });
            });
          }
        });
      } else {
        (item.results as string[]).forEach((result, idx) => {
          content.push({
            type: 'numbered',
            text: result,
            number: idx + 1,
            rtl: isRTL(result),
          });
        });
      }
    }

    return {
      title: item.label,
      content,
    };
  });

  return { sections };
}

export async function exportHistoryToPDF(
  items: HistoryItem[],
  tools: ToolMeta[],
  options: PDFOptions = {}
): Promise<void> {
  if (!items.length) {
    throw new Error('No items to export');
  }

  const isArabic = options.language === 'ar' || items.some(i => isRTL(i.label));

  const content = historyItemsToPDFContent(items, tools, options.language);

  const enhancedOptions: PDFOptions = {
    ...options,
    title: isArabic ? 'سجل التوليدات' : 'Generation History',
    subtitle: isArabic
      ? `${items.length} عناصر محفوظة`
      : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`,
  };

  return generatePDF(content, enhancedOptions);
}

export async function exportSingleItemToPDF(
  item: HistoryItem,
  tool?: ToolMeta,
  options: PDFOptions = {}
): Promise<void> {
  const content = historyItemToPDFContent(item, tool, options.language);

  const isArabic = options.language === 'ar' || isRTL(item.label);

  const enhancedOptions: PDFOptions = {
    ...options,
    title: item.label,
    toolName: tool ? (isArabic ? tool.labelAr : tool.label) : undefined,
    toolDescription: tool ? (isArabic ? tool.descriptionAr : tool.description) : undefined,
  };

  return generatePDF(content, enhancedOptions);
}

export { ARABIC_CHARS };
