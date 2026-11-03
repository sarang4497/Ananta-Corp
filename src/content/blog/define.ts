import type {Block, Post} from './types';

/** Plain text of a post body (inline link/bold markup stripped). */
export function blockText(b: Block): string {
  switch (b.type) {
    case 'p':
    case 'h2':
    case 'h3':
      return b.text;
    case 'callout':
      return `${b.title ?? ''} ${b.text}`;
    case 'list':
      return b.items.join(' ');
    case 'table':
      return [b.caption ?? '', ...b.head, ...b.rows.flat()].join(' ');
    case 'figure':
      return b.caption ?? '';
    default:
      return '';
  }
}

export function stripInline(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
}

export function wordCount(blocks: Block[], faqs: {q: string; a: string}[] = []): number {
  const text = [...blocks.map(blockText), ...faqs.flatMap((f) => [f.q, f.a])].map(stripInline).join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/** Reading time from the real body length (~200 wpm for technical prose). */
export function definePost(p: Omit<Post, 'readingMinutes'>): Post {
  return {...p, readingMinutes: Math.max(1, Math.round(wordCount(p.blocks, p.faqs) / 200))};
}
