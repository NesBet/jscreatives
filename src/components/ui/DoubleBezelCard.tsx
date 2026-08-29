"use client";

import { ReactNode, forwardRef, HTMLAttributes } from "react";

interface DoubleBezelCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "md" | "lg" | "xl";
}

export const DoubleBezelCard = forwardRef<HTMLDivElement, DoubleBezelCardProps>(
  ({ children, variant = "default", padding = "md", radius = "lg", className, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const radiusClasses = {
      md: "rounded-xl",
      lg: "rounded-2xl",
      xl: "rounded-[2rem]",
    };

    const variantClasses = {
      default: "double-bezel",
      elevated: "double-bezel shadow-[var(--shadow-elevated)]",
      interactive: "double-bezel group transition-all duration-500 ease-[var(--ease-smooth)] hover:shadow-[var(--shadow-glow)] hover:border-white/15 hover:-translate-y-1",
    };

    return (
      <div
        ref={ref}
        className={`${variantClasses[variant]} ${radiusClasses[radius]} ${paddingClasses[padding]} ${className}`}
        {...props}
      >
        <div className="double-bezel-inner rounded-[inherit] p-[1px]">
          <div className="rounded-[inherit] bg-[var(--color-bg-card)]/80 backdrop-blur-sm p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

DoubleBezelCard.displayName = "DoubleBezelCard";