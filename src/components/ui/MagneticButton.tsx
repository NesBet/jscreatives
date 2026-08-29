"use client";

import { ReactNode, useRef, AnchorHTMLAttributes } from "react";

interface MagneticButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  className?: string;
}

export const MagneticButton = ({ children, variant = "primary", size = "md", icon, iconPosition = "right", href, className, ...props }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const variantStyles = {
    primary: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-glow)]",
    secondary: "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-bg-card)] hover:border-[var(--color-border-strong)]",
    ghost: "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]",
    danger: "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50 hover:text-red-300",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-7 py-3.5 text-sm",
    lg: "px-10 py-4 text-base",
  };

  return (
    <a
      ref={(el: HTMLAnchorElement | null) => { buttonRef.current = el; }}
      href={href}
      className={`magnetic-btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-300 ease-[var(--ease-spring)] active:scale-[0.97] ${sizeStyles[size as keyof typeof sizeStyles]} ${variantStyles[variant as keyof typeof variantStyles]} ${className}`}
      style={{ transform: `translate(var(--mx, 0px), var(--my, 0px))` }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
        <span className="relative z-10">{children}</span>
        {icon && iconPosition === "right" && (
          <span className="btn-icon relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 ml-2 transition-all duration-300 ease-[var(--ease-spring)]">
            {icon}
          </span>
        )}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-full" aria-hidden="true" />
    </a>
  );
}

MagneticButton.displayName = "MagneticButton";