-- Enable Row Level Security on all tables in public schema
-- This blocks direct PostgREST access (anon/authenticated) while allowing
-- Prisma to continue working via the postgres/service_role which bypasses RLS.
-- The application accesses data exclusively through Prisma API routes, not Supabase PostgREST.

-- ── Auth tables ──────────────────────────────────────────────────────────
ALTER TABLE public."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."verification_tokens" ENABLE ROW LEVEL SECURITY;

-- ── Product tables ───────────────────────────────────────────────────────
ALTER TABLE public."products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."product_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."product_variants" ENABLE ROW LEVEL SECURITY;

-- ── User data tables ─────────────────────────────────────────────────────
ALTER TABLE public."addresses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."carts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."cart_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."audit_logs" ENABLE ROW LEVEL SECURITY;

-- No permissive policies are created. With RLS enabled and no policies,
-- PostgREST requests from anon/authenticated roles are denied by default.
-- The postgres/service_role used by Prisma (via DATABASE_URL) bypasses RLS,
-- so all application functionality remains unaffected.
--
-- If you later need to expose specific tables via Supabase PostgREST
-- (e.g., public product catalog), add explicit policies such as:
--
--   CREATE POLICY "Allow public read on products"
--     ON public."products" FOR SELECT
--     TO anon, authenticated
--     USING (active = true);
--
-- For now, the secure default (deny all PostgREST) is intentional.
