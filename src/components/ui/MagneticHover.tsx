"use client";

import { ReactNode, useRef, useEffect, useState, forwardRef, HTMLAttributes } from "react";

interface MagneticHoverProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strength?: number;
  scale?: number;
  rotate?: boolean;
}

export const MagneticHover = forwardRef<HTMLDivElement, MagneticHoverProps>(
  ({ children, strength = 15, scale = 1.04, rotate = false, className, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        setMousePos({ x: x * strength, y: y * strength });
      };

      const handleMouseEnter = () => setIsHovering(true);
      const handleMouseLeave = () => {
        setIsHovering(false);
        setMousePos({ x: 0, y: 0 });
      };

      const el = containerRef.current;
      if (!el) return;
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [strength]);

    const transform = `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) ${isHovering ? `scale(${scale})` : ""} ${rotate && isHovering ? `rotateX(${-mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)` : ""}`;

    return (
      <div
        ref={(el) => { if (ref) { if (typeof ref === "function") ref(el); else if (ref) ref.current = el; } containerRef.current = el; }}
        className={`relative overflow-hidden transition-transform duration-500 ease-[var(--ease-spring)] will-change-transform ${className}`}
        style={{ transform, transformOrigin: "center center", transformStyle: "preserve-3d" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      >
        <div className="absolute inset-0 z-0 transition-all duration-700 ease-[var(--ease-spring)]" style={{ transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0) ${isHovering ? `scale(${1 + (scale - 1) * 0.5})` : ""}` }}>
          {children}
        </div>
        <div className="relative z-10 transition-all duration-500 ease-[var(--ease-spring)]" style={{ transform }}>
          {children}
        </div>
      </div>
    );
  }
);

MagneticHover.displayName = "MagneticHover";