import Image from "next/image";
import { clsx } from "clsx";

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center bg-brand-100 text-brand-400",
          className,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-10 w-10"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5V6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5M3 16.5A1.75 1.75 0 0 0 4.75 18h14.5A1.75 1.75 0 0 0 21 16.5M3 16.5l5.1-5.6a1.5 1.5 0 0 1 2.15-.06L12 12.5m9 4-4.3-4.7a1.5 1.5 0 0 0-2.2 0L12 14.3"
          />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
      priority={priority}
      className={clsx("object-cover", className)}
    />
  );
}
