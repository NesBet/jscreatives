"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { AdminHeader } from "@/components/admin/admin-header";

interface QuoteRequest {
  id: string;
  fullName: string;
  companyName: string | null;
  phone: string;
  email: string;
  service: string;
  productName: string | null;
  quantity: number;
  preferredColor: string | null;
  description: string;
  preferredDeliveryDate: string | null;
  additionalInstructions: string | null;
  artworkName: string | null;
  artworkSize: number | null;
  status: string;
  internalNotes: string | null;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const QUOTE_STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "CLOSED"];
const MESSAGE_STATUSES = ["NEW", "READ", "REPLIED", "CLOSED"];

const statusStyles: Record<string, string> = {
  NEW: "text-amber-300",
  CONTACTED: "text-blue-300",
  QUOTED: "text-purple-300",
  WON: "text-emerald-300",
  REPLIED: "text-emerald-300",
  READ: "text-blue-300",
  CLOSED: "text-slate-400",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function QuoteRow({
  quote,
  expanded,
  onToggle,
  onUpdate,
}: {
  quote: QuoteRequest;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, patch: Record<string, unknown>) => Promise<void>;
}) {
  const [notes, setNotes] = useState(quote.internalNotes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const saveNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    await onUpdate(quote.id, { internalNotes: notes.trim() || null });
    setSavingNotes(false);
    setNotesSaved(true);
  };

  return (
    <>
      <tr
        className="cursor-pointer border-b border-slate-700/50 hover:bg-slate-700/30"
        onClick={onToggle}
      >
        <td className="p-4">
          <p className="font-medium text-white">{quote.fullName}</p>
          <p className="text-xs text-slate-400">{quote.companyName || "Individual"}</p>
        </td>
        <td className="p-4">
          <p className="text-slate-200">{quote.service}</p>
          <p className="text-xs text-slate-500">
            {quote.productName || "General enquiry"} · Qty {quote.quantity}
          </p>
        </td>
        <td className="p-4">
          <p className="text-slate-300">{quote.email}</p>
          <p className="text-xs text-slate-500">{quote.phone}</p>
        </td>
        <td className="p-4 text-slate-400">{formatDate(quote.createdAt)}</td>
        <td className="p-4" onClick={(event) => event.stopPropagation()}>
          <select
            value={quote.status}
            onChange={(event) => onUpdate(quote.id, { status: event.target.value })}
            className={`rounded-lg border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold focus:border-amber-500 focus:outline-none ${statusStyles[quote.status] || "text-slate-300"}`}
            aria-label={`Status for ${quote.fullName}`}
          >
            {QUOTE_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </td>
        <td className="p-4 text-right text-slate-500">{expanded ? "▲" : "▼"}</td>
      </tr>
      {expanded && (
        <tr className="border-b border-slate-700/50 bg-slate-900/60">
          <td colSpan={6} className="p-5">
            <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Brief</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">{quote.description}</p>
                </div>
                {quote.additionalInstructions && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Additional instructions</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">{quote.additionalInstructions}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <p className="text-slate-500">Colour: <span className="text-slate-300">{quote.preferredColor || "Not specified"}</span></p>
                  <p className="text-slate-500">Delivery: <span className="text-slate-300">{quote.preferredDeliveryDate || "Flexible"}</span></p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Artwork</p>
                  {quote.artworkName ? (
                    <a
                      href={`/api/admin/quotes/${quote.id}/artwork`}
                      className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-amber-300 hover:text-amber-200"
                    >
                      {quote.artworkName}
                      <span className="text-xs text-slate-500">{formatBytes(quote.artworkSize)}</span>
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">No artwork uploaded.</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor={`notes-${quote.id}`} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Internal notes
                </label>
                <textarea
                  id={`notes-${quote.id}`}
                  value={notes}
                  onChange={(event) => {
                    setNotes(event.target.value);
                    setNotesSaved(false);
                  }}
                  rows={5}
                  placeholder="Quoted amount, follow-up date, production notes..."
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={saveNotes}
                    disabled={savingNotes}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
                  >
                    {savingNotes ? "Saving..." : "Save notes"}
                  </button>
                  {notesSaved && <span className="text-xs text-emerald-400">Saved</span>}
                </div>
                <a
                  href={`mailto:${quote.email}?subject=${encodeURIComponent(`Your quote request with JsCreatives`)}`}
                  className="mt-4 inline-block text-xs font-semibold text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white"
                >
                  Reply by email
                </a>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function MessageRow({
  message,
  expanded,
  onToggle,
  onUpdate,
}: {
  message: ContactMessage;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, status: string) => Promise<void>;
}) {
  return (
    <>
      <tr
        className="cursor-pointer border-b border-slate-700/50 hover:bg-slate-700/30"
        onClick={onToggle}
      >
        <td className="p-4">
          <p className="font-medium text-white">{message.name}</p>
          <p className="text-xs text-slate-400">{message.company || "Individual"}</p>
        </td>
        <td className="p-4">
          <p className="text-slate-200">{message.service || "General enquiry"}</p>
          <p className="text-xs text-slate-500">{message.email}</p>
        </td>
        <td className="p-4 text-slate-400">{message.phone || "Not provided"}</td>
        <td className="p-4 text-slate-400">{formatDate(message.createdAt)}</td>
        <td className="p-4" onClick={(event) => event.stopPropagation()}>
          <select
            value={message.status}
            onChange={(event) => onUpdate(message.id, event.target.value)}
            className={`rounded-lg border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold focus:border-amber-500 focus:outline-none ${statusStyles[message.status] || "text-slate-300"}`}
            aria-label={`Status for ${message.name}`}
          >
            {MESSAGE_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </td>
        <td className="p-4 text-right text-slate-500">{expanded ? "▲" : "▼"}</td>
      </tr>
      {expanded && (
        <tr className="border-b border-slate-700/50 bg-slate-900/60">
          <td colSpan={6} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Message</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">{message.message}</p>
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent("Re: Your enquiry with JsCreatives")}`}
              className="mt-4 inline-block text-xs font-semibold text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-white"
            >
              Reply by email
            </a>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminEnquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<"quotes" | "messages">("quotes");
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchData = useCallback(async (signal: AbortSignal) => {
    const params = new URLSearchParams({ page: page.toString(), perPage: "20" });
    if (status) params.set("status", status);
    if (query) params.set("search", query);

    try {
      const endpoint = tab === "quotes" ? "quotes" : "messages";
      const response = await fetch(`/api/admin/${endpoint}?${params}`, { signal });
      if (!response.ok) throw new Error("Could not load enquiries.");
      const data = await response.json();
      if (tab === "quotes") setQuotes(data.quotes);
      else setMessages(data.messages);
      setTotalPages(data.pagination.totalPages || 1);
      setTotal(data.pagination.total || 0);
      setError("");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message);
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [tab, page, status, query]);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData(controller.signal);
    return () => controller.abort();
  }, [user, fetchData]);

  const updateQuote = async (id: string, patch: Record<string, unknown>) => {
    const response = await fetch(`/api/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (response.ok) {
      setQuotes((current) => current.map((quote) => (
        quote.id === id ? { ...quote, ...patch } as QuoteRequest : quote
      )));
    }
  };

  const updateMessage = async (id: string, nextStatus: string) => {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (response.ok) {
      setMessages((current) => current.map((message) => (
        message.id === id ? { ...message, status: nextStatus } : message
      )));
    }
  };

  const changeTab = (nextTab: "quotes" | "messages") => {
    if (nextTab === tab) return;
    setLoading(true);
    setError("");
    setTab(nextTab);
    setPage(1);
    setStatus("");
    setSearch("");
    setQuery("");
    setExpandedId(null);
  };

  const changePage = (nextPage: number) => {
    setLoading(true);
    setError("");
    setPage(nextPage);
  };

  if (authLoading || !user) return null;

  const statuses = tab === "quotes" ? QUOTE_STATUSES : MESSAGE_STATUSES;

  return (
    <>
      <AdminHeader title="Enquiries" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-700 pb-4">
          {[
            { id: "quotes", label: "Quote Requests" },
            { id: "messages", label: "Contact Messages" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => changeTab(item.id as "quotes" | "messages")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                tab === item.id
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-500">{total} total</span>
        </div>

        <form
          className="mt-5 flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setLoading(true);
            setError("");
            setPage(1);
            setQuery(search.trim());
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, company..."
            className="min-w-60 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
          <select
            value={status}
            onChange={(event) => {
              setLoading(true);
              setError("");
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
          >
            Search
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">{tab === "quotes" ? "Request" : "Message"}</th>
                <th className="p-4 font-medium">{tab === "quotes" ? "Email / Phone" : "Phone"}</th>
                <th className="p-4 font-medium">Received</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : tab === "quotes" && quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No quote requests found.</td>
                </tr>
              ) : tab === "messages" && messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No contact messages found.</td>
                </tr>
              ) : tab === "quotes" ? (
                quotes.map((quote) => (
                  <QuoteRow
                    key={quote.id}
                    quote={quote}
                    expanded={expandedId === quote.id}
                    onToggle={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
                    onUpdate={updateQuote}
                  />
                ))
              ) : (
                messages.map((message) => (
                  <MessageRow
                    key={message.id}
                    message={message}
                    expanded={expandedId === message.id}
                    onToggle={() => setExpandedId(expandedId === message.id ? null : message.id)}
                    onUpdate={updateMessage}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
            <button
              type="button"
              onClick={() => changePage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-600 px-3 py-1.5 transition-colors hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              type="button"
              onClick={() => changePage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-600 px-3 py-1.5 transition-colors hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
