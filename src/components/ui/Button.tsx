"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "google";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-white text-black hover:bg-white/90 active:scale-[0.98] shadow-[0_8px_30px_rgba(255,255,255,0.12)]",
  secondary:
    "glass-strong text-fg hover:bg-white/[0.08] active:scale-[0.98] ring-shine",
  ghost:
    "text-fg-soft hover:text-fg hover:bg-white/[0.04] active:scale-[0.98]",
  google:
    "glass-strong text-fg hover:bg-white/[0.08] active:scale-[0.98] ring-shine",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-xl gap-1.5",
  md: "h-11 px-5 text-[15px] rounded-2xl gap-2",
  lg: "h-14 px-7 text-base rounded-2xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    icon,
    iconRight,
    loading,
    fullWidth,
    className = "",
    children,
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center font-medium tracking-tight transition-[transform,background-color,color,box-shadow,opacity] duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      <span className="truncate">{children}</span>
      {iconRight}
    </button>
  );
});
