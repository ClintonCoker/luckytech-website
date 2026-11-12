# LuckyTech website

Website for **LuckyTech Communications**: phones, gadgets, accessories and repairs in Owo (main store) and Akure, Ondo State.

Built with Next.js, Tailwind CSS and Motion. Customers can:
- browse and search 30 phones and tablets (copied from the old luckytechstore.com)
- add to cart and pay online with **Paystack** or **Flutterwave** (card, bank transfer, USSD)
- **order on WhatsApp**, with the order sent to the store they pick (Owo or Akure)
- fill a **"Tell us what you need"** form for anything not listed (chargers, pouches, screen guards, power banks, speakers, smartwatches, screens, repairs, wholesale)
- see buy now, pay later (30% down) for any phone
- find both stores with maps, phone numbers and directions
- see **real product photos**, **"Sold out"** and **"Only 3 left"** labels, and never order more than is in stock

Staff get a password-protected **admin** at `/admin` to add products and photos, change stock, hide products, and see items that are sold out or have 5 or fewer left. Online payments take items out of stock automatically.

## Run it on your computer

```
npm install
copy .env.example .env.local      (Windows)   or   cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Set up the admin and stock database (once, about 15 minutes)

The shop works without this (it shows the 30 starter products), but stock and the admin need a free Supabase database.

1. Go to **supabase.com**, sign up, and click **New project**. Pick a name (e.g. `luckytech`), set a database password (save it somewhere), choose a region close to Nigeria (e.g. **West EU** or **South Africa**), and create it.
2. When it's ready, open **SQL Editor** (left menu) → **New query**. Open `supabase/schema.sql` from this project, copy everything, paste it in, and click **Run**. You should see "Success".
3. Open **Project Settings → API**. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (click Reveal) → `SUPABASE_SERVICE_ROLE_KEY`. This key is secret: never post it anywhere.
4. Choose an admin password (long, at least 8 characters) → `ADMIN_PASSWORD`.
5. Put the three settings in `.env.local` (on your computer) **and** in Vercel → your project → **Settings → Environment Variables**, then **Redeploy**.
6. Open `/admin`, sign in, and click **Import 30 products**. Then type the real stock numbers into the boxes.
7. Under **Setup tools**, click **Copy photos to our storage** (on the live site). This copies the product photos from the old site into your own storage so they keep working if the old site is shut down.

### Using the admin
- **Stock:** use **−**, **+** and **+5**, or type a number and press Enter. Leave a box empty for products you don't count (always available).
  - **0** shows **Sold out** in the shop (can't be added to cart, moved to the end of the list).
  - **1 to 5** shows **Only N left**, and these appear in the orange alert at the top of the admin.
- **Online payments** (Paystack/Flutterwave) take the items out of stock automatically and appear under **Recent online payments**. **WhatsApp orders don't**: adjust those by hand when you sell.
- **Add product:** for phones, chargers, pouches, screen guards, power banks, speakers and anything else. Pick the category, add photos (they're shrunk automatically), set price and stock.
- **Hide** takes a product off the shop without deleting it. **Delete** is permanent.
- Changes show in the shop straight away.

## Turn on online payments and email

Everything works without keys: orders go through WhatsApp and the pay buttons are hidden. To switch on online payments, put these in `.env.local` (and in Vercel → Settings → Environment Variables):

| Setting | Where to get it |
|---|---|
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY` | dashboard.paystack.com → Settings → API Keys & Webhooks |
| `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`, `FLUTTERWAVE_SECRET_KEY` | app.flutterwave.com → Settings → API Keys |
| `RESEND_API_KEY`, `ORDER_EMAIL_TO`, `ORDER_EMAIL_FROM` | resend.com (free). Emails the store for paid orders and requests |
| `NEXT_PUBLIC_SITE_URL` | The live address, e.g. `https://luckytechstore.com` |
| `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | See "Set up the admin" above |

Use **test keys** first (`pk_test_…`, `FLWPUBK_TEST-…`) and make a test payment before switching to live keys.

**Never commit secret keys.** `.env.local` is ignored by git.

How payment is checked: after the customer pays, the site asks Paystack or Flutterwave directly (using the secret key on the server) whether the payment succeeded and whether the amount matches the cart total, worked out on the server from the price list. Only then is the order confirmed.

## Where to change things

| What | File |
|---|---|
| Products, prices, stock, photos | **`/admin`** (once the database is set up). `src/content/products.ts` is only the starter list |
| Store addresses, phone numbers, WhatsApp numbers, services, FAQs | `src/content/store.ts` |
| Homepage videos | `src/content/media.ts` + files in `public/videos/hero/` |
| Menu links | `src/content/nav.ts` |
| Colours and fonts | `src/styles/globals.css` |

### Homepage videos
Four free Pexels clips (iPhone close-up, Android unboxing, fitting a phone case, headphones unboxing) play in turn behind the headline. Each has a computer version (1280×720) and a phone version (720×1280), about 6.4 MB for all eight files, and only the first one loads straight away. To change them, replace the files in `public/videos/hero/` and edit `src/content/media.ts`. Pexels videos are free for commercial use; credit isn't required.

### Product photos
The 30 starter products use LuckyTech's own photos from the old site. Add or change photos for any product in `/admin` → **Edit**. A product with no photo shows a simple drawing (phones) or "Photo coming soon" (accessories).

### Logo
The header uses a text "LKT" mark. Put the official logo in `public/brand/` and swap it into `src/components/layout/Logo.tsx`.

## Check with LuckyTech before launch
- **WhatsApp numbers:** Owo orders go to 0703 639 1276, Akure to 0708 856 5957 (from the flyer). The old site's WhatsApp link used a placeholder number (+234 800 123 4567).
- **Products marked `verify`** in `products.ts`: Redmi Note 15 price, Infinix Note Edge specs, Itel 5605/5606 model, Opad Mini 12 storage.
- **Pay-later terms** (instalments, ID required) and **delivery** areas and fees.
- **Store email** and social media links (none on the old site).
- **Old links:** product links keep the same `/product/<slug>` addresses as the old site.

## Checks
```
npm run check     # lint, typecheck, tests
npm run build
```
