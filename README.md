# MarketHub — Multi-Vendor E-Commerce Marketplace (MVP)

A production-oriented full-stack marketplace MVP inspired by Jumia, eBay, and Walmart. Version 1 focuses on core flows; advanced features (recommendations, flash sales, sponsored listings, analytics) are planned for v2.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, Zustand |
| Backend | Node.js, Express 5, TypeScript |
| Database | Supabase (PostgreSQL), Prisma ORM |
| Auth | JWT (+ Google OAuth endpoint ready) |
| Payments | Stripe (mock mode without API key) |
| Images | URLs (Cloudinary-ready for v2) |

## Project Structure

```
├── backend/          # Express API + Prisma
│   ├── prisma/       # Schema + seed
│   └── src/
│       ├── routes/   # auth, products, cart, orders, seller, ...
│       └── middleware/
└── frontend/         # Next.js App Router
    └── src/
        ├── app/        # Pages
        ├── components/
        └── store/      # Zustand (auth, cart)
```

## MVP Features (v1)

### Customers
- Register / login
- Browse & search products (autocomplete)
- Filter by price, brand, rating, location
- Product detail pages with reviews
- Cart & checkout
- Order history & tracking status
- Wishlist
- Customer account dashboard

### Sellers
- Seller registration with store name
- Seller dashboard (products, revenue, orders)
- Create & manage products
- View vendor storefront

### Marketplace
- Multiple vendors
- Vendor storefront pages
- Featured products on homepage
- Categories & subcategories

### Security (backend)
- bcrypt password hashing
- JWT authentication
- Rate limiting
- Helmet (XSS headers)
- Zod input validation
- Role-based access control (CUSTOMER, SELLER, ADMIN)

## Getting Started

### Quick start (3 steps)

```bash
cd "/Users/mac/Documents/NEW WEBSITE"

# 1) Install Node (if you don't have npm) + all dependencies
npm run install-node    # skip if you already have Node 20+
npm run setup:deps

# 2) Add Supabase credentials to backend/.env (see section below)

# 3) Create tables + seed demo data, then run
npm run setup
npm run dev:backend     # terminal 1 → http://localhost:4000
npm run dev:frontend    # terminal 2 → http://localhost:3000
```

> Scripts use `.tools/node` automatically when system `npm` is missing.

### Prerequisites

- Node.js 20+ (or run `npm run install-node`)
- [Supabase](https://supabase.com) project (free tier works)

### 1. Supabase database

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **Project Settings → Database**.
3. Copy two connection strings (replace `[YOUR-PASSWORD]` with your database password):

| Variable | Where in Supabase | Use for |
|----------|-------------------|---------|
| `DATABASE_URL` | **Connection pooling** → URI → **Transaction** mode (port **6543**) | Running the API |
| `DIRECT_URL` | **Connection string** → URI (port **5432**) | `prisma db push`, migrations, seed |

4. Append `?pgbouncer=true` to the pooled URL if it is not already included (required for Prisma with the pooler).

Example `backend/.env`:

```env
DATABASE_URL="postgresql://postgres.xxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
JWT_SECRET=your-long-random-secret
```

> **Tip:** In the Supabase dashboard, use **Connect** on the project home page and choose **ORMs → Prisma** for copy-paste URLs.

### 2. Configure `backend/.env`

Edit `backend/.env` (created by `setup:deps`) with your real Supabase URLs and a strong `JWT_SECRET`.

Then sync the database:

```bash
npm run setup    # prisma db push + seed (requires valid .env)
```

Or only install deps without touching the database:

```bash
npm run setup:deps
```

### 3. Run the app

Use two terminals:

```bash
# Terminal 1 — API (http://localhost:4000)
npm run dev:backend

# Terminal 2 — Storefront (http://localhost:3000)
npm run dev:frontend
```

Or manually:

```bash
cd backend && npm run dev
cd frontend && npm run dev   # ensure .env.local has NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Troubleshooting (Supabase)

| Error | Fix |
|-------|-----|
| `Environment variable not found: DIRECT_URL` | Add `DIRECT_URL` in `backend/.env` (port **5432**), or re-run `npm run setup` to auto-derive it |
| `Can't reach database server` | Verify password/region; allow your IP in Supabase → Database → Network |
| `prepared statement` / PgBouncer errors | Use `?pgbouncer=true` on `DATABASE_URL` (port **6543**) only |
| Special characters in DB password | URL-encode the password in the connection string |

## Demo Accounts

Password for all: `Password123!`

| Role | Email |
|------|-------|
| Admin | admin@marketplace.com |
| Customer | customer@demo.com |
| Seller | seller@demo.com |
| Seller 2 | fashion@demo.com |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase pooled connection (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase direct connection (port 5432) for Prisma CLI |
| `JWT_SECRET` | Secret for signing tokens |
| `FRONTEND_URL` | CORS origin (default: http://localhost:3000) |
| `STRIPE_SECRET_KEY` | Stripe secret (optional — enables real payments) |
| `CLOUDINARY_*` | For image uploads (v2) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth (v2) |

## API Endpoints (MVP)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register customer/seller |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/products` | List/filter products |
| GET | `/api/products/:slug` | Product detail |
| GET | `/api/categories` | Category tree |
| GET/POST | `/api/cart` | Cart operations |
| POST | `/api/orders/checkout` | Place order |
| GET | `/api/orders` | User orders |
| GET | `/api/seller/dashboard` | Seller stats |
| CRUD | `/api/seller/products` | Seller products |

## Deployment

### Frontend → Vercel

1. Import the `frontend` folder as a project
2. Set `NEXT_PUBLIC_API_URL` to your production API URL
3. Deploy

### Backend → Railway or Render

1. Set `DATABASE_URL`, `DIRECT_URL`, and `JWT_SECRET` from your Supabase project
2. Build command: `npm install && npx prisma generate && npm run build`
3. Start command: `npm start` (run `npx prisma db push` once locally or in CI before first deploy)
4. Run seed once: `npm run db:seed`

### Database (Supabase)

- Tables are managed by Prisma (`prisma db push` or `prisma migrate dev`).
- View data in **Supabase → Table Editor** or run `npm run db:studio` from `backend/`.
- For production, keep using the **pooled** URL for `DATABASE_URL` and **direct** URL for `DIRECT_URL`.

## Roadmap (v2+)

- [ ] Google OAuth UI integration
- [ ] Cloudinary image uploads
- [ ] Stripe Elements checkout UI
- [ ] Admin dashboard (user/seller approval, moderation)
- [ ] Product recommendations & recently viewed
- [ ] Flash sales & daily deals
- [ ] Sponsored listings & commission payouts
- [ ] Email notifications
- [ ] Redis caching

## License

MIT
