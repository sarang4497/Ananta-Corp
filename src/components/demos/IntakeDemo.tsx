'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  AnimatePresence
} from 'motion/react';
import {buttonClassName} from '@/components/ui/Button';
import {cn} from '@/lib/cn';

type Parsed = {name: string; date: string; party: string};

const DAYS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
  lun: 'Monday',
  mar: 'Tuesday',
  mer: 'Wednesday',
  gio: 'Thursday',
  ven: 'Friday',
  sab: 'Saturday',
  dom: 'Sunday'
};

// Client-side mock "AI" parse — purely heuristic, no backend.
function parseMessage(text: string, peopleWord: string, guest: string): Parsed {
  const lower = text.toLowerCase();

  const partyMatch = lower.match(/(\d+)\s*(ppl|people|persone|pax|guests?|persons?)?/);
  const party = partyMatch ? `${partyMatch[1]} ${peopleWord}` : `2 ${peopleWord}`;

  let day = '';
  for (const key of Object.keys(DAYS)) {
    if (new RegExp(`\\b${key}`).test(lower)) {
      day = DAYS[key];
      break;
    }
  }
  const evening = /(nite|night|sera|evening|pm|tonight|stasera)/.test(lower);
  const date = day
    ? `${day} · ${evening ? '8:00 PM' : '1:00 PM'}`
    : evening
      ? 'Tonight · 8:00 PM'
      : 'This week';

  const nameMatch = text.match(/\b(?:i'?m|name'?s?|name is|sono|mi chiamo)\s+([A-Z][a-z]+)/i);
  const name = nameMatch ? nameMatch[1] : guest;

  return {name, date, party};
}

export default function IntakeDemo() {
  const t = useTranslations('home.playground.demo');
  const reduce = useReducedMotion();
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'parsing' | 'done'>('idle');
  const [result, setResult] = useState<Parsed | null>(null);

  function run() {
    const source = text.trim() || t('placeholder');
    setStatus('parsing');
    const parsed = parseMessage(source, t('people'), t('guest'));
    // Brief, deterministic "thinking" beat so the reveal feels alive.
    window.setTimeout(
      () => {
        setResult(parsed);
        setStatus('done');
      },
      reduce ? 0 : 650
    );
  }

  function reset() {
    setStatus('idle');
    setResult(null);
  }

  const fields = result
    ? [
        {label: t('fieldName'), value: result.name, accent: 'text-blue'},
        {label: t('fieldDate'), value: result.date, accent: 'text-indigo'},
        {label: t('fieldParty'), value: result.party, accent: 'text-orange'},
        {label: t('fieldAction'), value: t('actionValue'), accent: 'text-green'}
      ]
    : [];

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="grid gap-5 md:grid-cols-2">
        {/* Input side */}
        <div className="flex flex-col gap-3">
          <label
            htmlFor="intake"
            className="font-mono text-[11px] uppercase tracking-widest text-muted"
          >
            {t('inputLabel')}
          </label>
          <textarea
            id="intake"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')}
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-bg-soft/50 p-4 text-sm text-ink shadow-inner outline-none transition-colors placeholder:text-muted/70 focus:border-indigo/50 focus:bg-bg"
          />
          <div className="flex items-center gap-3">
            {status !== 'done' ? (
              <button
                type="button"
                onClick={run}
                disabled={status === 'parsing'}
                className={buttonClassName('primary', 'md')}
              >
                {status === 'parsing' ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    {t('parsing')}
                  </>
                ) : (
                  t('submit')
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className={buttonClassName('secondary', 'md')}
              >
                {t('again')}
              </button>
            )}
          </div>
        </div>

        {/* Result side */}
        <div className="rounded-xl border border-border bg-bg-soft/40 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-indigo">
            {t('resultTitle')}
          </p>
          <AnimatePresence mode="wait">
            {status === 'done' && result ? (
              <m.ul
                key="result"
                className="flex flex-col gap-2"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {transition: {staggerChildren: reduce ? 0 : 0.08}}
                }}
              >
                {fields.map((f) => (
                  <m.li
                    key={f.label}
                    variants={{
                      hidden: {opacity: 0, y: reduce ? 0 : 8},
                      show: {opacity: 1, y: 0}
                    }}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bg px-3 py-2.5"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      {f.label}
                    </span>
                    <span className={cn('text-sm font-semibold', f.accent)}>
                      {f.value}
                    </span>
                  </m.li>
                ))}
              </m.ul>
            ) : (
              <div
                key="empty"
                className="flex h-[180px] flex-col items-center justify-center gap-2 text-center text-sm text-muted"
              >
                <span className="h-8 w-8 rounded-full bg-gradient-brand opacity-30" />
                <span>{t('hint')}</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
