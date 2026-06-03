import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/ui/Reveal';
import {Button} from '@/components/ui/Button';
import {buildAlternates} from '@/lib/metadata';
import {whatsappUrl} from '@/lib/whatsapp';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/', locale)
  };
}

/**
 * Groundwork homepage — brand basics only. The full Ananta homepage
 * (categories, products, partners) is designed in the next phase.
 */
export default async function HomePage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        sub={t('hero.sub')}
      />

      <section className="shell pb-20 text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {t('intro')}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact">{t('ctaContact')}</Button>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-blue no-underline transition-colors hover:text-indigo"
            >
              {t('ctaWhatsapp')} →
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
