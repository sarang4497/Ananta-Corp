// PLACEHOLDER — replaced by the blog worker.
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {POSTS, postBySlug} from '@/content/blog';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string; slug: string}>};

export function generateStaticParams() {
  // Placeholder slug keeps the static export valid while POSTS is empty.
  return POSTS.length ? POSTS.map((p) => ({slug: p.slug})) : [{slug: 'mdf-vs-plywood'}];
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, slug} = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  return {title: p.title, description: p.description, alternates: buildAlternates({pathname: '/blog/[slug]', params: {slug}}, locale)};
}

export default async function PostPage({params}: Params) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const p = postBySlug(slug);
  if (!p) notFound();
  return (
    <article className="shell py-16">
      <h1 className="t-h2">{p.title}</h1>
    </article>
  );
}
