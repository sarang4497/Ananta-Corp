import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {buildAlternates} from '@/lib/metadata';
import {Hero} from '@/components/home3/Hero';
import {ProductUniverse} from '@/components/home3/ProductUniverse';
import {AudienceSelector} from '@/components/home3/AudienceSelector';
import {FeaturedRail} from '@/components/home3/FeaturedRail';
import {MaterialTech} from '@/components/home3/MaterialTech';
import {BrandPartners} from '@/components/home3/BrandPartners';
import {InteractiveTools} from '@/components/home3/InteractiveTools';
import {Operations} from '@/components/home3/Operations';
import {WhyAnanta} from '@/components/home3/WhyAnanta';
import {ToolsGrid} from '@/components/home3/ToolsGrid';
import {Insights} from '@/components/home3/Insights';
import {Voices} from '@/components/home3/Voices';
import {Faq} from '@/components/home3/Faq';
import {ContactBand} from '@/components/home3/ContactBand';
import {FinishWall} from '@/components/home2/FinishWall';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: {absolute: 'Ananta Corporation | Plywood, MDF & Board Supplier in Ahmedabad'},
    description:
      'Duroply plywood and flush doors, Action TESA MDF, HDHMR, Moist Master and pre-laminated boards, and Tenon smart locks — supplied from ready stock in Ahmedabad for architects, interior designers, furniture manufacturers and contractors.',
    alternates: buildAlternates('/', locale)
  };
}

/**
 * Homepage V2 narrative (research/ANANTA_V2_DECISION_MATRIX.md). Rhythm:
 * white hero → white range → soft-blue audiences → white featured → navy
 * technology → warm brands → white finish wall → gridded interactive tools →
 * image-led stock → navy proof → white toolkit → warm insights → white voices
 * → soft-blue FAQ (FAQPage JSON-LD) → navy quote band → footer (shell).
 * Organization JSON-LD is injected by the layout.
 */
export default async function HomePage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <ProductUniverse />
      <AudienceSelector />
      <FeaturedRail />
      <MaterialTech />
      <BrandPartners />
      <FinishWall />
      <InteractiveTools />
      <Operations />
      <WhyAnanta />
      <ToolsGrid />
      <Insights />
      <Voices />
      <Faq />
      <ContactBand />
    </>
  );
}
