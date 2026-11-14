# Siri Vaividya website · ಸಿರಿ ವೈವಿಧ್ಯ

A React + Vite + TypeScript storefront. Customers browse products and send orders directly through WhatsApp. The private `/admin` page lets an authorized admin update products, prices, photos, descriptions, and the WhatsApp number.

## Local setup

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`, set `VITE_SITE_URL` to the site domain, and add the Supabase project URL and anon/publishable key (see below).
4. Run `npm run dev` and open the local address it prints.

Without Supabase settings, the public storefront uses the checked-in catalogue. The admin page requires a configured Supabase project.

## Set up the admin backend

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql). This creates the content and admin-access tables, the public product-image bucket, and row-level security policies.
3. Copy the project URL and anon/publishable key from **Project Settings → API** into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```
   Add these same variables to the hosting provider's environment settings before building/deploying. They are public browser configuration; **never** put a Supabase service-role key in a `VITE_` variable or in this repository.
4. In Supabase **Authentication → Users**, create the admin email/password account. Self-service sign-up is not enabled.
5. Add the account's user ID to the allowlist from the SQL Editor:
   ```
   insert into public.admin_users (user_id)
   values ('AUTH_USER_UUID');
   ```
   Only users in this table can save content or upload product images. Keep this table limited to trusted admins.
6. Visit `/admin`, sign in, edit the products or WhatsApp number, and choose **Save all changes**. The first save publishes the checked-in catalogue to Supabase. Product image uploads are limited to JPG, PNG, WebP, or AVIF files up to 8 MB.

The public storefront reads the saved catalogue and order number from Supabase. If that request fails, it reports the issue and shows the checked-in catalogue instead.

## Storefront content and images

The checked-in defaults are useful for local preview and initial seeding:

| What to change | File |
|---|---|
| Brand details, logo, hero image, policy and other static business details | `src/config/site.ts` |
| Default products and prices | `src/data/products.ts` |
| Product categories | `src/data/categories.ts` |

After Supabase is configured, use `/admin` for product name, Kannada name, category, prices, availability, description, image/alt text, home-page highlighting, and the WhatsApp order number. Product photos are stored in the `product-images` Supabase Storage bucket.

For products with several pack sizes, edit the `packSizes` in `src/data/products.ts` before the first admin save. The admin page keeps and allows editing existing pack-size prices.

The supplied logo is `public/images/logo.webp`. The optional hero photo is configured through `heroImage` in `src/config/site.ts`; the existing image is placed before the hero text on mobile.

## Development and deployment

```
npm run typecheck
npm run build
npm run preview
```

Deploy the Vite `dist` output to Vercel, Netlify, or Cloudflare Pages. Configure the two Supabase environment variables in the host before the production build. These redirects keep routes such as `/products/honey` and `/admin` working on refresh.

## Privacy and security notes

- Customer enquiry messages are composed in the browser and sent by the customer through WhatsApp; there is no checkout form or cart.
- Admin credentials are handled by Supabase Auth. Admin sign-in is restricted by the `admin_users` table and the row-level security policies in `supabase/schema.sql`.
- Public product images and catalogue content can be viewed by anyone; only authorized admins can change them.
- Do not commit `.env.local`, passwords, or service-role credentials.
