'use client';

import {useState} from 'react';
import {LazyMotion, domAnimation, m, useReducedMotion} from 'motion/react';
import {buttonClassName} from '@/components/ui/Button';

/** Mocked per-product playground. Runs entirely client-side. */
export default function ProductDemo({productName}: {productName: string}) {
  const reduce = useReducedMotion();
  const [ran, setRan] = useState(false);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-bg-soft/50 p-4">
          <p className="font-mono text-xs text-muted">
            <span className="text-indigo">{'>'}</span> {productName}.run(input)
          </p>
        </div>

        {!ran ? (
          <button
            type="button"
            onClick={() => setRan(true)}
            className={buttonClassName('primary', 'md', 'self-start')}
          >
            Run mock
          </button>
        ) : (
          <m.div
            initial={{opacity: 0, y: reduce ? 0 : 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            className="rounded-xl border border-green/30 bg-green/5 p-4"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-green">
              output
            </p>
            <pre className="mt-2 overflow-x-auto font-mono text-xs text-ink">
{`{
  "status": "ok",
  "automated": true,
  "result": "[mock output for ${productName}]"
}`}
            </pre>
            <button
              type="button"
              onClick={() => setRan(false)}
              className={buttonClassName('ghost', 'sm', 'mt-3')}
            >
              Reset
            </button>
          </m.div>
        )}
      </div>
    </LazyMotion>
  );
}
