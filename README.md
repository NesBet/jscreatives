# JSCREATIVES — Premium Custom Jerseys, Posters, Banners & Cards

A full-stack e-commerce platform for custom football merchandise (jerseys, posters, banners, cards) with name & number printing, built with **Next.js 16 (App Router, TypeScript, Turbopack)**, **Prisma + PostgreSQL**, **Paystack** payments, and **n8n**-powered WhatsApp OTP authentication.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript, Turbopack)
- **Database**: PostgreSQL (Supabase) via Prisma ORM
- **Styling**: Tailwind CSS v4 (`@theme` tokens in `globals.css`)
- **Payments**: Paystack (initialization + webhook)
- **Auth**: Custom JWT (`jose`) + `bcryptjs`, in an HTTP-only session cookie. **No email/password sign-in** — users authenticate with a **WhatsApp number + OTP** sent/verified through **n8n** webhooks.
- **Automation**: n8n webhooks for OTP delivery, OTP verification, WhatsApp-number checks, and the contact form.
- **Animation**: GSAP (hero/scroll), Framer Motion (`useReducedMotion`), custom CSS keyframes.

## How Authentication Works

1. **Request OTP** (`/api/auth/request-otp`)
   - **Login**: the app checks the DB for a registered `phone`; if found, it asks n8n to send a WhatsApp code.
   - **Signup**: the app checks for an existing account, verifies the number is actually on **WhatsApp** (`VERIFY_USER_NUMBER`), then asks n8n to send the code.
2. **Verify OTP** (`/api/auth/verify-otp`)
   - n8n verifies the code. On success the app creates (signup) or logs in (login) the user and issues a session cookie.
3. **Session** (`src/lib/session.ts`)
   - A `jose` JWT in an HTTP-only, Secure, SameSite cookie. **Expires after 30 minutes of inactivity**; `src/proxy.ts` (Next.js 16 proxy) refreshes it on authenticated navigation.
4. **Brute-force protection**
   - 4 OTP attempts per number, then a **10-minute lock** (`lockedUntil`), enforced **server-side per phone number** inside n8n (`jscreatives_verifications` table). The app surfaces `locked` / `lockedUntil` so the UI shows a live countdown that survives refresh / new tab.

**Phone format**: the app sends numbers to n8n **without** `+` (e.g. `254780237794`); the DB stores E.164 **with** `+` (e.g. `+254780237794`). Supported countries: **Kenya `+254`, Tanzania `+255`, Uganda `+256`**.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

- `DATABASE_URL` — PostgreSQL connection string (Supabase).
- `NEXTAUTH_SECRET` — used as the session/JWT signing secret. Generate with `openssl rand -base64 32`.
- `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` — from your Paystack dashboard.
- `N8N_CONTACT_SECRET` — shared secret sent as the `N8N_CONTACT_SECRET` header to authenticate **all** n8n webhook calls (contact + auth). Must match the Header Auth value on each n8n webhook node.
- `CONTACT_WEBHOOK_URL` — n8n contact-form webhook (app waits for the response).
- `AUTH_OTP_WEBHOOK_URL` — n8n webhook that **sends** the WhatsApp OTP. Receives `{ mode: 'login'|'signup', phone, name?, email? }`.
- `AUTH_VERIFY_WEBHOOK_URL` — n8n webhook that **verifies** the OTP. Receives `{ mode, phone, code, name?, email? }` and returns `{ success, attemptsRemaining?, locked?, lockedUntil?, message? }`.
- `VERIFY_USER_NUMBER` — n8n webhook that checks a number is on WhatsApp during signup. Receives `{ phone }`, returns `{ onWhatsApp, message? }`.
- `ACCOUNT_DEFAULT_PASSWORD_HASH` — `bcryptjs` hash applied to seeded accounts and OTP-created accounts. Generate with:
  ```bash
  node -e "require('bcryptjs').hash('your-password',12).then(h=>console.log(h))"
  ```

### 3. Database

```bash
npx prisma generate
npx prisma db push
```

The `User` model includes a unique `phone` field (E.164). The OTP verification table (`jscreatives_verifications`) lives in the Postgres instance connected to n8n, not in this app's Prisma schema.

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- **Admin**: phone `+254780237794` (email `admin@jscreatives.com`, role `ADMIN`)
- **Customer**: Nesh Rono, phone `+254794249775` (email `nesh.rono69@gmail.com`, role `CUSTOMER`)
- **39 jersey products** (13 clubs × 3 kit types: HOME / AWAY / THIRD) with images and size variants (S–XXL)

Seeded accounts use `ACCOUNT_DEFAULT_PASSWORD_HASH` as their password hash.

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

