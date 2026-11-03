import {siteUrl} from '@/config';
import {COMPANY} from '@/content/site';
import type {Post} from '@/content/blog/types';
import {BLOG_CATEGORY_LABEL} from '@/content/blog';
import {wordCount} from '@/content/blog/define';

/**
 * Article + FAQPage structured data for /blog/[slug]. Only facts from the
 * post record itself; the publisher is the Organization node from the layout.
 */
export function articleJsonLd(p: Post, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.description,
    image: [`${siteUrl}${p.image}`],
    datePublished: p.published,
    dateModified: p.updated ?? p.published,
    inLanguage: 'en-IN',
    mainEntityOfPage: {'@type': 'WebPage', '@id': url},
    url,
    author: {'@type': 'Organization', name: COMPANY.name, url: siteUrl},
    publisher: {'@type': 'Organization', '@id': `${siteUrl}/#organization`, name: COMPANY.name, logo: {'@type': 'ImageObject', url: `${siteUrl}/images/logo/Ananta-Logo.png`}},
    articleSection: BLOG_CATEGORY_LABEL[p.category],
    wordCount: wordCount(p.blocks, p.faqs)
  };
}

export function faqJsonLd(faqs: {q: string; a: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({'@type': 'Question', name: f.q, acceptedAnswer: {'@type': 'Answer', text: f.a}}))
  };
}
