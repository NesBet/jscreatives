"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { portfolioCategories } from "@/content/portfolio";

interface CaseStudyImage {
  id?: string;
  url: string;
  altText: string;
  caption: string;
  stage: string;
  sortOrder: number;
}

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  story: string;
  services: string[];
  year: string;
  coverUrl: string;
  coverAlt: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  images: CaseStudyImage[];
  updatedAt: string;
}

interface StoryForm {
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  story: string;
  services: string;
  year: string;
  coverUrl: string;
  coverAlt: string;
  featured: boolean;
  published: boolean;
  sortOrder: string;
  images: CaseStudyImage[];
}

const stages = ["BEHIND_THE_SCENES", "PROCESS", "DESIGN", "PRODUCTION", "DELIVERY", "RESULT"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyForm(): StoryForm {
  return {
    slug: "",
    title: "",
    client: "",
    category: portfolioCategories[0],
    summary: "",
    story: "",
    services: "",
    year: String(new Date().getFullYear()),
    coverUrl: "",
    coverAlt: "",
    featured: false,
    published: false,
    sortOrder: "0",
    images: [],
  };
}

export default function AdminCaseStudiesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [stories, setStories] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [form, setForm] = useState<StoryForm>(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchStories = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/case-studies");
      if (!response.ok) throw new Error("Could not load case studies.");
      const data = await response.json();
      setStories(data.stories);
    } catch (error) {
      toast("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") void fetchStories();
  }, [user, fetchStories]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (story: CaseStudy) => {
    setEditing(story);
    setForm({
      slug: story.slug,
      title: story.title,
      client: story.client,
      category: story.category,
      summary: story.summary,
      story: story.story,
      services: story.services.join(", "),
      year: story.year,
      coverUrl: story.coverUrl,
      coverAlt: story.coverAlt || "",
      featured: story.featured,
      published: story.published,
      sortOrder: String(story.sortOrder),
      images: story.images.map((image) => ({
        url: image.url,
        altText: image.altText || "",
        caption: image.caption || "",
        stage: image.stage,
        sortOrder: image.sortOrder,
      })),
    });
    setShowModal(true);
  };

  const updateImage = (index: number, patch: Partial<CaseStudyImage>) => {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, ...patch } : image
      ),
    }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
        sortOrder: Number(form.sortOrder) || 0,
        services: form.services.split(",").map((item) => item.trim()).filter(Boolean),
        images: form.images
          .filter((image) => image.url.trim())
          .map((image, index) => ({ ...image, sortOrder: index })),
      };
      const response = await fetch(
        editing ? `/api/admin/case-studies/${editing.id}` : "/api/admin/case-studies",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not save the case study.");
      }
      toast("success", editing ? "Case study updated." : "Case study created.");
      setShowModal(false);
      await fetchStories();
    } catch (error) {
      toast("error", (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStory = async (story: CaseStudy) => {
    if (!confirm(`Delete “${story.title}”? This cannot be undone.`)) return;
    try {
      const response = await fetch(`/api/admin/case-studies/${story.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete the story.");
      toast("success", "Case study deleted.");
      await fetchStories();
    } catch (error) {
      toast("error", (error as Error).message);
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <AdminHeader title="Branding Journeys" />
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">
              Publish behind-the-scenes case studies with process photography,
              captions and project credits.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Published stories appear on the portfolio page. Add gallery images
              from the{" "}
              <Link href="/admin/media" className="text-red-400 hover:text-red-300">
                Media Library
              </Link>
              .
            </p>
          </div>
          <Button type="button" onClick={openCreate}>New branding journey</Button>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-slate-400">Loading case studies...</p>
        ) : stories.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-10 text-center">
            <p className="text-sm text-slate-400">No branding journeys yet.</p>
            <Button type="button" onClick={openCreate} className="mt-4">
              Create the first story
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <article
                key={story.id}
                className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/60"
              >
                <div className="relative aspect-[16/9] bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.coverUrl}
                    alt={story.coverAlt || story.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute left-2 top-2 flex gap-1.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        story.published
                          ? "bg-emerald-500/90 text-slate-950"
                          : "bg-amber-500/90 text-slate-950"
                      }`}
                    >
                      {story.published ? "Live" : "Draft"}
                    </span>
                    {story.featured && (
                      <span className="rounded bg-paper/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    {story.client} · {story.year}
                  </p>
                  <h2 className="mt-1 font-semibold text-white">{story.title}</h2>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {story.summary}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {story.category} · {story.images.length} gallery images
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Button type="button" size="sm" onClick={() => openEdit(story)}>
                      Edit
                    </Button>
                    {story.published && (
                      <Link
                        href={`/portfolio/${story.slug}`}
                        target="_blank"
                        className="inline-flex h-8 items-center rounded-lg bg-slate-700 px-3 text-sm text-white hover:bg-slate-600"
                      >
                        View
                      </Link>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteStory(story)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 p-4 sm:p-8">
          <form
            onSubmit={submit}
            className="mx-auto w-full max-w-4xl rounded-xl border border-slate-700 bg-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-700 p-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editing ? "Edit branding journey" : "New branding journey"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Show the thinking, process and finished work behind a project.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Project title"
                  required
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setForm((current) => ({
                      ...current,
                      title,
                      slug: editing || current.slug ? current.slug : slugify(title),
                    }));
                  }}
                />
                <Input
                  label="Slug"
                  required
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: event.target.value })}
                  placeholder="project-url-slug"
                />
                <Input
                  label="Client"
                  required
                  value={form.client}
                  onChange={(event) => setForm({ ...form, client: event.target.value })}
                />
                <label className="text-xs text-slate-400">
                  Category
                  <select
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                    className="mt-1.5 block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  >
                    {portfolioCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <Input
                  label="Year"
                  required
                  value={form.year}
                  onChange={(event) => setForm({ ...form, year: event.target.value })}
                />
                <Input
                  label="Services (comma separated)"
                  value={form.services}
                  onChange={(event) => setForm({ ...form, services: event.target.value })}
                  placeholder="Brand strategy, Packaging, Print"
                />
              </div>

              <Textarea
                label="Short summary"
                required
                rows={3}
                value={form.summary}
                onChange={(event) => setForm({ ...form, summary: event.target.value })}
              />
              <Textarea
                label="The story"
                required
                rows={10}
                value={form.story}
                onChange={(event) => setForm({ ...form, story: event.target.value })}
                placeholder="The brief, the thinking, the production decisions and the result. Use blank lines for paragraphs."
              />

              <div className="rounded-xl border border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-white">Cover image</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_1fr_140px]">
                  <Input
                    label="Cover URL"
                    required
                    value={form.coverUrl}
                    onChange={(event) => setForm({ ...form, coverUrl: event.target.value })}
                  />
                  <Input
                    label="Cover alt text"
                    value={form.coverAlt}
                    onChange={(event) => setForm({ ...form, coverAlt: event.target.value })}
                  />
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-900">
                    {form.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.coverUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[10px] text-slate-600">
                        Preview
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Behind-the-scenes gallery
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Add process shots, captions and the stage they belong to.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        images: [
                          ...current.images,
                          {
                            url: "",
                            altText: "",
                            caption: "",
                            stage: "BEHIND_THE_SCENES",
                            sortOrder: current.images.length,
                          },
                        ],
                      }))
                    }
                  >
                    Add image
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  {form.images.length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-xs text-slate-500">
                      No gallery images yet.
                    </p>
                  )}
                  {form.images.map((image, index) => (
                    <div
                      key={index}
                      className="grid gap-2 rounded-lg border border-slate-700/70 bg-slate-900/40 p-3 sm:grid-cols-[100px_1fr_1fr_150px_auto]"
                    >
                      <div className="relative aspect-square overflow-hidden rounded bg-slate-900">
                        {image.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-[10px] text-slate-600">
                            Preview
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          aria-label={`Image URL ${index + 1}`}
                          placeholder="Image URL"
                          value={image.url}
                          onChange={(event) => updateImage(index, { url: event.target.value })}
                        />
                        <Input
                          aria-label={`Image alt text ${index + 1}`}
                          placeholder="Alt text"
                          value={image.altText}
                          onChange={(event) => updateImage(index, { altText: event.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          aria-label={`Image caption ${index + 1}`}
                          placeholder="Caption"
                          value={image.caption}
                          onChange={(event) => updateImage(index, { caption: event.target.value })}
                        />
                        <select
                          aria-label={`Image stage ${index + 1}`}
                          value={image.stage}
                          onChange={(event) => updateImage(index, { stage: event.target.value })}
                          className="block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                        >
                          {stages.map((stage) => (
                            <option key={stage} value={stage}>{stage.replaceAll("_", " ")}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-start">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              images: current.images.filter((_, imageIndex) => imageIndex !== index),
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Sort order"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(event) => setForm({ ...form, sortOrder: event.target.value })}
                />
                <label className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                  />
                  Featured on homepage
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(event) => setForm({ ...form, published: event.target.checked })}
                  />
                  Published
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-700 p-5">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                {editing ? "Save changes" : "Create story"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
