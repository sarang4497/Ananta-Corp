import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {buildAlternates} from '@/lib/metadata';
import {Hero} from '@/components/home2/Hero';
import {RangeIndex} from '@/components/home2/RangeIndex';
import {MaterialLibrary} from '@/components/home2/MaterialLibrary';
import {FinishWall} from '@/components/home2/FinishWall';
import {BrandsBand} from '@/components/home2/BrandsBand';
import {AudiencePaths} from '@/components/home2/AudiencePaths';
import {MaterialSelector} from '@/components/home2/MaterialSelector';
import {CompareTool} from '@/components/home2/CompareTool';
import {Operations, CustomFurniture} from '@/components/home2/Operations';
import {Voices} from '@/components/home2/Voices';

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
 * Homepage narrative (research/ANANTA_REDESIGN_DECISIONS.md):
 * hero → range index → material library → finish wall → brands (navy) →
 * audiences → tools (selector + compare) → ready stock & why → custom
 * furniture → customer voices → footer conversion row.
 */
export default async function HomePage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <RangeIndex />
      <MaterialLibrary />
      <FinishWall />
      <BrandsBand />
      <AudiencePaths />
      <section aria-labelledby="tools-title" className="relative bg-bg-warm py-14 sm:py-20">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="shell relative">
          <div className="max-w-2xl" data-reveal="up">
            <p className="t-label text-orange-ink">Specify faster</p>
            <h2 id="tools-title" className="t-h2 mt-3 text-ink">
              Match the grade to the exposure — before you ask for a price.
            </h2>
          </div>
          <div className="mt-9 grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_1fr]">
            <MaterialSelector />
            <CompareTool />
          </div>
        </div>
      </section>
      <Operations />
      <CustomFurniture />
      <Voices exclude="Ketanbhai Shah" />
    </>
  );
}
