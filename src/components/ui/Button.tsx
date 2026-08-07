import { clsx } from "clsx";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants = {
  primary: "bg-brand-900 text-cream-100 hover:bg-brand-800",
  secondary: "bg-brand-100 text-brand-900 hover:bg-brand-200",
  outline: "border border-brand-900 text-brand-900 hover:bg-brand-100",
  ghost: "text-brand-900 hover:bg-brand-100",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
