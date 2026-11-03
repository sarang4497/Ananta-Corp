import {Calculator, ClipboardList, Columns2, Layers, Palette} from 'lucide-react';
import type {Tool} from '@/content/tools';

const ICONS = {Layers, Columns2, ClipboardList, Calculator, Palette} as const;

export function ToolIcon({icon, className}: {icon: Tool['icon']; className?: string}) {
  const I = ICONS[icon];
  return <I className={className} aria-hidden />;
}
