import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export function Input({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={clsx(
        "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-brand-950 placeholder:text-muted/60 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200",
        className,
      )}
      {...props}
    />
  );
}
