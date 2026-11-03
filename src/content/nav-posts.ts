/**
 * Latest-guide teasers for the navigation. SERVER-ONLY: importing @/content/blog
 * pulls every article body, so client components receive these teasers through
 * NavPostsProvider (rendered by the layout) instead of importing this module.
 */
import {POSTS, BLOG_CATEGORY_LABEL} from '@/content/blog';
import type {Href} from '@/data/products';
import type {NavPost} from '@/content/nav';

export const NAV_POSTS: NavPost[] = POSTS.slice(0, 3).map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  category: BLOG_CATEGORY_LABEL[p.category],
  image: p.image,
  imageAlt: p.imageAlt,
  minutes: p.readingMinutes,
  href: {pathname: '/blog/[slug]', params: {slug: p.slug}} as Href
}));
