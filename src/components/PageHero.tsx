import type {ReactNode} from 'react';
import {Reveal, RevealItem} from '@/components/ui/Reveal';
import {Pill} from '@/components/ui/Pill';

/** Shared top-of-page hero used by the inner pages. */
export function PageHero({
  eyebrow,
  title,
  sub,
  children
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative shell pb-10 pt-20 text-center sm:pt-24">
      <Reveal trigger="load" stagger={0.1} className="flex flex-col items-center gap-5">
        <RevealItem>
          <Pill>{eyebrow}</Pill>
        </RevealItem>
        <RevealItem>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
            {title}
          </h1>
        </RevealItem>
        {sub && (
          <RevealItem>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {sub}
            </p>
          </RevealItem>
        )}
        {children && <RevealItem>{children}</RevealItem>}
      </Reveal>
    </section>
  );
}
