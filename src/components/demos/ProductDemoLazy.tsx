'use client';

import dynamic from 'next/dynamic';
import {useEffect, useRef, useState} from 'react';
import {DemoSkeleton} from './DemoSkeleton';
import {buttonClassName} from '@/components/ui/Button';

// Own code-split chunk; ssr:false keeps it out of the initial payload.
const ProductDemo = dynamic(() => import('./ProductDemo'), {
  ssr: false,
  loading: () => <DemoSkeleton />
});

/** Gate: loads the product demo chunk on scroll-into-view or launch click. */
export function ProductDemoLazy({
  productName,
  launchLabel
}: {
  productName: string;
  launchLabel: string;
}) {
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
        <ProductDemo productName={productName} />
      ) : (
        <div className="relative">
          <DemoSkeleton />
          <div className="absolute inset-0 grid place-items-center">
            <button
              type="button"
              onClick={() => setActive(true)}
              className={buttonClassName('primary', 'md')}
            >
              {launchLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
