import {TOOLS, type ToolSlug} from '@/content/tools';
import {ToolCard} from './ToolCard';

export function RelatedTools({slugs, title = 'Related tools'}: {slugs: ToolSlug[]; title?: string}) {
  const tools = slugs.map((s) => TOOLS.find((t) => t.slug === s)).filter((t) => t !== undefined);
  if (!tools.length) return null;
  return (
    <section aria-labelledby="related-tools" className="border-t border-line bg-bg-soft py-12 sm:py-16">
      <div className="shell">
        <h2 id="related-tools" className="t-h3 text-ink" data-reveal="up">
          {title}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <li key={t.slug} data-reveal="up" style={{['--d' as string]: `${i * 80}ms`}}>
              <ToolCard tool={t} index={TOOLS.indexOf(t)} compact />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
