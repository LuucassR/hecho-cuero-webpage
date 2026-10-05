import Link from "next/link";
import { clsx } from "clsx";

// Page numbers to show: always first/last, plus a window around the current
// page, with `null` marking a gap.
function pageWindow(page: number, totalPages: number): (number | null)[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(null);
    result.push(p);
  });
  return result;
}

export function Pagination({
  page,
  totalPages,
  basePath,
  query = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(target: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    if (target > 1) params.set("pagina", String(target));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const linkClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium";

  return (
    <nav aria-label="Paginación" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className={clsx(linkClass, "bg-brand-100 text-brand-800 hover:bg-brand-200")}
        >
          Anterior
        </Link>
      )}
      {pageWindow(page, totalPages).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={clsx(
              linkClass,
              p === page
                ? "bg-brand-900 text-cream-100"
                : "bg-brand-100 text-brand-800 hover:bg-brand-200",
            )}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className={clsx(linkClass, "bg-brand-100 text-brand-800 hover:bg-brand-200")}
        >
          Siguiente
        </Link>
      )}
    </nav>
  );
}
