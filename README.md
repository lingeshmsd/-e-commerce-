# E-Commace — Electronics E-Commerce Store

A full-featured electronics e-commerce website built with Next.js 15, PostgreSQL, NextAuth, and Stripe.

## Features

- Product catalog with search, filters, and sorting
- Product detail pages with specifications
- Shopping cart with quantity management
- User registration and authentication
- Stripe Checkout for secure payments
- Order history and profile management
- Admin panel for product and order management

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (Auth.js v5)
- **Payments:** Stripe Checkout

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database ([Neon](https://neon.tech) free tier recommended)
- Stripe account ([dashboard.stripe.com](https://dashboard.stripe.com))

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@host:5432/ecommace?schema=public"
NEXTAUTH_SECRET="generate-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="same-as-nextauth-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

Generate a secret:

```bash
openssl rand -base64 32
```

### 3. Set up the database

```bash
npm run db:push
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Stripe webhooks (local development)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in your `.env` file.

## Demo Accounts

After seeding the database:

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@ecommace.com  | admin123  |
| User  | user@example.com    | user123   |

## Project Structure

```
src/
├── app/                  # Pages and API routes
│   ├── admin/            # Admin dashboard
│   ├── products/         # Product catalog
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Stripe checkout
│   ├── account/          # User profile & orders
│   └── api/              # REST API endpoints
├── components/           # React components
│   ├── layout/           # Header, Footer
│   ├── products/         # Product cards, filters
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout form
│   ├── admin/            # Admin components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities (prisma, auth, stripe)
└── types/                # TypeScript types
```

## Stripe Test Cards

Use these test card numbers in Stripe Checkout:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

Use any future expiry date and any 3-digit CVC.

## Scripts

| Command           | Description                |
|-------------------|----------------------------|
| `npm run dev`     | Start development server   |
| `npm run build`   | Build for production       |
| `npm run start`   | Start production server    |
| `npm run db:push` | Push schema to database    |
| `npm run db:seed` | Seed sample products       |
| `npm run db:studio` | Open Prisma Studio       |

## License

MIT
