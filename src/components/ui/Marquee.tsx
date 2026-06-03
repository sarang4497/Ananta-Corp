import {Fragment, type ReactNode} from 'react';
import {cn} from '@/lib/cn';

// Tricolor word cycle for the marquee text: red → dark blue → dark green.
const PALETTE = ['#EF4444', '#15183B', '#15803D'] as const;

function ColorWords({text}: {text: string}) {
  const words = text.split(' ');
  return (
    <span className="whitespace-nowrap">
      {words.map((word, i) => (
        <Fragment key={i}>
          <span style={{color: PALETTE[i % PALETTE.length]}}>{word}</span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}

type Props = {
  items: ReactNode[];
  className?: string;
  /** Pause the ticker when hovered. */
  pauseOnHover?: boolean;
};

/**
 * Infinite ticker. Pure CSS animation (animate-marquee) — no JS. The item list
 * is rendered twice so the -50% translate loops seamlessly.
 */
export function Marquee({items, className, pauseOnHover = true}: Props) {
  return (
    <div
      className={cn(
        'group relative flex w-full overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className
      )}
    >
      <div
        className={cn(
          'flex min-w-full shrink-0 animate-marquee items-center gap-12 pr-12',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
        aria-hidden={false}
      >
        {items.map((item, i) => (
          <MarqueeItem key={`a-${i}`}>{item}</MarqueeItem>
        ))}
      </div>
      <div
        className={cn(
          'flex min-w-full shrink-0 animate-marquee items-center gap-12 pr-12',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
        aria-hidden
      >
        {items.map((item, i) => (
          <MarqueeItem key={`b-${i}`}>{item}</MarqueeItem>
        ))}
      </div>
    </div>
  );
}

function MarqueeItem({children}: {children: ReactNode}) {
  return (
    <span className="flex items-center gap-3 text-lg font-bold uppercase tracking-[0.12em] [word-spacing:0.4em]">
      {typeof children === 'string' ? <ColorWords text={children} /> : children}
      <span className="h-1.5 w-1.5 rounded-full bg-[#15183b]" aria-hidden />
    </span>
  );
}
