// PLACEHOLDER — replaced by the tools worker.
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {TOOLS, toolBySlug} from '@/content/tools';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string; tool: string}>};

export function generateStaticParams() {
  return TOOLS.filter((t) => t.route).map((t) => ({tool: t.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, tool} = await params;
  const t = toolBySlug(tool);
  if (!t) return {};
  return {title: t.name, description: t.description, alternates: buildAlternates({pathname: '/tools/[tool]', params: {tool}}, locale)};
}

export default async function ToolPage({params}: Params) {
  const {locale, tool} = await params;
  setRequestLocale(locale);
  const t = toolBySlug(tool);
  if (!t || !t.route) notFound();
  return (
    <section className="shell py-16">
      <h1 className="t-h2">{t.name}</h1>
      <p className="mt-4">{t.description}</p>
    </section>
  );
}
