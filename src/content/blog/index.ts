import type {BlogAudience, BlogCategory, Post} from './types';
import {mdfVsPlywood} from './posts/mdf-vs-plywood';
import {mrVsBwpPlywood} from './posts/mr-vs-bwp-plywood';
import {whatIsHdhmr} from './posts/what-is-hdhmr';
import {boardsForModularKitchens} from './posts/boards-for-modular-kitchens';
import {wardrobeMaterialsGuide} from './posts/wardrobe-materials-guide';
import {mdfThicknessGuide} from './posts/mdf-thickness-guide';
import {preLaminatedParticleBoardExplained} from './posts/pre-laminated-particle-board-explained';
import {smartLocksForInteriorProjects} from './posts/smart-locks-for-interior-projects';
import {estimatingSheetQuantities} from './posts/estimating-sheet-quantities';
import {caringForLaminatedSurfaces} from './posts/caring-for-laminated-and-veneered-surfaces';

export type {Block, BlogAudience, BlogCategory, Post, PostSource} from './types';

/** All published posts, newest first. Populated from ./posts/*. */
export const POSTS: Post[] = [
  mdfVsPlywood,
  mrVsBwpPlywood,
  whatIsHdhmr,
  boardsForModularKitchens,
  wardrobeMaterialsGuide,
  mdfThicknessGuide,
  preLaminatedParticleBoardExplained,
  smartLocksForInteriorProjects,
  estimatingSheetQuantities,
  caringForLaminatedSurfaces
].sort((a, b) => b.published.localeCompare(a.published));

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

export const BLOG_AUDIENCE_LABEL: Record<BlogAudience, string> = {
  'interior-designer': 'Interior designers',
  architect: 'Architects',
  'furniture-manufacturer': 'Furniture manufacturers',
  contractor: 'Contractors',
  builder: 'Builders',
  homeowner: 'Homeowners'
};

export function postBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function postsForProduct(productSlug: string): Post[] {
  return POSTS.filter((p) => p.relatedProducts.includes(productSlug));
}

/** Categories that actually have posts, in label order (derived, never hard-coded). */
export function blogCategoriesInUse(): {category: BlogCategory; label: string; count: number}[] {
  return (Object.keys(BLOG_CATEGORY_LABEL) as BlogCategory[])
    .map((category) => ({category, label: BLOG_CATEGORY_LABEL[category], count: POSTS.filter((p) => p.category === category).length}))
    .filter((c) => c.count > 0);
}

/** Explicit relatedPosts first, then same category, then shared products; never self. */
export function relatedPostsFor(post: Post, count = 3): Post[] {
  const picked: Post[] = [];
  const add = (p: Post | undefined) => {
    if (p && p.slug !== post.slug && !picked.includes(p)) picked.push(p);
  };
  (post.relatedPosts ?? []).forEach((s) => add(postBySlug(s)));
  POSTS.filter((p) => p.category === post.category).forEach(add);
  POSTS.filter((p) => p.relatedProducts.some((s) => post.relatedProducts.includes(s))).forEach(add);
  return picked.slice(0, count);
}

/** h2 blocks → table of contents entries. */
export function tocFor(post: Post): {id: string; text: string}[] {
  return post.blocks.flatMap((b) => (b.type === 'h2' ? [{id: b.id, text: b.text}] : []));
}
