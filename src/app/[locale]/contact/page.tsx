import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Mail, MapPin, Phone, Clock} from 'lucide-react';
import {PageHero} from '@/components/PageHero';
import {Reveal} from '@/components/ui/Reveal';
import {ContactLeadForm} from '@/components/contact/ContactLeadForm';
import {ImagePlaceholder} from '@/components/home/ImagePlaceholder';
import {buttonClassName} from '@/components/ui/Button';
import {buildAlternates} from '@/lib/metadata';
import {whatsappUrl} from '@/lib/whatsapp';

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

  const infoRow =
    'flex items-start gap-3 text-sm leading-relaxed text-ink';
  const infoIcon =
    'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo/8 text-indigo';

  return (
    <>
      <PageHero eyebrow={t('hero.eyebrow')} title={t('hero.title')} sub={t('hero.sub')} />

      <section className="shell grid gap-10 pb-16 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        {/* Enquiry form */}
        <Reveal className="rounded-3xl border border-border bg-bg p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-ink">{t('formHeading')}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{t('formSub')}</p>
          <div className="mt-6">
            <ContactLeadForm />
          </div>
        </Reveal>

        {/* Direct contact column */}
        <Reveal delay={0.08} className="flex flex-col gap-5">
          <div className="rounded-3xl border border-border bg-bg-soft p-6 sm:p-7">
            <h2 className="text-xl font-bold tracking-tight text-ink">{t('directHeading')}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{t('directSub')}</p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName('orange', 'lg', 'btn-sheen mt-5 w-full font-bold')}
            >
              {t('whatsappCta')}
            </a>
            <div className="mt-6 flex flex-col gap-4">
              <div className={infoRow}>
                <span className={infoIcon}>
                  <MapPin className="h-4.5 w-4.5" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold">{t('addressLabel')}</span>
                  {t('address')}
                </span>
              </div>
              <a href="tel:+918320052838" className={`${infoRow} no-underline`}>
                <span className={infoIcon}>
                  <Phone className="h-4.5 w-4.5" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold">{t('phoneLabel')}</span>
                  +91 83200 52838
                </span>
              </a>
              <a href="mailto:info@anantacorporation.com" className={`${infoRow} no-underline`}>
                <span className={infoIcon}>
                  <Mail className="h-4.5 w-4.5" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold">{t('emailLabel')}</span>
                  info@anantacorporation.com
                </span>
              </a>
              <div className={infoRow}>
                <span className={infoIcon}>
                  <Clock className="h-4.5 w-4.5" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold">{t('hoursLabel')}</span>
                  {t('hours')}
                </span>
              </div>
            </div>
          </div>

          {/* Map placeholder — swap for an embedded map later. */}
          <ImagePlaceholder label={t('mapLabel')} className="h-56 w-full" />
        </Reveal>
      </section>
    </>
  );
}
