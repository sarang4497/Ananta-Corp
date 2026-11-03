// PLACEHOLDER — replaced by the blog worker.
import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {POSTS} from '@/content/blog';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {title: 'Resources & Insights', description: 'Material guides from Ananta Corporation.', alternates: buildAlternates('/blog', locale)};
}

export default async function BlogHub({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <section className="shell py-16">
      <h1 className="t-h2">Resources &amp; Insights</h1>
      <ul className="mt-6 grid gap-3">
        {POSTS.map((p) => (
          <li key={p.slug}>
            <Link href={{pathname: '/blog/[slug]', params: {slug: p.slug}}}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
