# LuckyTech website

Website for **LuckyTech Communications**: phones, gadgets, accessories and repairs in Owo (main store) and Akure, Ondo State.

Built with Next.js, Tailwind CSS and Motion. Customers can:
- browse and search 30 phones and tablets (copied from the old luckytechstore.com)
- add to cart and pay online with **Paystack** or **Flutterwave** (card, bank transfer, USSD)
- **order on WhatsApp**, with the order sent to the store they pick (Owo or Akure)
- fill a **"Tell us what you need"** form for anything not listed (chargers, pouches, screen guards, power banks, speakers, smartwatches, screens, repairs, wholesale)
- see buy now, pay later (30% down) for any phone
- find both stores with maps, phone numbers and directions

## Run it on your computer

```
npm install
copy .env.example .env.local      (Windows)   or   cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Turn on online payments and email

Everything works without keys: orders go through WhatsApp and the pay buttons are hidden. To switch on online payments, put these in `.env.local` (and in Vercel → Settings → Environment Variables):

| Setting | Where to get it |
|---|---|
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY` | dashboard.paystack.com → Settings → API Keys & Webhooks |
| `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`, `FLUTTERWAVE_SECRET_KEY` | app.flutterwave.com → Settings → API Keys |
| `RESEND_API_KEY`, `ORDER_EMAIL_TO`, `ORDER_EMAIL_FROM` | resend.com (free). Emails the store for paid orders and requests |
| `NEXT_PUBLIC_SITE_URL` | The live address, e.g. `https://luckytechstore.com` |

Use **test keys** first (`pk_test_…`, `FLWPUBK_TEST-…`) and make a test payment before switching to live keys.

**Never commit secret keys.** `.env.local` is ignored by git.

How payment is checked: after the customer pays, the site asks Paystack or Flutterwave directly (using the secret key on the server) whether the payment succeeded and whether the amount matches the cart total, worked out on the server from the price list. Only then is the order confirmed.

## Where to change things

| What | File |
|---|---|
| Products, prices, specs | `src/content/products.ts` |
| Store addresses, phone numbers, WhatsApp numbers, services, FAQs | `src/content/store.ts` |
| Homepage videos | `src/content/media.ts` + files in `public/videos/hero/` |
| Menu links | `src/content/nav.ts` |
| Colours and fonts | `src/styles/globals.css` |

### Product photos
Products show a drawn device in their colours until a photo is added. To add one, put the image in `public/products/` (e.g. `public/products/iphone-16-plus-128gb.jpg`) and add `image: "/products/iphone-16-plus-128gb.jpg"` to that product in `products.ts`. Transparent PNGs or plain backgrounds look best.

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
