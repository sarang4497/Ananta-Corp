import {existsSync} from 'fs';
import {join} from 'path';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Reveal, RevealItem} from '@/components/ui/Reveal';

type Person = {name: string; bio: string};

const heading = 'text-2xl font-semibold tracking-tight text-ink sm:text-3xl';
const prose = 'max-w-3xl text-base leading-relaxed text-muted sm:text-lg';

// Resolve the founders photo at its real on-disk case (the repo ships
// founders.PNG; production filesystems are case-sensitive). Falls back to a
// branded placeholder when the file is absent.
const FOUNDER_IMG = ['/about/founders.png', '/about/founders.PNG'].find((p) =>
  existsSync(join(process.cwd(), 'public', p))
);

/**
 * The About story — rendered in the homepage #about section (there is no longer
 * a standalone /about page; the navbar "About" link scrolls here). Founder's Story
 * (text + founders photo), then Vision & Mission and Team. Server Component.
 */
export async function AboutSections() {
  const t = await getTranslations('about');
  const founders = t.raw('founders') as {
    title: string;
    intro: string;
    people: Person[];
    closing: string;
  };
  const vision = t.raw('vision') as {title: string; items: {label: string; body: string}[]};
  const team = t.raw('team') as {title: string; body: string};

  return (
    <Reveal stagger={0.08} className="flex flex-col gap-14 text-left">
      {/* Founder's Story — two columns: story text left, founders photo right
          (stacks on mobile with the photo below the text). Top-aligned: the
          heading sits level with the top of the image, and the image stretches to
          the text's height so its bottom ends with the last line (4:5 on mobile). */}
      <RevealItem className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-5">
          <h2 className={heading}>{founders.title}</h2>
          <p className={prose}>{founders.intro}</p>
          {founders.people.map((person) => (
            <p key={person.name} className={prose}>
              {person.bio}
            </p>
          ))}
          <p className={prose}>{founders.closing}</p>
        </div>

        {FOUNDER_IMG ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border shadow-card lg:aspect-auto lg:h-full">
            <Image
              src={FOUNDER_IMG}
              alt="Sarang Adalja and Giorgia Mannaioli — founders of Studio Marketing Italia"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              // object-top: keep the top of the photo, crop any excess at the bottom.
              className="object-cover object-top"
            />
          </div>
        ) : (
          // TODO: drop the real founders photo at /public/about/founders.png
          <div className="grid aspect-[4/5] w-full place-items-center rounded-2xl border border-border bg-gradient-to-br from-blue/10 via-indigo/10 to-[#B06A9E]/20 shadow-card lg:aspect-auto lg:h-full">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-indigo">
              Founders · TODO
            </span>
          </div>
        )}
      </RevealItem>

      {/* Vision & Mission — two columns (Vision left, Mission right; stacks on
          mobile). The combined heading is intentionally omitted. */}
      <RevealItem className="flex flex-col gap-6">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
          {vision.items.map((it) => (
            <div key={it.label} className="flex flex-col gap-2.5">
              <h3 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{it.label}</h3>
              <p className="text-base leading-relaxed text-muted sm:text-lg">{it.body}</p>
            </div>
          ))}
        </div>
      </RevealItem>

      {/* Team — centered heading, full-bleed body (spans the full content width). */}
      <RevealItem className="flex flex-col gap-4">
        <h2 className={`${heading} text-center`}>{team.title}</h2>
        <p className="text-base leading-relaxed text-muted sm:text-lg">{team.body}</p>
      </RevealItem>
    </Reveal>
  );
}
