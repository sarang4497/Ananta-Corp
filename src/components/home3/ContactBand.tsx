import {ArrowRight, ArrowUpRight, MapPin, Phone} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {COMPANY, MAPS_URL as mapsUrl, WA} from '@/content/site';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {quoteContactHref, quoteWhatsappUrl} from '@/lib/quote';
import {SECTION, cta} from './ui';

/** 16 CONTACT / QUOTE band — phone, WhatsApp, address, written enquiry. */
export function ContactBand() {
  return (
    <section aria-labelledby="quote-title" className={`${SECTION} relative bg-navy text-white`}>
      <div aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" />
      <div className="shell relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p className="t-label text-orange-light" data-reveal="up">
            Price · availability · project supply
          </p>
          <h2 id="quote-title" className="t-h2 mt-3 text-balance" data-reveal="up">
            Send the grade, thickness and quantity. Get a quote.
          </h2>
          <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap" data-reveal="up">
            <a href={quoteWhatsappUrl({source: 'Home quote band'})} target="_blank" rel="noopener noreferrer" className={cta('orange')}>
              <WhatsAppIcon className="h-4 w-4 shrink-0" /> Get price on WhatsApp
            </a>
            <Link href={quoteContactHref({source: 'Home quote band'})} className={cta('outline-light', 'arrow-nudge')}>
              Written enquiry <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
          <a href={whatsappUrl(WA.project)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-white/85 hover:text-white">
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-orange-light" /> Share a project requirement list
          </a>
        </div>
        <dl className="grid grid-cols-1 gap-px border border-navy-line bg-navy-line sm:grid-cols-2 lg:col-span-6" data-reveal="up">
          <div className="flex gap-3 bg-navy p-5">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange-light" aria-hidden />
            <div>
              <dt className="t-label text-white/60">Phone & WhatsApp</dt>
              <dd className="mt-1">
                <a href={COMPANY.phoneHref} className="text-[17px] font-semibold hover:underline">
                  {COMPANY.phoneDisplay}
                </a>
              </dd>
            </div>
          </div>
          <div className="flex gap-3 bg-navy p-5">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-light" aria-hidden />
            <div>
              <dt className="t-label text-white/60">Warehouse & office</dt>
              <dd className="mt-1 text-[14px] leading-relaxed text-white/85">
                <address className="not-italic">
                  {COMPANY.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1 text-[13.5px] font-semibold text-white hover:underline">
                  Open in Google Maps <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  );
}
