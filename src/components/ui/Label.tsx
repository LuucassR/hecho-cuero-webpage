import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export function Label({
  className,
  ...props
}: ComponentPropsWithoutRef<"label">) {
  return (
    <label
      className={clsx("mb-1.5 block text-sm font-medium text-brand-900", className)}
      {...props}
    />
  );
}
