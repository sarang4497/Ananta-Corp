import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

/**
 * Privacy policy — PLACEHOLDER.
 *
 * TODO(privacy): replace with the real GDPR privacy policy. It should cover, at
 * minimum: data controller identity, what data the chat assistant collects
 * (email + messages), the legal basis (consent), retention, how to request
 * deletion, and contact details. The chat email gate links here.
 */
export default async function PrivacyPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <section className="shell py-20">
      <p className="font-mono text-[11px] uppercase tracking-widest text-indigo">
        Placeholder
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          This is a placeholder privacy policy. The real policy is being finalised.
        </p>
        <p>
          When you use the chat assistant and verify your email, we use that email
          only to follow up about your enquiry. We do not sell your data.
        </p>
        <p>
          To request deletion of your data, email{' '}
          <a className="text-indigo underline" href="mailto:hello@studiomarketingitalia.it">
            hello@studiomarketingitalia.it
          </a>
          .
        </p>
      </div>
    </section>
  );
}
