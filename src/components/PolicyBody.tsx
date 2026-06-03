import {Fragment, type ReactNode} from 'react';

/**
 * Minimal, faithful markdown renderer for the legal policies — handles the
 * exact constructs used: ## / ### headings, paragraphs, `- ` bullet lists,
 * **bold** inline, and the one pipe table (Privacy §1.3). Long-form document
 * style: comfortable line-height, --ink text (no black), readable spacing.
 *
 * Pure rendering → Server Component (ships no JS).
 */

function inline(text: string, keyPrefix: string): ReactNode[] {
  // Split on ** for bold spans (odd segments are bold).
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>
    )
  );
}

function parseCells(row: string): string[] {
  return row
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((c) => c.trim());
}

function Table({lines, idx}: {lines: string[]; idx: number}) {
  // [0] = header row, [1] = |---| separator, [2..] = body rows.
  const header = parseCells(lines[0]);
  const body = lines.slice(2).map(parseCells);
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-bg-soft">
            {header.map((h, j) => (
              <th key={j} className="border-b border-border px-4 py-2.5 align-top font-semibold text-ink">
                {inline(h, `th-${idx}-${j}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri} className="border-b border-border last:border-0">
              {r.map((c, ci) => (
                <td key={ci} className="px-4 py-2.5 align-top leading-[1.6] text-ink/80">
                  {inline(c, `td-${idx}-${ri}-${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PolicyBody({content}: {content: string}) {
  const lines = content.split('\n');
  const out: ReactNode[] = [];
  let listBuf: string[] = [];
  let i = 0;

  function flushList() {
    if (listBuf.length === 0) return;
    const items = listBuf;
    const key = out.length;
    out.push(
      <ul key={`ul-${key}`} className="my-4 list-disc space-y-2 pl-6 marker:text-indigo">
        {items.map((li, j) => (
          <li key={j} className="leading-[1.7] text-ink/80">
            {inline(li, `li-${key}-${j}`)}
          </li>
        ))}
      </ul>
    );
    listBuf = [];
  }

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line === '') {
      flushList();
      i += 1;
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      out.push(
        <h3 key={`h3-${out.length}`} className="mb-2 mt-7 text-lg font-semibold text-ink">
          {inline(line.slice(4), `h3-${out.length}`)}
        </h3>
      );
      i += 1;
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      out.push(
        <h2 key={`h2-${out.length}`} className="mb-3 mt-10 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {inline(line.slice(3), `h2-${out.length}`)}
        </h2>
      );
      i += 1;
      continue;
    }
    if (line.startsWith('- ')) {
      listBuf.push(line.slice(2));
      i += 1;
      continue;
    }
    if (line.includes('|')) {
      flushList();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().includes('|')) {
        tableLines.push(lines[i].trim());
        i += 1;
      }
      out.push(<Table key={`tbl-${out.length}`} lines={tableLines} idx={out.length} />);
      continue;
    }
    // paragraph (single line)
    flushList();
    out.push(
      <p key={`p-${out.length}`} className="my-4 leading-[1.75] text-ink/80">
        {inline(line, `p-${out.length}`)}
      </p>
    );
    i += 1;
  }
  flushList();

  return <>{out}</>;
}
