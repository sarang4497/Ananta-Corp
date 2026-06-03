'use client';

import Image from 'next/image';
import {useState} from 'react';
import {LazyMotion, domAnimation, m, useReducedMotion} from 'motion/react';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

/**
 * On-video "Ask Bella" box. The visitor types directly here; hitting Enter (or
 * send) opens the ONE global Bella chat panel (owned by <ChatWidget> in the
 * layout) via the `open-bella` event, carrying the typed message in as the first
 * question. This box does NOT mount its own panel — that previously created a
 * second, uncoordinated chat instance + launcher. There is now a single panel
 * and a single launcher site-wide.
 */
function openBella(message?: string) {
  window.dispatchEvent(new CustomEvent('open-bella', {detail: {message}}));
}

export function HeroChat({
  greeting,
  placeholder,
  secondary
}: {
  greeting: string;
  placeholder: string;
  secondary: string;
}) {
  const reduce = useReducedMotion();
  const [input, setInput] = useState('');

  const iconBtn =
    'grid h-9 w-9 shrink-0 place-items-center rounded-full transition-transform duration-200';

  function submit() {
    const text = input.trim();
    openBella(text || undefined); // empty enter / click still opens the assistant
    setInput('');
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={reduce ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.55}}
        className="relative w-full max-w-xl"
      >
        {/* Bella — real transparent cut-out (padded so her raised hand is never
            clipped). On MOBILE she's sized by HEIGHT (h-full) so she stands as
            tall as the whole box — head near the top, feet at the bottom —
            bottom-aligned and peeking from the left edge; her width auto-derives
            from the aspect ratio and sits inside the reserved left lane (pl-32)
            so she never covers the label/input, with a small left tuck that
            keeps her fully on-screen (no horizontal overflow). Desktop is
            unchanged: width-based (sm:w-32 / lg:w-40) with h-auto. */}
        <Image
          src="/chatbot/bella.png"
          alt="Bella, your AI assistant"
          width={1081}
          height={1248}
          priority
          className="pointer-events-none absolute bottom-0 left-0 z-20 h-full w-auto -translate-x-[6%] object-contain object-bottom drop-shadow-[0_18px_28px_rgba(79,70,229,0.35)] sm:bottom-2 sm:h-auto sm:w-32 sm:-translate-x-[10%] lg:bottom-3 lg:w-40 lg:-translate-x-[14%]"
        />

        {/* Solid, warm card — soft indigo glow, no black. Left padding reserves
            Bella's lane on every breakpoint so she never covers the text/input. */}
        <div className="relative z-10 w-full rounded-2xl border border-border bg-bg p-4 pl-32 shadow-[0_28px_70px_-22px_rgba(79,70,229,0.5)] sm:pl-32 lg:pl-40">
          <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-bold tracking-tight text-ink">{greeting}</p>
                <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green" aria-hidden />
                  here to help
                </span>
              </div>

              {/* Two-line wrapping textarea so the whole placeholder shows.
                  16px text so iOS never zooms the page on focus. */}
              <div className="mt-2 flex items-end gap-2 rounded-xl border border-border bg-bg-soft/60 px-2.5 py-2 transition-colors focus-within:border-indigo/50">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  rows={2}
                  placeholder={placeholder}
                  aria-label={greeting}
                  className="min-h-[3rem] max-h-28 min-w-0 flex-1 resize-none bg-transparent px-1 py-0.5 text-[16px] leading-relaxed text-ink outline-none placeholder:text-muted/80"
                />

                <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
                  {/* Mic — opens the chat. */}
                  <button
                    type="button"
                    onClick={() => openBella()}
                    aria-label={greeting}
                    className={cn(iconBtn, 'border border-border bg-bg text-muted hover:text-indigo')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 11a7 7 0 0 0 14 0M12 18v3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Send */}
                  <button
                    type="button"
                    onClick={submit}
                    aria-label={greeting}
                    className={cn(iconBtn, 'bg-gradient-brand text-white hover:-translate-y-0.5')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M4 12l16-8-6 16-2.5-6.5L4 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="text-xs font-medium text-indigo no-underline transition-colors hover:text-blue"
                >
                  {secondary}
                </Link>
              </div>
            </div>
          </div>
      </m.div>
    </LazyMotion>
  );
}
