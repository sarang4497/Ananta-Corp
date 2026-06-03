'use client';

import dynamic from 'next/dynamic';
import {useRef} from 'react';
import {useInView} from 'motion/react';
import type {ChartSpec} from './IndustryCharts';

// recharts is heavy — code-split into its own chunk and only mounted when the
// charts scroll near the viewport, so it never blocks initial load.
const Charts = dynamic(() => import('./IndustryCharts'), {
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

export function IndustryImpactCharts({chart1, chart2}: {chart1: ChartSpec; chart2: ChartSpec}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '200px'});
  return <div ref={ref}>{inView ? <Charts chart1={chart1} chart2={chart2} /> : <Skeleton />}</div>;
}
