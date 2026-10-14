# Siri Vaividya website · ಸಿರಿ ವೈವಿಧ್ಯ

A React + Vite + TypeScript website with a product catalogue, shopping cart and WhatsApp checkout.
No database and no backend. Everything the owner needs to edit lives in **two files**.

## The two files you edit

| What you want to change | File |
|---|---|
| WhatsApp number, email, address, FSSAI/GSTIN, delivery charges, policy text, logo, hero photo | `src/config/site.ts` |
| Product photos, prices, sizes, descriptions, availability | `src/data/products.ts` |

You never need to touch the files in `components/` or `pages/`.

## First-time setup (once)

1. Install Node.js (version 18 or newer) from https://nodejs.org
2. Open a terminal in this folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open the address it prints (usually http://localhost:5173).

## Step-by-step: filling in the business details

**WhatsApp number (the most important one).**
- **File:** `src/config/site.ts`
- **Line:** about line 31, inside `contact`, the line that reads `whatsappNumber: '',`
- **What to type:** put the number between the quotes. Digits only: country code, then the number. No `+`, no spaces, no dashes.
  Example: the Indian number 98765 43210 becomes `whatsappNumber: '919876543210',`
- This one number is used by every "Buy on WhatsApp" button, the "Order on WhatsApp" button on the home page, and checkout.
- While it is empty (and the preview banner is on), the buttons still open WhatsApp with the message written, but WhatsApp asks you to pick who to send it to. That is only for testing.
- If you switch the preview banner off and forget the number, the buttons send visitors to the Contact page instead of a wrong chat.

**Logo.** Already added (`public/images/logo.webp`, your logo with a transparent background). To change it, replace that file.

**Hero photograph (optional).** Until you add one, the hero frame shows your logo. To add a photo, copy it into `public/images/`,
set `heroImage: '/images/hero.jpg'` and write a short `heroImageAlt`. The logo then moves above the Kannada name.

**Product photographs.** All 11 are already in `public/images/products/` and connected in `products.ts`.
To swap one, replace the file (or change that product's `image:` path). All photos sit in the same 3:4 frame and are never stretched.
If a photo's edges get cropped, add `imageFit: 'contain'` to that product to show the whole picture, or move the focus with `imagePosition` (e.g. `'57% 50%'`).
Your untouched originals are kept in the `source-images/` folder. That folder is not part of the website.

**Prices.** Two ways:
- One size only: `price: 120`
- Several sizes: leave `price: null` and fill `packSizes`:
  ```
  packSizes: [
    { id: '100g', label: '100 g', price: 95 },
    { id: '250g', label: '250 g', price: 220 },
  ],
  ```

**The "Buy on WhatsApp" button.** Every product has one. It opens WhatsApp with a message already written, for example
"Hello Siri Vaividya, I would like to buy Honey. Please share the available sizes, price and delivery details."
Once a product has a price, the message includes the chosen size, quantity and total, and an "Add to cart" button appears too.

**Opening cart ordering for a product.** Change `availability: 'to-be-confirmed'` to `'available'`.
A product can be ordered only when it is `'available'` **and** has a real price. Otherwise the site shows
"Price to be updated" and an "Ask on WhatsApp" link, and the cart refuses it. Prices are never invented and ₹0 is never shown.

**Descriptions.** The text in `products.ts` is neutral placeholder wording, not claims. Replace each with the owner's own description.

**Delivery and payment.** In `site.ts` set `shippingCharge`, `freeShippingAbove`, `minimumOrder`, `serviceArea`, and
`paymentNote` (for example how customers pay). Leave them empty if undecided; the site then says they are confirmed on WhatsApp.

**Shipping and returns pages.** Write the rules in `policies.shipping` and `policies.returns`, one paragraph per line.
Food items often have specific return rules, so the owner should decide these. The pages say "being finalised" until you do.

**FSSAI and GSTIN.** Enter them in `legal`. They appear in the footer. Check current requirements with FSSAI or an accountant.

**Adding or removing a product.** Copy an existing block in `products.ts`, change the `id` (lowercase, no spaces), and fill it in.
Categories are in `src/data/categories.ts`.

## Before you launch

The grey banner at the top lists what is still missing. When it is empty, set
`showPreviewNotice: false` in `site.ts`, so the banner and "Photo to be added" labels disappear. Then check:

- [ ] Product photos checked (see "About the photos" in CHANGES.md) and matched to the right product
- [ ] Prices and sizes entered, ordering opened for each product
- [ ] WhatsApp number set, and a real test order sent to it
- [ ] FSSAI number added (and GSTIN if registered)
- [ ] Shipping, returns and payment text written by the owner
- [ ] A Kannada speaker has proofread all Kannada text (including product names in `products.ts`)
- [ ] `.env`: `VITE_SITE_URL` changed to your real domain
- [ ] `public/og-image.png` (the sharing image, currently your logo on ivory) is how links look when shared in WhatsApp
- [ ] Optional: `plausibleDomain` set if you want visitor statistics

## Testing the production build

```
npm run build      # checks types and builds into the "dist" folder
npm run preview    # serves the built site locally
```

## Deploying (free hosting)

Build command: `npm run build`   Output folder: `dist`

- **Vercel**: import the project, accept the defaults. `vercel.json` is already included.
- **Netlify**: drag the `dist` folder onto netlify.com/drop, or connect the repo. `public/_redirects` is already included.
- **Cloudflare Pages**: build command `npm run build`, output `dist`. `_redirects` is picked up automatically.

These redirect files make links like `/products/honey` work when someone refreshes or opens a shared link.

## Colours and fonts

Colours are at the top of `src/styles/global.css`. Fonts are bundled with the site (no external requests):
Newsreader (English headings), Figtree (body), Noto Serif Kannada and Noto Sans Kannada (Kannada).

## Folder map

```
src/config/site.ts      business details, delivery, policies   <- edit
src/data/products.ts    the 11 products                        <- edit
src/data/categories.ts  category names
src/components, pages   the website itself (no need to edit)
public/images           logo and product photographs (these go on the website)
source-images/          your untouched original photos (not part of the website)
```
