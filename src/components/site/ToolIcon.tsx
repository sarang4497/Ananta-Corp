import {Calculator, ClipboardList, Columns2, Layers, Palette, type LucideIcon} from 'lucide-react';
import type {Tool} from '@/content/tools';

const ICONS: Record<Tool['icon'], LucideIcon> = {Layers, Columns2, ClipboardList, Calculator, Palette};

/** Renders the lucide icon named in the TOOLS registry. */
export function ToolIcon({icon, className = 'h-5 w-5'}: {icon: Tool['icon']; className?: string}) {
  const I = ICONS[icon];
  return <I className={className} aria-hidden />;
}
