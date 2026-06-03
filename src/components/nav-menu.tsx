import type {ComponentProps} from 'react';
import {
  TrendingUp,
  Globe,
  Smartphone,
  Database,
  Palette,
  BarChart3,
  Lightbulb,
  Stethoscope,
  UtensilsCrossed,
  Wrench,
  ShoppingBag,
  Flower2,
  Sparkles,
  Users,
  Settings2,
  Megaphone,
  Brain,
  type LucideIcon
} from 'lucide-react';
import type {Link} from '@/i18n/navigation';
import type {Accent} from '@/components/demos/demoAccent';

type Href = ComponentProps<typeof Link>['href'];

export type NavMenuItem = {
  /** Translation key in the `nav` namespace. */
  key: string;
  href: Href;
  icon: LucideIcon;
  /** Internal pathname used to detect the active route. */
  match: string;
};

export type ServiceItem = NavMenuItem & {accent: Accent};

/**
 * The seven services — shown in the "Services ▾" dropdown, the mobile submenu,
 * and the homepage Services section (each links to its page). AI Products is NOT
 * here; it's now a separate top-level nav link.
 */
export const SERVICES: ServiceItem[] = [
  {key: 'leadGeneration', href: '/lead-generation', match: '/lead-generation', icon: TrendingUp, accent: 'blue'},
  {key: 'websites', href: '/websites', match: '/websites', icon: Globe, accent: 'indigo'},
  {key: 'customApps', href: '/custom-apps', match: '/custom-apps', icon: Smartphone, accent: 'orange'},
  {key: 'erps', href: '/erps', match: '/erps', icon: Database, accent: 'green'},
  {key: 'contentBranding', href: '/content-branding', match: '/content-branding', icon: Palette, accent: 'red'},
  {key: 'customDashboards', href: '/custom-dashboards', match: '/custom-dashboards', icon: BarChart3, accent: 'blue'},
  {key: 'businessConsulting', href: '/business-consulting', match: '/business-consulting', icon: Lightbulb, accent: 'indigo'}
];

export const SERVICES_MENU: NavMenuItem[] = SERVICES;

/** Industry slugs + their message key + icon (one source of truth). */
export const INDUSTRIES = [
  {slug: 'dental', key: 'dental', icon: Stethoscope, accent: 'blue'},
  {slug: 'restaurants', key: 'restaurants', icon: UtensilsCrossed, accent: 'indigo'},
  {slug: 'engineering-b2b', key: 'engineering', icon: Wrench, accent: 'orange'},
  {slug: 'ecommerce', key: 'ecommerce', icon: ShoppingBag, accent: 'red'},
  {slug: 'med-spas', key: 'medSpas', icon: Flower2, accent: 'green'}
] as const;

export const INDUSTRIES_MENU: NavMenuItem[] = INDUSTRIES.map((i) => ({
  key: i.key,
  href: {pathname: '/industries/[slug]', params: {slug: i.slug}} as Href,
  icon: i.icon,
  match: `/industries/${i.slug}`
}));

/**
 * AI Products dropdown — "All AI Products" plus the four category headings,
 * each linking to its anchor section on /ai-products.
 */
export const AI_PRODUCTS_MENU: NavMenuItem[] = [
  {key: 'aiAll', href: '/ai-products', icon: Sparkles, match: '/ai-products'},
  {key: 'aiHiring', href: {pathname: '/ai-products', hash: 'hiring'} as Href, icon: Users, match: '#hiring'},
  {key: 'aiOperations', href: {pathname: '/ai-products', hash: 'operations'} as Href, icon: Settings2, match: '#operations'},
  {key: 'aiMarketing', href: {pathname: '/ai-products', hash: 'marketing'} as Href, icon: Megaphone, match: '#marketing'},
  {key: 'aiEnterprise', href: {pathname: '/ai-products', hash: 'enterprise'} as Href, icon: Brain, match: '#enterprise'}
];
