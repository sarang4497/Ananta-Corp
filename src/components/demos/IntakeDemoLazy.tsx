'use client';

import dynamic from 'next/dynamic';
import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {DemoSkeleton} from './DemoSkeleton';
import {buttonClassName} from '@/components/ui/Button';

// Code-split into its own chunk. ssr:false keeps it out of the initial payload —
// the JS only downloads once the demo is activated.
const IntakeDemo = dynamic(() => import('./IntakeDemo'), {
  ssr: false,
  loading: () => <DemoSkeleton />
});

/**
 * Gate around the intake demo: shows a skeleton + "Launch demo" button and only
 * pulls the demo chunk when it scrolls into view or the user clicks launch.
 */
export function IntakeDemoLazy() {
  const t = useTranslations('home.playground.demo');
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || active) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      {rootMargin: '240px'}
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  return (
    <div ref={ref}>
      {active ? (
        <IntakeDemo />
      ) : (
        <div className="relative">
          <DemoSkeleton />
          <div className="absolute inset-0 grid place-items-center">
            <button
              type="button"
              onClick={() => setActive(true)}
              className={buttonClassName('primary', 'md')}
            >
              {t('launch')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
