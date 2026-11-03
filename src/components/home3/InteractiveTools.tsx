import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {MaterialSelector} from '@/components/home2/MaterialSelector';
import {CompareTool} from '@/components/home2/CompareTool';
import {SECTION, SectionHead} from './ui';

/**
 * 08 + 09 INTERACTIVE MODULES — the live Material Selector and Board
 * Comparison (owned by the tools worker), framed as working demos with a
 * route into the full /tools hub. Anchors #selector / #compare preserved.
 */
export function InteractiveTools() {
  return (
    <section id="tools-demo" aria-labelledby="tools-demo-title" className={`${SECTION} relative bg-white`}>
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="shell relative">
        <SectionHead
          id="tools-demo-title"
          eyebrow="Interactive modules"
          title="Match the grade to the exposure — before you ask for a price."
          lead="Two working tools from the Ananta toolkit. Both use only the specifications published in the catalogue."
          aside={
            <Link href="/tools" className="arrow-nudge inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-indigo">
              Open all tools <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <div className="mt-9 grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_1fr]">
          <div className="min-w-0">
            <MaterialSelector />
          </div>
          <div className="min-w-0">
            <CompareTool />
          </div>
        </div>
      </div>
    </section>
  );
}
