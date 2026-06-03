import {Image as ImageIcon} from 'lucide-react';
import {cn} from '@/lib/cn';

/**
 * Clean, styled stand-in block for a real photo/logo (assets land in a later
 * batch). Soft indigo→orange wash, hairline border, centered glyph + label —
 * deliberately premium, never a broken <img>.
 */
export function ImagePlaceholder({
  label = 'Image coming soon',
  className,
  iconSize = 28
}: {
  label?: string;
  className?: string;
  iconSize?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative grid place-items-center overflow-hidden rounded-2xl border border-border',
        className
      )}
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(29,78,216,0.07) 0%, rgba(30,64,175,0.05) 55%, rgba(249,115,22,0.08) 100%)'
      }}
    >
      {/* Faint grid texture for an architectural feel. */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(30,64,175,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,64,175,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />
      <div className="relative flex flex-col items-center gap-2 p-4 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-bg/80 text-indigo shadow-card">
          <ImageIcon style={{width: iconSize * 0.55, height: iconSize * 0.55}} aria-hidden />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
      </div>
    </div>
  );
}
