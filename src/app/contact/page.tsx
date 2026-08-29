"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { contactSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  email: string;
  whatsapp: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  whatsapp: "",
  message: "",
};

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast("error", "Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        toast("error", data?.error || "Something went wrong. Please try again.");
        return;
      }

      toast("success", data?.message || "Your message has been sent successfully.");
      setForm(initialForm);
    } catch {
      toast("error", "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-24 lg:py-32">
        <header className="max-w-3xl animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Get In Touch</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-[var(--font-display)]">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Questions about an order, custom printing or anything else? Send us a message and our
            team will get back to you.
          </p>
        </header>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="double-bezel rounded-2xl p-2 animate-fade-in-up">
            <div className="double-bezel-inner rounded-2xl bg-[var(--color-bg-card)]/80 p-6 sm:p-8">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Your Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="jane@example.com"
                    autoComplete="email"
                  />
                </div>
                <Input
                  label="WhatsApp Number"
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={handleChange}
                  error={errors.whatsapp}
                  placeholder="+254 7XX XXX XXX"
                  autoComplete="tel"
                />
                <Textarea
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder="How can we help you?"
                  rows={5}
                />
                <div>
                  <Button type="submit" loading={loading} size="lg">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <aside className="space-y-6 animate-fade-in-up">
            <div className="double-bezel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white font-[var(--font-display)]">Reach Us Directly</h3>
              <ul className="mt-4 space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>We respond to every message within one business day.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>WhatsApp support available for order updates.</span>
                </li>
              </ul>
            </div>
            <div className={cn("rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 p-6")}>
              <p className="text-sm text-slate-400">
                Prefer browsing? Explore our full collection of premium kits and custom printing
                options.
              </p>
              <Link
                href="/catalog"
                className="mt-4 inline-block text-sm font-medium text-red-500 transition-colors hover:text-red-400"
              >
                Go to Catalog &rarr;
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-white">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
