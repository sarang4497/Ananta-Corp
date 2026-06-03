import Image from 'next/image';

/**
 * The two real client photos, side by side, spanning the full content width
 * (respecting the page gutters) at the end of the dental case study. Equal
 * heights via a shared aspect ratio + object-cover; rounded-2xl, soft shadow,
 * no black. Stacks on mobile.
 */
const PHOTOS = [
  {src: '/case-studies/client-1.jpeg', alt: 'Our team with a client'},
  {src: '/case-studies/client-2.jpeg', alt: 'Our team with a client'}
];

export function ClientPhotosPair() {
  return (
    <figure className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {PHOTOS.map((p) => (
          <div
            key={p.src}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-bg shadow-glow"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 92vw, 46vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <figcaption className="text-center text-sm font-medium text-muted">Our team with clients</figcaption>
    </figure>
  );
}
