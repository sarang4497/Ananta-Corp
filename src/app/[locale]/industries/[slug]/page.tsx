import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {
  Megaphone,
  Sparkles,
  PhoneCall,
  Smile,
  CalendarCheck,
  ClipboardList,
  Search,
  Star,
  Globe,
  QrCode,
  TrendingUp,
  Users,
  MapPin,
  MessageCircle,
  FileText,
  Database,
  UserPlus,
  Award,
  ShoppingCart,
  Headphones,
  Store,
  Package,
  type LucideIcon
} from 'lucide-react';
import {PageTemplate} from '@/components/PageTemplate';
import {INDUSTRIES} from '@/components/nav-menu';
import type {Accent} from '@/components/demos/demoAccent';
import type {StatItem} from '@/components/home/StatsSection';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string; slug: string}>};

// Per-service icons (same order as each industry's services in messages).
const ICONS: Record<string, LucideIcon[]> = {
  dental: [Megaphone, Sparkles, PhoneCall, Smile, CalendarCheck, ClipboardList, Search, Star, Globe],
  restaurants: [QrCode, TrendingUp, PhoneCall, CalendarCheck, Users, MapPin, Star, MessageCircle, Globe],
  engineering: [Megaphone, PhoneCall, FileText, Database, UserPlus, Search, Award, Globe],
  ecommerce: [Megaphone, ShoppingCart, Headphones, Store, MessageCircle, Package, Search, Star, Globe],
  medSpas: [PhoneCall, CalendarCheck, ClipboardList, MapPin, Star, MessageCircle, Globe]
};

const DEMO: Record<string, string | undefined> = {restaurants: '/demos/restaurant'};

// These industries have their own rich static routes under industries/.
const DEDICATED = new Set(['dental', 'restaurants', 'engineering-b2b', 'ecommerce', 'med-spas']);

export function generateStaticParams() {
  return INDUSTRIES.filter((i) => !DEDICATED.has(i.slug)).map((i) => ({slug: i.slug}));
}

function industryFor(slug: string) {
  return INDUSTRIES.find((i) => i.slug === slug) ?? null;
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const ind = industryFor(slug);
  if (!ind) return {};
  const t = await getTranslations(`pages.industries.${ind.key}.meta`);
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates({pathname: '/industries/[slug]', params: {slug}}, locale)
  };
}

export default async function IndustryPage({params}: Params) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const ind = industryFor(slug);
  if (!ind) notFound();

  let stats: StatItem[] | undefined;
  if (ind.key === 'dental') {
    const t = await getTranslations(`pages.industries.${ind.key}`);
    stats = t.raw('stats') as StatItem[];
  }

  return (
    <PageTemplate
      namespace={`pages.industries.${ind.key}`}
      accent={ind.accent as Accent}
      icons={ICONS[ind.key] ?? ICONS.dental}
      stats={stats}
      demoHref={DEMO[ind.key]}
    />
  );
}