Sign in by entering the phone number and the WhatsApp OTP (delivered via the configured n8n flow).

## Features

### Customer
- Browse jerseys by club, kit type, price; per-page dropdown for results count.
- Product detail pages with image carousel and custom name/number printing.
- Shopping cart with persistent state.
- Paystack checkout integration and order history/tracking.
- WhatsApp-number OTP sign-in / sign-up with 10-minute lockout after 4 failed attempts.

### Admin
- Dashboard with sales metrics.
- Product CRUD management.
- Order management with status updates.
- User management.
- Payment transaction logs and audit logging.

## Security Measures

- Passwords / placeholders hashed with `bcryptjs` (12 rounds).
- JWT (`jose`) in HTTP-only, Secure, SameSite=Lax cookies.
- **30-minute inactivity session** expiry, refreshed by the proxy (`src/proxy.ts`).
- Rate limiting on auth endpoints: login OTP `5/min`, signup OTP `3/15min`, verify OTP `10/10min`.
- **Server-enforced OTP lockout**: 4 attempts → 10-minute lock per phone number (n8n `jscreatives_verifications`).
- `N8N_CONTACT_SECRET` header authentication on every n8n webhook call.
- Server-side input validation with Zod.
- Role-based access control (RBAC: ADMIN / CUSTOMER) enforced in API routes and the proxy (`src/proxy.ts`).
- Paystack webhook signature verification.
- Security headers (CSP, X-Frame-Options, HSTS, etc.).
- Parameterized queries via Prisma (no raw SQL injection).
- XSS prevention via input sanitization.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── request-otp/   # Send OTP (login or signup)
│   │   │   ├── verify-otp/    # Verify OTP, create/login user, set session
│   │   │   ├── logout/        # Clear session cookie
│   │   │   └── me/            # Get current user
│   │   ├── cart/              # Cart CRUD
│   │   ├── orders/            # Order management
│   │   ├── payments/          # Paystack webhook
│   │   ├── products/          # Product listings
│   │   ├── contact/           # Contact form → n8n webhook
│   │   └── admin/             # Admin-only endpoints
│   ├── admin/                 # Admin panel pages
│   ├── cart/                  # Shopping cart page
│   ├── catalog/               # Product catalog
│   ├── checkout/              # Checkout flow
│   ├── account/               # User account pages
│   ├── login/                 # Login (phone + OTP)
│   ├── register/              # Registration (phone + OTP)
│   └── products/              # Product detail pages
├── components/
│   ├── admin/                 # Admin panel components
│   ├── auth/                  # phone-auth-form, otp-input
│   ├── cart/                  # Cart components
│   ├── layout/                # Header, Footer, Providers, AuthProvider
│   ├── products/              # Product display components
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── auth.ts                # getCurrentUser, password hashing
│   ├── session.ts             # JWT session create/verify/refresh + cookie helpers
│   ├── n8n.ts                 # callN8n() helper (N8N_CONTACT_SECRET header, 15s timeout)
│   ├── prisma.ts              # Database client
│   ├── validations.ts         # Zod schemas (requestOtp, verifyOtp, phone)
│   ├── paystack.ts            # Payment integration
│   ├── rate-limit.ts          # Rate limiting
│   ├── audit.ts               # Audit logging
│   └── utils.ts               # General utilities
├── constants/
│   └── countries.ts           # EAST_AFRICA_COUNTRIES (KE/TZ/UG) + buildE164
└── proxy.ts                   # 30-min inactivity enforcement + route/role protection (Next.js 16 proxy convention)
prisma/
├── schema.prisma              # Database schema
└── seed.ts                    # Database seeder (admin, Nesh, 39 products)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/request-otp | Public | Send WhatsApp OTP (login or signup) |
| POST | /api/auth/verify-otp | Public | Verify OTP, create/login user, set session |
| POST | /api/auth/logout | Public | Clear session cookie |
| GET | /api/auth/me | User | Get current user |
| GET | /api/products | Public | List products |
| GET | /api/products/[slug] | Public | Product detail |
| GET/POST | /api/cart | User | Get/add to cart |
| PATCH/DELETE | /api/cart/[itemId] | User | Update/remove item |
| POST | /api/orders | User | Create order |
| GET | /api/orders | User | List user orders |
| POST | /api/payments/webhook | Public | Paystack webhook |
| GET/POST | /api/admin/* | Admin | Admin CRUD operations |

## Notes

- The hero "Premium Custom (Jerseys, Posters, Banners, Cards)" rotator is a JS-driven, accessibility-aware animation (respects `prefers-reduced-motion`).
- Currency is displayed as `Ksh`.
- Type safety is enforced with `tsc --noEmit`; lint with `eslint` (no explicit `any`). Both must pass for `next build`.
