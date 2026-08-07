import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export function Select({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"select">) {
  return (
    <select
      className={clsx(
        "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-brand-950 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
