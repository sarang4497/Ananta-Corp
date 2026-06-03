'use client';

import dynamic from 'next/dynamic';
import {useRef} from 'react';
import {useInView} from 'motion/react';

// recharts is heavy — code-split into its own chunk and only mounted when the
// charts scroll near the viewport, so it never blocks initial load.
const Charts = dynamic(() => import('./RestaurantCharts'), {
  ssr: false,
  loading: () => <Skeleton />
});

function Skeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-[340px] animate-pulse rounded-2xl border border-border bg-bg-soft/50"
        />
      ))}
    </div>
  );
}

export function RestaurantImpactCharts(props: {
  chart1Title: string;
  chart1Caption: string;
  chart2Title: string;
  chart2Caption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '200px'});
  return <div ref={ref}>{inView ? <Charts {...props} /> : <Skeleton />}</div>;
}
