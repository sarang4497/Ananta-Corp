import {ArrowRight, Sparkles} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Reveal} from '@/components/ui/Reveal';
import {buttonClassName} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';

/**
 * Full-width enquiry band — deep indigo with a warm orange edge; the page's
 * final conversion moment.
 */
export function CtaBand({
  heading,
  sub,
  note,
  ctaWhatsapp,
  ctaContact
}: {
  heading: string;
  sub: string;
  note: string;
  ctaWhatsapp: string;
  ctaContact: string;
}) {
  return (
    <section className="shell pb-20 sm:pb-24">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-12 text-center text-white sm:px-12 sm:py-16"
          style={{
            backgroundImage:
              'linear-gradient(115deg, #1e3a8a 0%, #1E40AF 50%, #1D4ED8 85%, #2563eb 110%)'
          }}
        >
          {/* Warm orange glow bleeding in from the corner. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
            style={{background: 'radial-gradient(circle, #F97316, transparent 70%)'}}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
            style={{background: 'radial-gradient(circle, #FB923C, transparent 70%)'}}
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {heading}
            </h2>
            <p className="text-pretty text-base leading-relaxed text-white/85 sm:text-lg">{sub}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClassName('orange', 'lg', 'btn-sheen font-bold')}
              >
                {ctaWhatsapp}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-base font-semibold text-white no-underline transition-opacity hover:opacity-80"
              >
                {ctaContact}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90">
              <Sparkles className="h-4 w-4 text-orange-light" aria-hidden />
              {note}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
