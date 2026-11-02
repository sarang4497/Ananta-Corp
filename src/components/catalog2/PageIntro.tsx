import type {ReactNode} from 'react';
import {Breadcrumbs, type Crumb} from './Breadcrumbs';

/** Compact page header used across inner pages: crumbs, eyebrow, H1, lead. */
export function PageIntro({
  crumbs,
  eyebrow,
  title,
  lead,
  aside,
  children
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-white">
      <div className="shell pb-9 pt-6 sm:pb-12 sm:pt-8">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={aside ? 'mt-6 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10' : 'mt-6'}>
          <div className={aside ? 'lg:col-span-7' : 'max-w-3xl'}>
            {eyebrow && <p className="hero-in t-label text-orange-ink">{eyebrow}</p>}
            <h1 className="hero-in mt-3 text-[clamp(1.9rem,1.2rem+2.6vw,3.3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink" style={{['--d' as string]: '60ms'}}>
              {title}
            </h1>
            {lead && (
              <div className="hero-in t-lead mt-4 max-w-[62ch] text-muted" style={{['--d' as string]: '120ms'}}>
                {lead}
              </div>
            )}
            {children}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
