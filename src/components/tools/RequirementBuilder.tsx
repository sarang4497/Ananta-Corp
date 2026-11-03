'use client';

import {useId, useState} from 'react';
import {Building2, Check, CookingPot, DoorOpen, LayoutPanelLeft, Mail, Package, Shirt, Sofa, type LucideIcon} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {categoryHref, productHref, type CategorySlug} from '@/data/products';
import {CATEGORY_COPY} from '@/content/categories';
import {
  PROJECTS,
  UNITS,
  categoriesForProject,
  categoryName,
  productsForProject,
  unitFor,
  type ProjectKey,
  type Unit
} from '@/content/tools-data';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteContactHref, quoteWhatsappUrl, type QuoteContext} from '@/lib/quote';
import {cn} from '@/lib/cn';
import s from './tools.module.css';

const ICONS: Record<ProjectKey, LucideIcon> = {
  furniture: Sofa,
  kitchen: CookingPot,
  wardrobe: Shirt,
  office: Building2,
  partitions: LayoutPanelLeft,
  doors: DoorOpen,
  bulk: Package
};

/**
 * Requirement builder — project → material (categories whose products list
 * that application) → quantity + city. Builds a WhatsApp message / enquiry
 * link with the full context. No prices, stock or delivery promises.
 */
export function RequirementBuilder() {
  const ids = {text: useId(), qty: useId(), unit: useId(), city: useId()};
  const [project, setProject] = useState<ProjectKey | null>(null);
  const [cats, setCats] = useState<CategorySlug[]>([]);
  const [text, setText] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState<Unit>('sheets');
  const [unitTouched, setUnitTouched] = useState(false);
  const [city, setCity] = useState('');

  const proj = PROJECTS.find((p) => p.key === project);
  const options = project ? categoriesForProject(project) : [];

  const chooseProject = (k: ProjectKey) => {
    setProject(k);
    const available = categoriesForProject(k);
    const next = available.length === 1 ? available : [];
    setCats(next);
    if (!unitTouched) setUnit(unitFor(next, PROJECTS.find((p) => p.key === k)!.unit));
  };
  const toggleCat = (c: CategorySlug) => {
    const next = cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c];
    setCats(next);
    if (!unitTouched && proj) setUnit(unitFor(next, proj.unit));
  };

  const quantity = qty.trim() ? `${qty.trim()} ${unit}` : '';
  const ctx: QuoteContext = {
    category: cats.map(categoryName).join(', '),
    quantity,
    city: city.trim(),
    requirement: [proj?.label, text.trim()].filter(Boolean).join(' — '),
    source: 'Requirement Builder'
  };
  const ready = !!project && cats.length > 0;
  const field = 'min-h-11 w-full min-w-0 rounded-[6px] border border-line bg-white px-3 text-[14px] text-ink placeholder:text-steel focus:border-indigo/50 focus:outline-none';

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="rounded-[12px] border border-line bg-white p-4 sm:p-7 lg:col-span-7">
        <fieldset>
          <legend className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <StepNo n={1} done={!!project} /> Project
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
            {PROJECTS.map((p) => {
              const Icon = ICONS[p.key];
              const on = p.key === project;
              return (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => chooseProject(p.key)}
                  className={cn(
                    'flex min-h-16 flex-col items-start justify-center gap-1 rounded-[8px] border px-3 py-2.5 text-left transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98]',
                    on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-indigo/40'
                  )}
                >
                  <span className="flex items-center gap-2 text-[14px] font-semibold leading-snug">
                    <Icon className={cn('h-4 w-4 shrink-0', on ? 'text-orange-light' : 'text-indigo')} aria-hidden />
                    {p.label}
                  </span>
                  <span className={cn('text-[12px] leading-snug', on ? 'text-white/75' : 'text-muted')}>{p.hint}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {proj && (
          <fieldset key={proj.key} className={cn('mt-7', s.step)}>
            <legend className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <StepNo n={2} done={cats.length > 0} /> Material
            </legend>
            <p className="mt-1 text-[13px] text-muted">Categories with products listed for {proj.label.toLowerCase()}. Pick one or more.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {options.map((c) => {
                const on = cats.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleCat(c)}
                    className={cn(
                      'inline-flex min-h-11 items-center gap-2 rounded-[6px] border px-3.5 py-2 text-left text-[13.5px] font-medium leading-snug transition-colors duration-150',
                      on ? 'border-orange bg-orange/10 text-orange-ink' : 'border-line text-ink hover:border-indigo/40'
                    )}
                  >
                    {on && <Check className="h-4 w-4 shrink-0" aria-hidden />}
                    {categoryName(c)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {ready && (
          <fieldset className={cn('mt-7', s.step)}>
            <legend className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <StepNo n={3} done={!!qty.trim() && !!city.trim()} /> Quantity &amp; city
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={ids.text} className="text-[13px] font-semibold text-muted">
                  Requirement <span className="font-normal">(optional)</span>
                </label>
                <textarea
                  id={ids.text}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder="e.g. 18 mm for carcass, 2 shades of prelam for shutters"
                  className={cn(field, 'mt-1.5 min-h-24 py-2.5 leading-relaxed')}
                />
              </div>
              <div>
                <label htmlFor={ids.qty} className="text-[13px] font-semibold text-muted">
                  Quantity
                </label>
                <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_minmax(0,7.5rem)] gap-2">
                  <input
                    id={ids.qty}
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    inputMode="numeric"
                    placeholder="e.g. 40"
                    className={field}
                  />
                  <label htmlFor={ids.unit} className="sr-only">
                    Unit
                  </label>
                  <select
                    id={ids.unit}
                    value={unit}
                    onChange={(e) => {
                      setUnit(e.target.value as Unit);
                      setUnitTouched(true);
                    }}
                    className={field}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor={ids.city} className="text-[13px] font-semibold text-muted">
                  City
                </label>
                <input
                  id={ids.city}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="address-level2"
                  placeholder="e.g. Ahmedabad"
                  className={cn(field, 'mt-1.5')}
                />
              </div>
            </div>
          </fieldset>
        )}
      </div>

      <aside className="lg:col-span-5" aria-live="polite" aria-label="Your requirement">
        <div className="rounded-[12px] bg-navy p-5 text-white sm:p-7 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <p className="t-label text-orange-light">Your requirement</p>
          {!ready ? (
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">
              {project ? 'Pick at least one material to see matching products.' : 'Start with the project — the materials and products follow from it.'}
            </p>
          ) : (
            <div key={cats.join()} className={s.step}>
              <dl className="mt-4 grid gap-2 text-[14px]">
                <Row k="Project" v={proj!.label} />
                <Row k="Material" v={ctx.category!} />
                {quantity && <Row k="Quantity" v={quantity} />}
                {ctx.city && <Row k="City" v={ctx.city} />}
              </dl>
              <div className="mt-5 grid gap-4">
                {cats.map((c) => {
                  const items = productsForProject(project!, c);
                  return (
                    <div key={c}>
                      <Link href={categoryHref(c)} className="text-[13px] font-semibold text-white underline-offset-4 hover:underline">
                        {CATEGORY_COPY[c].name} →
                      </Link>
                      <ul className="mt-1.5 flex flex-wrap gap-1.5">
                        {items.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={productHref(p)}
                              className="inline-flex min-h-9 items-center rounded-[5px] bg-white/10 px-2.5 py-1.5 text-[12.5px] leading-snug text-white hover:bg-white/20"
                            >
                              {p.short}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a
                  data-testid="rb-whatsapp"
                  href={quoteWhatsappUrl(ctx)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-orange px-4 py-2 text-center text-[14px] font-semibold text-white hover:bg-orange-deep"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" /> Send on WhatsApp
                </a>
                <Link
                  data-testid="rb-enquiry"
                  href={quoteContactHref(ctx)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-white/25 px-4 py-2 text-center text-[14px] font-semibold text-white hover:border-white/60 hover:bg-white/5"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden /> Send enquiry
                </Link>
              </div>
              <p className="mt-4 text-[12.5px] leading-relaxed text-white/65">Price and availability are confirmed by the Ananta team.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function StepNo({n, done}: {n: number; done: boolean}) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold transition-colors duration-200',
        done ? 'bg-indigo text-white' : 'bg-bg-soft text-muted'
      )}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : n}
    </span>
  );
}

function Row({k, v}: {k: string; v: string}) {
  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2 border-b border-white/10 pb-2">
      <dt className="text-white/60">{k}</dt>
      <dd className="min-w-0 break-words font-medium">{v}</dd>
    </div>
  );
}
