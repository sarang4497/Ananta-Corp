import type {ElementType, ReactNode} from 'react';
import {cn} from '@/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
  /** Which gradient to clip the text to. */
  variant?: 'brand' | 'spectrum';
  as?: ElementType;
};

export function GradientText({
  children,
  className,
  variant = 'brand',
  as: Tag = 'span'
}: Props) {
  return (
    <Tag
      className={cn(
        variant === 'spectrum'
          ? 'text-gradient-spectrum'
          : 'text-gradient-brand',
        className
      )}
    >
      {children}
    </Tag>
  );
}
