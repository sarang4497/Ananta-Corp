import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {CATEGORIES, categoryHref} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';

export default function NotFound() {
  return (
    <section className="bg-white">
      <div className="shell py-20 sm:py-28">
        <p className="t-label text-orange-ink">404</p>
        <h1 className="mt-3 text-[clamp(1.9rem,1.3rem+2.4vw,3rem)] font-semibold tracking-tight text-ink">This page isn’t on the shelf.</h1>
        <p className="mt-3 max-w-xl text-[15.5px] text-muted">The link may have moved. Try a category, or open the full catalogue.</p>
        <ul className="mt-7 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={categoryHref(c.slug)} className="inline-flex min-h-10 items-center rounded-[5px] border border-line px-3.5 text-[13.5px] font-medium text-ink hover:border-indigo/40">
                {CATEGORY_COPY[c.slug].short}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/products" className="arrow-nudge mt-7 inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-indigo px-5 text-[14.5px] font-semibold text-white hover:bg-blue">
          All products <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
