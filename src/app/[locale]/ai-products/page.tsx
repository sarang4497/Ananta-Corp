import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {
  Users,
  Calendar,
  MessageCircle,
  FileText,
  FileCheck,
  ShoppingCart,
  Package,
  Workflow,
  BarChart3,
  Mail,
  Headphones,
  Send,
  Scale,
  CalendarCheck,
  Search,
  Megaphone,
  Video,
  UserPlus,
  PenTool,
  Mic,
  Eye,
  LayoutDashboard,
  Bot,
  type LucideIcon
} from 'lucide-react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {AiProductCard, type ProductLabels} from '@/components/home/AiProductCard';
import type {Accent} from '@/components/demos/demoAccent';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

type Product = {
  name: string;
  desc: string;
  benefits: string[];
  starter: string;
  growth: string;
  flagship?: boolean;
};
type Category = {id: string; title: string; products: Product[]};

// Per-category palette accent + per-product icons (text lives in messages).
const CATEGORY_META: Record<string, {accent: Accent; icons: LucideIcon[]}> = {
  hiring: {accent: 'blue', icons: [Users, Calendar, MessageCircle]},
  operations: {
    accent: 'indigo',
    icons: [FileText, FileCheck, ShoppingCart, Package, Workflow, BarChart3, Mail, Headphones, Send, Scale]
  },
  marketing: {accent: 'orange', icons: [CalendarCheck, Search, Megaphone, Video, UserPlus, PenTool]},
  enterprise: {accent: 'green', icons: [Mic, Eye, LayoutDashboard, Bot]}
};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('aiProducts.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/ai-products', locale)
  };
}

export default async function AiProductsPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('aiProducts');

  const categories = t.raw('categories') as Category[];
  const pl = t.raw('priceLabels') as {
    starter: string;
    growth: string;
    enterprise: string;
    custom: string;
  };
  const labels: ProductLabels = {...pl, cta: t('cta'), flagshipBadge: t('flagshipBadge')};

  // Cumulative offset per category so each product gets a stable global anchor
  // (product-01 … product-23) that the nav mega-menu links to.
  let runningOffset = 0;
  const cats = categories.map((c) => {
    const base = runningOffset;
    runningOffset += c.products.length;
    return {...c, base};
  });

  return (
    <>
      {/* Category sections — AI-Assisted Hiring first. The first one carries the
          top spacing so it clears the pinned header (no intro hero above). */}
      {cats.map((cat, i) => {
        const meta = CATEGORY_META[cat.id] ?? CATEGORY_META.operations;
        return (
          <section
            key={cat.id}
            id={cat.id}
            className={`shell pb-12 sm:pb-16 ${i === 0 ? 'pt-16 sm:pt-20' : ''}`}
          >
            <Reveal>
              <SectionHeading title={cat.title} />
            </Reveal>
            <Reveal
              stagger={0.06}
              className="mt-10 grid grid-cols-1 gap-7 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {cat.products.map((p, j) => {
                const anchor = `product-${String(cat.base + j + 1).padStart(2, '0')}`;
                return (
                  <RevealItem key={p.name} className="h-full">
                    <div id={anchor} className="h-full">
                      <AiProductCard
                        icon={meta.icons[j % meta.icons.length]}
                        name={p.name}
                        desc={p.desc}
                        benefits={p.benefits}
                        starter={p.starter}
                        growth={p.growth}
                        accent={meta.accent}
                        flagship={p.flagship}
                        labels={labels}
                      />
                    </div>
                  </RevealItem>
                );
              })}
            </Reveal>
          </section>
        );
      })}
    </>
  );
}
