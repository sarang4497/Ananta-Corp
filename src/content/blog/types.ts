/**
 * Blog / Resources contract — shared by the blog routes, site search, the
 * assistant, the mega navigation and the sitemap. ONE source: posts live in
 * src/content/blog/posts/*.ts and are collected in ./index.ts.
 *
 * CONTENT RULE: every post separates GENERAL education (callout tone
 * 'general', or plain prose) from ANANTA-SPECIFIC product data, which must
 * come from src/data/products.ts (link via `products` blocks / relatedProducts,
 * never restate specs that are not in the catalogue).
 */
import type {Application} from '@/data/products';

export type BlogCategory =
  | 'plywood-guide'
  | 'mdf-guide'
  | 'moisture-resistant'
  | 'furniture-manufacturing'
  | 'interior-materials'
  | 'comparisons'
  | 'buying-guides'
  | 'project-sourcing'
  | 'smart-locks'
  | 'maintenance';

export type BlogAudience =
  | 'interior-designer'
  | 'architect'
  | 'furniture-manufacturer'
  | 'contractor'
  | 'builder'
  | 'homeowner';

export type Block =
  | {type: 'p'; text: string}
  | {type: 'h2'; text: string; id: string}
  | {type: 'h3'; text: string}
  | {type: 'list'; items: string[]; ordered?: boolean}
  | {type: 'table'; caption?: string; head: string[]; rows: string[][]}
  | {type: 'callout'; tone: 'general' | 'ananta' | 'caution'; title?: string; text: string}
  /** Renders live product cards from the catalogue — never hand-written specs. */
  | {type: 'products'; slugs: string[]; title?: string}
  | {type: 'figure'; src: string; alt: string; caption?: string};

export type PostSource = {label: string; url?: string; kind: 'ananta' | 'manufacturer' | 'general'};

export type Post = {
  slug: string;
  title: string;
  /** Meta description, ≤ 160 chars. */
  description: string;
  /** Card/teaser text, 1–2 sentences. */
  excerpt: string;
  category: BlogCategory;
  audiences: BlogAudience[];
  applications?: Application[];
  /** ISO date. */
  published: string;
  updated?: string;
  readingMinutes: number;
  /** Image under /public (existing Ananta imagery only). */
  image: string;
  imageAlt: string;
  blocks: Block[];
  faqs: {q: string; a: string}[];
  /** Product slugs from src/data/products.ts. */
  relatedProducts: string[];
  relatedPosts?: string[];
  /** Tool slugs from src/content/tools.ts. */
  relatedTools?: string[];
  sources: PostSource[];
};
