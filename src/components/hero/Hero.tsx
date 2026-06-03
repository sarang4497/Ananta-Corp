import {getTranslations} from 'next-intl/server';
import {Marquee} from '@/components/ui/Marquee';
import {HeroChat} from './HeroChat';
import {HeroVideo} from './HeroVideo';

/**
 * Above-the-fold hero video stage. Server Component — pulls copy from the
 * `home.hero` namespace and composes the interactive client leaves.
 *
 * The pinned top block (sticky navbar + the banner rows in <PinnedBanner>) sits
 * above this; this section fills exactly the remaining viewport —
 * calc(100svh - var(--pinned-h)) — so the pinned block + video = 100svh, with the
 * on-video chat panel and a marquee pinned to its bottom edge. Everything from
 * here down scrolls beneath the pinned block.
 */
export async function Hero() {
  const t = await getTranslations('home.hero');
  const marquee = t.raw('marquee') as string[];

  return (
    <section className="relative flex h-[calc(100svh-var(--pinned-h))] flex-col overflow-hidden">
      {/* Video stage fills the remaining viewport height below the pinned block. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <HeroVideo />

        <div className="relative z-10 flex h-full flex-col">
          {/* Chat panel, lower-center over the video. */}
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4">
            <HeroChat
              greeting={t('chatGreeting')}
              placeholder={t('chatPlaceholder')}
              secondary={t('chatSecondary')}
            />
          </div>

          {/* Solid white divider line: full-width, thin, sitting exactly between
              the bottom of the video and the top of the yellow marquee band. It
              lives in the column flow above the shrink-0 marquee, so the marquee
              keeps its exact size while the flexible video area absorbs the line. */}
          <div className="h-[2px] w-full shrink-0 bg-white" aria-hidden />

          {/* Bright-yellow marquee, flush below the white divider — no gap: the
              video ends at the white line, and this band begins right under it. */}
          <div className="shrink-0 bg-[#FFFD01] py-3">
            <Marquee items={marquee} />
          </div>
        </div>
      </div>
    </section>
  );
}
