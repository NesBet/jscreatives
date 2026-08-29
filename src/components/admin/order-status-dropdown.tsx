"use client";

import { useState, useRef, useEffect } from "react";

export const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const STATUS_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
  PENDING: { dot: "bg-yellow-400", badge: "bg-yellow-600/15 text-yellow-400", label: "Pending" },
  PROCESSING: { dot: "bg-blue-400", badge: "bg-blue-600/15 text-blue-400", label: "Processing" },
  SHIPPED: { dot: "bg-purple-400", badge: "bg-purple-600/15 text-purple-400", label: "Shipped" },
  DELIVERED: { dot: "bg-green-400", badge: "bg-green-600/15 text-green-400", label: "Delivered" },
  CANCELLED: { dot: "bg-red-400", badge: "bg-red-600/15 text-red-400", label: "Cancelled" },
  REFUNDED: { dot: "bg-slate-400", badge: "bg-slate-600/15 text-slate-400", label: "Refunded" },
};

interface OrderStatusDropdownProps {
  value: string;
  onChange: (status: string) => void;
  disabled?: boolean;
}

export function OrderStatusDropdown({ value, onChange, disabled }: OrderStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = STATUS_STYLES[value] || STATUS_STYLES.PENDING;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
          current.badge
        } ${disabled ? "cursor-not-allowed opacity-50" : "hover:brightness-110"}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
        {current.label}
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && !disabled && (
        <div className="absolute right-0 z-30 mt-1 w-44 origin-top animate-fade-in-down rounded-lg border border-slate-700 bg-slate-800 p-1 shadow-xl">
          {ORDER_STATUSES.map((s) => {
            const style = STATUS_STYLES[s];
            const selected = s === value;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs transition-colors duration-150 hover:bg-slate-700 ${
                  selected ? "font-semibold" : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  <span className={style.badge.split(" ")[1]}>{style.label}</span>
                </span>
                {selected && (
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
