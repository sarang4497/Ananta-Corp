import type {BlogCategory, Post} from './types';

export type {Block, BlogAudience, BlogCategory, Post, PostSource} from './types';

/** All published posts, newest first. Populated from ./posts/*. */
export const POSTS: Post[] = [];

export const BLOG_CATEGORY_LABEL: Record<BlogCategory, string> = {
  'plywood-guide': 'Plywood Guide',
  'mdf-guide': 'MDF Guide',
  'moisture-resistant': 'Moisture-Resistant Boards',
  'furniture-manufacturing': 'Furniture Manufacturing',
  'interior-materials': 'Interior Materials',
  comparisons: 'Product Comparisons',
  'buying-guides': 'Buying Guides',
  'project-sourcing': 'Project Sourcing',
  'smart-locks': 'Smart Locks',
  maintenance: 'Maintenance'
};

export function postBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function postsForProduct(productSlug: string): Post[] {
  return POSTS.filter((p) => p.relatedProducts.includes(productSlug));
}
