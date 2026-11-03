import {HOME_FAQS} from '@/content/home';
import {COMPANY} from '@/content/site';
import {FaqAccordion} from './FaqAccordion';
import {SECTION, SectionHead} from './ui';

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((f) => ({'@type': 'Question', name: f.q, acceptedAnswer: {'@type': 'Answer', text: f.a}}))
  };
}

/** 15 FAQ — grounded answers (site.ts facts + product FAQs) + FAQPage JSON-LD. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className={`${SECTION} bg-surface-blue`}>
      <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <SectionHead
            id="faq-title"
            eyebrow="Questions"
            title="Frequently asked."
            lead={
              <>
                Something else? Call{' '}
                <a href={COMPANY.phoneHref} className="font-semibold text-indigo hover:underline">
                  {COMPANY.phoneDisplay}
                </a>
                .
              </>
            }
          />
        </div>
        <div className="lg:col-span-8" data-reveal="up">
          <FaqAccordion items={HOME_FAQS} />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd()).replace(/</g, '\\u003c')}} />
    </section>
  );
}
