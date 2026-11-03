'use client';

import {useId, useState} from 'react';
import {Info, Mail, Plus, Trash2} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {productHref} from '@/data/products';
import {
  SHEET,
  SHEET_PRODUCTS,
  bySlug,
  fmt,
  piecesAreaSqFt,
  sheetsNeeded,
  sqFtToSqM,
  toSqFt,
  type AreaUnit,
  type LengthUnit
} from '@/content/tools-data';
import {WhatsAppIcon} from '@/components/ui/Button';
import {quoteContactHref, quoteWhatsappUrl, type QuoteContext} from '@/lib/quote';
import {cn} from '@/lib/cn';
import s from './tools.module.css';

type Row = {id: number; length: string; width: string; qty: string};
const LENGTH_UNITS: {k: LengthUnit; l: string}[] = [
  {k: 'ft', l: 'ft'},
  {k: 'in', l: 'in'},
  {k: 'mm', l: 'mm'},
  {k: 'cm', l: 'cm'},
  {k: 'm', l: 'm'}
];
const num = (v: string) => (v.trim() === '' ? NaN : Number(v.replace(',', '.')));

/**
 * Sheet quantity helper — area-based estimate of 8 × 4 ft sheets (the only
 * sheet size the catalogue verifies). Not a cutting plan; the copy says so.
 */
