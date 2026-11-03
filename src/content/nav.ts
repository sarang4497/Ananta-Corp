/**
 * Navigation model — ONE typed structure used by the desktop mega navigation,
 * the mobile menu and the footer. Everything is DERIVED from the shared data
 * modules (products.ts, stats.ts, categories.ts, site.ts, tools.ts, blog);
 * no fact, count or label is duplicated here.
 */
import {CATEGORIES, PRODUCTS, categoryHref, productHref, subcategoryHref, type Application, type Brand, type CategorySlug, type Href} from '@/data/products';
import {BRANDS, STATS, countByApplication, countByBrand, countByCategory} from '@/data/stats';
import {CATEGORY_COPY, SUB_NAMES} from '@/content/categories';
import {APPLICATIONS, BRAND_ASSETS, COMPANY} from '@/content/site';
import {TOOLS, type Tool} from '@/content/tools';

export type NavLink = {label: string; href: Href; count?: number};

export type NavCategory = {
  slug: CategorySlug;
  name: string;
  short: string;
  what: string;
  bestFor: string;
  image: string;
  count: number;
  brands: Brand[];
  href: Href;
  /** Subcategories when there is more than one, otherwise empty. */
  subs: NavLink[];
  /** Up to 4 products in catalogue order. */
  top: NavLink[];
};

export const NAV_CATEGORIES: NavCategory[] = CATEGORIES.map((c) => {
  const copy = CATEGORY_COPY[c.slug];
  const products = PRODUCTS.filter((p) => p.category === c.slug);
  return {
    slug: c.slug,
    name: copy.name,
    short: copy.short,
    what: copy.what,
    bestFor: copy.bestFor,
    image: c.image,
    count: countByCategory(c.slug),
    brands: copy.brands,
    href: categoryHref(c.slug),
    subs:
      c.subs.length > 1
        ? c.subs.map((s) => ({
            label: SUB_NAMES[s.slug] ?? s.slug,
            href: subcategoryHref(c.slug, s.slug),
            count: products.filter((p) => p.subcategory === s.slug).length
          }))
        : [],
    top: products.slice(0, 4).map((p) => ({label: p.short, href: productHref(p)}))
  };
});

export type NavBrand = {
  brand: Brand;
  slug: string;
  relation: string;
  supplies: string;
  count: number;
  categories: NavLink[];
  href: Href;
  productsHref: Href;
};

export const NAV_BRANDS: NavBrand[] = BRANDS.map((b) => {
  const cats = [...new Set(PRODUCTS.filter((p) => p.brand === b).map((p) => p.category))];
  return {
    brand: b,
    slug: BRAND_ASSETS[b].slug,
    relation: BRAND_ASSETS[b].relation,
    supplies: BRAND_ASSETS[b].supplies,
    count: countByBrand(b),
    categories: cats.map((c) => ({
      label: CATEGORY_COPY[c].name,
      href: categoryHref(c),
      count: PRODUCTS.filter((p) => p.brand === b && p.category === c).length
    })),
    href: {pathname: '/partners', hash: BRAND_ASSETS[b].slug} as Href,
    productsHref: {pathname: '/products', query: {brand: b}} as Href
  };
});

export type NavApplication = {key: Application; label: string; hint: string; count: number; href: Href};

/** Only applications that at least one product actually lists. */
export const NAV_APPLICATIONS: NavApplication[] = APPLICATIONS.filter((a) => countByApplication(a.key) > 0).map((a) => ({
  key: a.key,
  label: a.label,
  hint: a.hint,
  count: countByApplication(a.key),
  href: {pathname: '/products', query: {app: a.key}} as Href
}));

export const NAV_TOOLS: Tool[] = TOOLS;

export type NavPost = {slug: string; title: string; excerpt: string; category: string; image: string; imageAlt: string; minutes: number; href: Href};

// NAV_POSTS lives in ./nav-posts.ts (server-only: importing POSTS here would ship every article body to the client).


export const NAV_RESOURCES: NavLink[] = [
  {label: 'Guides & articles', href: '/blog'},
  {label: 'Décor library', href: '/decor', count: STATS.decors},
  {label: 'All tools', href: '/tools', count: TOOLS.length}
];

export const NAV_COMPANY: NavLink[] = [
  {label: 'About Ananta', href: '/about'},
  {label: 'Brands we supply', href: '/partners'},
  {label: 'Contact', href: '/contact'}
];

export const NAV_LEGAL: NavLink[] = [
  {label: 'Privacy', href: '/privacy'},
  {label: 'Terms', href: '/terms'}
];

export type MenuId = 'products' | 'brands' | 'applications' | 'tools' | 'resources';

/** Top-level desktop menu order. Items with `panel` open a mega panel. */
export const NAV_MENUS: ({id: MenuId; label: string; panel: true; href: Href} | {id: string; label: string; panel: false; href: Href})[] = [
  {id: 'products', label: 'Products', panel: true, href: '/products'},
  {id: 'brands', label: 'Brands', panel: true, href: '/partners'},
  {id: 'applications', label: 'Applications', panel: true, href: '/products'},
  {id: 'tools', label: 'Tools', panel: true, href: '/tools'},
  {id: 'resources', label: 'Resources', panel: true, href: '/blog'},
  {id: 'about', label: 'About', panel: false, href: '/about'},
  {id: 'contact', label: 'Contact', panel: false, href: '/contact'}
];

export const NAV_TOTAL = STATS.products;

/** Utility bar lines — all from COMPANY. */
export const UTILITY = {
  gstin: COMPANY.gstin,
  phoneDisplay: COMPANY.phoneDisplay,
  phoneHref: COMPANY.phoneHref,
  email: COMPANY.email,
  location: `${COMPANY.city}, ${COMPANY.region}`,
  mapsHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.mapsQuery)}`
};

export const SEARCH_PLACEHOLDER = 'Search plywood, MDF, décor code…';
