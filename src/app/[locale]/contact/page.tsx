import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/ui/Reveal';
import {ContactForm} from '@/components/ContactForm';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact.meta');
  return {
    title: t('title'),
    description: t('description'),
    alternates: buildAlternates('/contact', locale)
  };
}

export default async function ContactPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        sub={t('hero.sub')}
      />

      <section className="shell py-12">
        <Reveal className="rounded-2xl border border-border bg-bg p-6 shadow-card sm:p-8">
          <ContactForm />
        </Reveal>

        <Reveal className="mt-8 text-center">
          <p className="text-sm text-muted">{t('emailLabel')}</p>
          <a
            href={`mailto:${t('email')}`}
            className="text-base font-semibold text-blue no-underline transition-colors hover:text-indigo"
          >
            {t('email')}
          </a>
        </Reveal>
      </section>
    </>
  );
}
