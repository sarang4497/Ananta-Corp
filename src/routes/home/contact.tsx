import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {ArrowUpRight, Mail, MapPin, Phone} from 'lucide-react';
import {COMPANY, MAPS_URL as mapsUrl, WA} from '@/content/site';
import {PageIntro} from '@/components/catalog2/PageIntro';
import {ContactLeadForm} from '@/components/contact/ContactLeadForm';
import {WhatsAppIcon} from '@/components/ui/Button';
import {whatsappUrl} from '@/lib/whatsapp';
import {quoteWhatsappUrl} from '@/lib/quote';
import {buildAlternates} from '@/lib/metadata';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: 'Contact — Plywood, MDF & Board Supplier in Ahmedabad',
    description: `Contact Ananta Corporation, Pirana Road, Piplaj, Ahmedabad: ${COMPANY.phoneDisplay}, ${COMPANY.email}. Pricing and availability on WhatsApp, bulk and project enquiries welcome.`,
    alternates: buildAlternates('/contact', locale)
  };
}

const PRESETS = [
  {l: 'Price for a product', href: quoteWhatsappUrl({source: 'Contact page'})},
  {l: 'Project material list', href: whatsappUrl(WA.project)},
  {l: 'Custom furniture', href: whatsappUrl(WA.custom)}
];

export default async function ContactPage({params}: Params) {
  const {locale} = await params;
  setRequestLocale(locale);
    return (
    <>
      <PageIntro
        crumbs={[{label: 'Home', href: '/'}, {label: 'Contact'}]}
        eyebrow="Pricing · availability · project supply"
        title="Talk to the supply desk."
        lead="WhatsApp is fastest for price and stock. For larger or multi-category requirements, send the enquiry form with sizes and quantities."
      />
      <section aria-label="Enquiry form and direct channels" className="bg-bg-soft py-10 sm:py-14">
        <div className="shell grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="rounded-[10px] border border-line bg-white p-5 sm:p-7 lg:col-span-7" data-dock-hide data-reveal="up">
            <p className="t-label text-orange-ink">Written enquiry</p>
            <h2 className="t-h3 mt-2 text-ink">Send your requirement</h2>
            <p className="mt-1 text-[14px] text-muted">Grades, thicknesses, finishes and quantities help the team quote accurately.</p>
            <div className="mt-6">
              <ContactLeadForm />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-[10px] bg-navy p-6 text-white" data-reveal="up">
              <p className="t-label text-orange-light">WhatsApp</p>
              <p className="mt-2 text-[20px] font-semibold">{COMPANY.phoneDisplay}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {PRESETS.map((p) => (
                  <li key={p.l}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center justify-between gap-3 rounded-[6px] border border-white/15 px-4 text-[14px] font-medium hover:border-white/50"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <WhatsAppIcon className="h-4 w-4 text-orange-light" /> {p.l}
                      </span>
                      <ArrowUpRight className="h-4 w-4 opacity-60" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="divide-y divide-line rounded-[10px] border border-line bg-white" data-reveal="up">
              <div className="flex gap-4 p-5">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-indigo" aria-hidden />
                <div>
                  <dt className="t-label text-steel">Phone</dt>
                  <dd className="mt-1">
                    <a href={COMPANY.phoneHref} className="text-[15px] font-semibold text-ink hover:text-indigo">
                      {COMPANY.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4 p-5">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-indigo" aria-hidden />
                <div className="min-w-0">
                  <dt className="t-label text-steel">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${COMPANY.email}`} className="break-all text-[15px] font-semibold text-ink hover:text-indigo">
                      {COMPANY.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4 p-5">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-indigo" aria-hidden />
                <div>
                  <dt className="t-label text-steel">Warehouse &amp; office</dt>
                  <dd className="mt-1 text-[14.5px] leading-relaxed text-ink">
                    <address className="not-italic">
                      {COMPANY.addressLines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </address>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-semibold text-indigo hover:underline">
                      Open in Google Maps <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4 p-5">
                <span className="t-label mt-0.5 w-5 shrink-0 text-indigo">GST</span>
                <div>
                  <dt className="t-label text-steel">GSTIN</dt>
                  <dd className="mt-1 font-mono text-[14px] text-ink">{COMPANY.gstin}</dd>
                </div>
              </div>
            </dl>
          </div>

        </div>
      </section>
    </>
  );
}
