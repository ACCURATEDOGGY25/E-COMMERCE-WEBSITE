# MarketHub — Features (v2)

## Shipped

| Feature | How to use |
|---------|------------|
| **Stripe checkout** | Add `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to env. Without keys, mock payment auto-confirms. |
| **Product reviews** | Product page → sign in → star rating + comment |
| **Image upload** | Seller → New/Edit product → Upload (needs `CLOUDINARY_*` in `backend/.env`) or paste URL |
| **Account profile** | `/account` → edit name / password |
| **Notifications** | Order placed → bell icon on header → `/account` list |
| **Public demo URL** | `bash scripts/deploy-automatic.sh` |

## Env vars (optional features)

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary (seller image upload)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Permanent hosting

```bash
bash scripts/deploy-render-permanent.sh   # API on Render
# Then Vercel: Root Directory frontend, NEXT_PUBLIC_API_URL → Render URL
```
