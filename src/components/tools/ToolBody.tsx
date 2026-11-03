'use client';

import dynamic from 'next/dynamic';
import type {ToolSlug} from '@/content/tools';
import {MaterialSelector} from '@/components/home2/MaterialSelector';
import {CompareTool} from '@/components/home2/CompareTool';

const loading = () => <div className="min-h-[420px] rounded-[12px] border border-line bg-white" aria-hidden />;
const RequirementBuilder = dynamic(() => import('./RequirementBuilder').then((m) => m.RequirementBuilder), {loading});
const SheetHelper = dynamic(() => import('./SheetHelper').then((m) => m.SheetHelper), {loading});

/** The interactive body of /tools/[tool] (page variants). */
export function ToolBody({slug}: {slug: ToolSlug}) {
  switch (slug) {
    case 'material-selector':
      return <MaterialSelector variant="page" />;
    case 'compare':
      return <CompareTool variant="page" />;
    case 'requirement-builder':
      return <RequirementBuilder />;
    case 'sheet-calculator':
      return <SheetHelper />;
    default:
      return null;
  }
}
