'use client';

import {cn} from '@/lib/cn';
import {LazyDemo} from './LazyDemo';
import {DemoPoster} from './DemoPoster';
import type {Accent} from './demoAccent';

/**
 * One offering's live demo slot. Poster-first, lazy-loaded on scroll, and
 * play-only-in-view — all handled by <LazyDemo>. Each id maps to its own
 * code-split chunk (never in the page's initial JS) and a matching poster
 * label so the frozen frame mirrors the live whiteboard.
 */
const LOADERS = {
  appFlow: () => import('./AppFlowDemo'),
  erp: () => import('./ErpDemo'),
  automation: () => import('./AutomationDemo'),
  brain: () => import('./BrainDemo'),
  acquisition: () => import('./AcquisitionDemo')
} as const;

export type DemoId = keyof typeof LOADERS;

/** Poster label per demo — matches each demo's <Whiteboard label>. */
const POSTER_LABELS: Record<DemoId, string> = {
  appFlow: 'mobile_app.tsx',
  erp: 'erp_dashboard',
  automation: 'flow_builder',
  brain: 'company_brain',
  acquisition: 'acquisition_engine'
};

export function OfferingDemo({
  id,
  accent,
  className
}: {
  id: DemoId;
  accent: Accent;
  className?: string;
}) {
  return (
    <LazyDemo
      load={LOADERS[id]}
      demoProps={{accent}}
      poster={<DemoPoster label={POSTER_LABELS[id]} accent={accent} />}
      className={cn('aspect-[4/3] w-full sm:aspect-[16/11]', className)}
    />
  );
}
