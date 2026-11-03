import {Fragment, type ReactNode} from 'react';
import NextLink from 'next/link';

/**
 * Minimal inline markup for post copy: [label](/internal/path) and **bold**.
 * Internal paths only (validated by tests/unit/blog.test.ts).
 */
export function Inline({text}: {text: string}) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1]) {
      out.push(
        <NextLink key={i++} href={m[2]} className="font-medium text-indigo underline decoration-indigo/30 underline-offset-[3px] hover:decoration-indigo">
          {m[1]}
        </NextLink>
      );
    } else {
      out.push(
        <strong key={i++} className="font-semibold text-ink">
          {m[3]}
        </strong>
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}
