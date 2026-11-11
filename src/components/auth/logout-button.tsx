"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut, TriangleAlert, X } from "lucide-react";
import { useAuth } from "@/components/layout/auth-provider";

export function LogoutButton() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    submittingRef.current = submitting;
  }, [submitting]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submittingRef.current) {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [open]);

  const close = () => {
    if (submitting) return;
    setOpen(false);
    setError("");
  };

  const handleLogout = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");

      setUser(null);
      setOpen(false);
      router.push("/login");
      router.refresh();
    } catch {
      setError("We could not log you out right now. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.8} />
        Log out
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-description"
            className="relative w-full max-w-md rounded-2xl border border-line bg-paper p-6 text-ink shadow-2xl animate-scale-in sm:p-7"
          >
            <button
              type="button"
              onClick={close}
              disabled={submitting}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-stone transition-colors hover:bg-paper-deep hover:text-ink disabled:opacity-50"
              aria-label="Close logout confirmation"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-600/10 text-red-600">
              <TriangleAlert className="h-6 w-6" strokeWidth={1.7} />
            </span>

            <h2
              id="logout-title"
              className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-ink"
            >
              Log out of your account?
            </h2>
            <p id="logout-description" className="mt-3 text-sm leading-6 text-stone">
              {user?.email ? (
                <>
                  You are signed in as <span className="font-medium text-ink">{user.email}</span>.
                  You will need to sign in again to view your orders and account details.
                </>
              ) : (
                "You will need to sign in again to view your orders and account details."
              )}
            </p>

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={close}
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-line px-5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-paper-deep disabled:opacity-50"
              >
                Stay signed in
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" strokeWidth={1.8} />
                    Yes, log out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
