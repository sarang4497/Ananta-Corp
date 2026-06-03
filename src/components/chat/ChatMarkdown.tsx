import {Fragment, type ReactNode} from 'react';

/**
 * Minimal markdown for the chat bubble: paragraphs, bullet lists, **bold**, and
 * links — markdown `[text](url)`, bare `https://…` URLs, and internal `/paths`
 * (which a normal markdown lib won't autolink). Links render brand-blue and are
 * clickable. Internal links open in the same tab; external in a new one.
 */

const linkCls = 'font-medium text-blue underline-offset-2 hover:underline break-words';

function linkProps(href: string) {
  return href.startsWith('/')
    ? {href}
    : {href, target: '_blank' as const, rel: 'noopener noreferrer'};
}

// Matches: **bold** | [text](url) | bare http(s) URL | internal /path.
const TOKEN =
  /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]+)|(\/[a-zA-Z][\w/#?=&-]*)/g;

function inline(text: string, k: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(<Fragment key={`${k}t${i}`}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] !== undefined) {
      out.push(<strong key={`${k}b${i}`}>{m[1]}</strong>);
    } else if (m[2] !== undefined && m[3] !== undefined) {
      out.push(
        <a key={`${k}l${i}`} className={linkCls} {...linkProps(m[3])}>
          {m[2]}
        </a>
      );
    } else {
      const raw = (m[4] ?? m[5]) as string;
      const trail = raw.match(/[.,;:!?)]+$/)?.[0] ?? '';
      const href = trail ? raw.slice(0, raw.length - trail.length) : raw;
      out.push(
        <a key={`${k}u${i}`} className={linkCls} {...linkProps(href)}>
          {href}
        </a>
      );
      if (trail) out.push(<Fragment key={`${k}r${i}`}>{trail}</Fragment>);
    }
    last = TOKEN.lastIndex;
    i++;
  }
  if (last < text.length) out.push(<Fragment key={`${k}end`}>{text.slice(last)}</Fragment>);
  return out;
}

export function ChatMarkdown({text}: {text: string}) {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flush = () => {
    if (!list.length) return;
    const items = list;
    const id = key++;
    blocks.push(
      <ul key={`ul${id}`} className="my-1.5 ml-4 list-disc space-y-1">
        {items.map((li, j) => (
          <li key={j}>{inline(li, `u${id}_${j}`)}</li>
        ))}
      </ul>
    );
    list = [];
  };

  lines.forEach((raw, idx) => {
    const bullet = raw.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
    } else if (raw.trim() === '') {
      flush();
    } else {
      flush();
      blocks.push(
        <p key={`p${key++}`} className="my-1.5 first:mt-0 last:mb-0">
          {inline(raw, `p${idx}`)}
        </p>
      );
    }
  });
  flush();

  return <div className="text-sm leading-relaxed">{blocks}</div>;
}
