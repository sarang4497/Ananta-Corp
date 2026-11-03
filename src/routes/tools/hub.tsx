// PLACEHOLDER — replaced by the tools worker.
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {TOOLS} from '@/content/tools';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {title: 'Tools', description: 'Interactive material tools from Ananta Corporation.', alternates: buildAlternates('/tools', locale)};
}

export default async function ToolsHub({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <section className="shell py-16">
      <h1 className="t-h2">Tools</h1>
      <ul className="mt-6 grid gap-3">
        {TOOLS.map((t) => (
          <li key={t.slug}>
            <Link href={t.href}>{t.name}</Link> — {t.description}
          </li>
        ))}
      </ul>
    </section>
  );
}
