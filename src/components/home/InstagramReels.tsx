import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const REELS = [
  "https://www.instagram.com/reel/DbmJ-0Etbdz/",
  "https://www.instagram.com/reel/DbrUEPhtyXz/",
];

// One lap through the reels, repeated for width; doubled below so the
// track can loop seamlessly from -50% back to 0.
const LOOP = [...REELS, ...REELS, ...REELS];
const TRACK = [...LOOP, ...LOOP];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

function ReelCard({ href, index }: { href: string; index: number }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver reel de Instagram ${index + 1}`}
      className="group/card relative flex aspect-9/16 w-48 shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-950 text-cream-100 shadow-sm transition-transform duration-300 hover:scale-[1.03] sm:w-56"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_30%_20%,white,transparent_60%)]"
      />
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100/15 backdrop-blur-sm transition-transform duration-300 group-hover/card:scale-110">
        <PlayIcon className="h-6 w-6 translate-x-0.5 text-cream-100" />
      </span>
      <span className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-xs font-medium text-cream-100/90">
        <InstagramIcon className="h-4 w-4 shrink-0" />
        Ver reel en Instagram
      </span>
    </a>
  );
}

export function InstagramReels() {
  return (
    <section className="overflow-hidden py-16">
      <Container>
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            Seguinos en Instagram
          </p>
          <h2 className="font-display text-2xl text-brand-900 sm:text-3xl">
            Mirá nuestros reels
          </h2>
          <a
            href="https://www.instagram.com/hechocuero.sf/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline"
          >
            @hechocuero.sf
          </a>
        </Reveal>
      </Container>

      <div className="reels-marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="animate-marquee flex w-max gap-5 px-4">
          {TRACK.map((href, i) => (
            <ReelCard key={i} href={href} index={i % REELS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