export function SheetHelper() {
  const uid = useId();
  const [mode, setMode] = useState<'pieces' | 'area'>('pieces');
  const [lu, setLu] = useState<LengthUnit>('ft');
  const [rows, setRows] = useState<Row[]>([{id: 1, length: '', width: '', qty: '1'}]);
  const [area, setArea] = useState('');
  const [au, setAu] = useState<AreaUnit>('sqft');
  const [waste, setWaste] = useState('10');
  const [board, setBoard] = useState('');
  const [thick, setThick] = useState('');

  const areaSqFt =
    mode === 'pieces'
      ? piecesAreaSqFt(
          rows.map((r) => ({length: num(r.length), width: num(r.width), qty: num(r.qty)})),
          lu
        )
      : Math.max(0, toSqFt(num(area) || 0, au));
  const w = num(waste);
  const wastage = Number.isFinite(w) && w >= 0 ? Math.min(w, 100) : 0;
  const sheets = sheetsNeeded(areaSqFt, wastage);
  const product = board ? bySlug(board) : undefined;
  const thicknesses = product ? product.sizes.filter((x) => /MM$/.test(x)) : [];

  const ctx: QuoteContext = {
    product: product?.name,
    size: product && thick ? thick : undefined,
    quantity: sheets ? `${sheets} sheets of ${SHEET.label}` : undefined,
    requirement: sheets ? `Approx. ${fmt(areaSqFt)} sq ft panel area + ${fmt(wastage, 1)}% wastage (Sheet Quantity Helper estimate)` : undefined,
    source: 'Sheet Quantity Helper'
  };

  const update = (id: number, k: keyof Omit<Row, 'id'>, v: string) => setRows((rs) => rs.map((r) => (r.id === id ? {...r, [k]: v} : r)));
  const field = 'min-h-11 w-full min-w-0 rounded-[6px] border border-line bg-white px-3 text-[14px] text-ink placeholder:text-steel focus:border-indigo/50 focus:outline-none';
  const seg = (on: boolean) =>
    cn(
      'min-h-11 rounded-[5px] px-3 py-2 text-[13.5px] font-semibold leading-tight transition-colors duration-150',
      on ? 'bg-white text-ink shadow-card' : 'text-muted hover:text-ink'
    );

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="rounded-[12px] border border-line bg-white p-4 sm:p-7 lg:col-span-7">
        <div role="group" aria-label="Input method" className="inline-flex flex-wrap gap-1 rounded-[7px] bg-bg-soft p-1">
          <button type="button" aria-pressed={mode === 'pieces'} onClick={() => setMode('pieces')} className={seg(mode === 'pieces')}>
            Panel pieces
          </button>
          <button type="button" aria-pressed={mode === 'area'} onClick={() => setMode('area')} className={seg(mode === 'area')}>
            Total area
          </button>
        </div>

        {mode === 'pieces' ? (
          <div key="pieces" className={cn('mt-5', s.step)}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-muted">Pieces (length × width × quantity)</p>
              <div role="group" aria-label="Length unit" className="inline-flex flex-wrap gap-1 rounded-[7px] bg-bg-soft p-1">
                {LENGTH_UNITS.map((u) => (
                  <button key={u.k} type="button" aria-pressed={lu === u.k} onClick={() => setLu(u.k)} className={cn(seg(lu === u.k), 'min-w-11 px-2')}>
                    {u.l}
                  </button>
                ))}
              </div>
            </div>
            <ol className="mt-3 grid gap-3">
              {rows.map((r, i) => (
                <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,4.5rem)_auto] items-end gap-2 sm:gap-3">
                  <Num id={`${uid}-l${r.id}`} label={`Length (${lu})`} srLabel={`Piece ${i + 1} length in ${lu}`} value={r.length} onChange={(v) => update(r.id, 'length', v)} cls={field} />
                  <Num id={`${uid}-w${r.id}`} label={`Width (${lu})`} srLabel={`Piece ${i + 1} width in ${lu}`} value={r.width} onChange={(v) => update(r.id, 'width', v)} cls={field} />
                  <Num id={`${uid}-q${r.id}`} label="Qty" srLabel={`Piece ${i + 1} quantity`} value={r.qty} onChange={(v) => update(r.id, 'qty', v)} cls={field} />
                  <button
                    type="button"
                    onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.id !== r.id) : [{id: r.id + 1, length: '', width: '', qty: '1'}]))}
                    aria-label={`Remove piece ${i + 1}`}
                    className="grid h-11 w-11 place-items-center rounded-[6px] border border-line text-muted hover:border-indigo/40 hover:text-ink"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => setRows((rs) => [...rs, {id: Math.max(...rs.map((x) => x.id)) + 1, length: '', width: '', qty: '1'}])}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-dashed border-ink/20 px-4 text-[14px] font-semibold text-indigo hover:border-indigo/50"
            >
              <Plus className="h-4 w-4" aria-hidden /> Add piece
            </button>
          </div>
        ) : (
          <div key="area" className={cn('mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2', s.step)}>
            <Num id={`${uid}-area`} label="Total panel area" value={area} onChange={setArea} cls={field} />
            <div role="group" aria-label="Area unit" className="inline-flex gap-1 rounded-[7px] bg-bg-soft p-1">
              <button type="button" aria-pressed={au === 'sqft'} onClick={() => setAu('sqft')} className={seg(au === 'sqft')}>
                sq ft
              </button>
              <button type="button" aria-pressed={au === 'sqm'} onClick={() => setAu('sqm')} className={seg(au === 'sqm')}>
                sq m
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
          <Num id={`${uid}-waste`} label="Wastage %" value={waste} onChange={setWaste} cls={field} />
          <p className="self-end text-[13px] leading-relaxed text-muted">Added to the area for saw cuts, offcuts and grain direction. 10 % is a starting point — adjust it.</p>
        </div>

        <div className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-board`} className="text-[13px] font-semibold text-muted">
              Board <span className="font-normal">(optional)</span>
            </label>
            <select
              id={`${uid}-board`}
              value={board}
              onChange={(e) => {
                setBoard(e.target.value);
                setThick('');
              }}
              className={cn(field, 'mt-1.5')}
            >
              <option value="">Any 8 × 4 ft board</option>
              {SHEET_PRODUCTS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.short}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-thick`} className="text-[13px] font-semibold text-muted">
              Thickness <span className="font-normal">(optional)</span>
            </label>
            <select id={`${uid}-thick`} value={thick} onChange={(e) => setThick(e.target.value)} disabled={!product} className={cn(field, 'mt-1.5 disabled:bg-bg-soft disabled:text-steel')}>
              <option value="">{product ? 'Choose thickness' : 'Pick a board first'}</option>
              {thicknesses.map((t) => (
                <option key={t} value={t}>
                  {t.replace(' MM', ' mm')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5" aria-label="Estimate">
        <div className="rounded-[12px] bg-navy p-5 text-white sm:p-7 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <p className="t-label text-orange-light">Approximate estimate</p>
          <div aria-live="polite" data-testid="sheet-result">
            <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span key={sheets} className={cn('text-[clamp(2.6rem,2rem+3vw,4rem)] font-semibold leading-none tracking-[-0.03em]', s.pop)} data-testid="sheet-count">
                {sheets}
              </span>
              <span className="text-[15px] text-white/80">
                {sheets === 1 ? 'sheet' : 'sheets'} of {SHEET.label}
              </span>
            </p>
            <dl className="mt-5 grid gap-2 text-[14px]">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-white/10 pb-2">
                <dt className="text-white/65">Panel area</dt>
                <dd className="text-right font-medium" data-testid="sheet-area">
                  {fmt(areaSqFt)} sq ft <span className="text-white/55">({fmt(sqFtToSqM(areaSqFt))} m²)</span>
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-white/10 pb-2">
                <dt className="text-white/65">With {fmt(wastage, 1)} % wastage</dt>
                <dd className="text-right font-medium">{fmt(areaSqFt * (1 + wastage / 100))} sq ft</dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-white/10 pb-2">
                <dt className="text-white/65">One sheet</dt>
                <dd className="text-right font-medium">
                  {SHEET.label} = {SHEET.areaSqFt} sq ft
                </dd>
              </div>
            </dl>
          </div>
          <p className="mt-4 flex gap-2 rounded-[8px] bg-white/8 p-3 text-[13px] leading-relaxed text-white/85">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-orange-light" aria-hidden />
            <span>Approximate — area-based estimate, not a cutting plan; confirm with your carpenter/fabricator.</span>
          </p>
          {product && (
            <p className="mt-4 text-[13px] text-white/75">
              Board:{' '}
              <Link href={productHref(product)} className="font-semibold text-white underline-offset-4 hover:underline">
                {product.short}
              </Link>
              {thick && ` · ${thick.replace(' MM', ' mm')}`}
            </p>
          )}
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a
              data-testid="sheet-whatsapp"
              href={quoteWhatsappUrl(ctx)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-orange px-4 py-2 text-center text-[14px] font-semibold text-white hover:bg-orange-deep"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" /> Get price on WhatsApp
            </a>
            <Link
              href={quoteContactHref(ctx)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-white/25 px-4 py-2 text-center text-[14px] font-semibold text-white hover:border-white/60 hover:bg-white/5"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden /> Send enquiry
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Num({id, label, srLabel, value, onChange, cls}: {id: string; label: string; srLabel?: string; value: string; onChange: (v: string) => void; cls: string}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[12.5px] font-semibold leading-snug text-muted">
        {srLabel ? (
          <>
            <span aria-hidden>{label}</span>
            <span className="sr-only">{srLabel}</span>
          </>
        ) : (
          label
        )}
      </label>
      <input id={id} type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className={cn(cls, 'mt-1.5')} />
    </div>
  );
}
