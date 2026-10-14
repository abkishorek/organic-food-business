# What changed from the original brief

Everything in your design brief was followed (palette, Kannada identity, hero composition, no fake photos, no fake trust signals,
central product data, WhatsApp checkout, no backend). The additions below come from the review.

## Added from the review

| # | Change | Where |
|---|---|---|
| 1 | FSSAI and GSTIN fields in the footer, with "to be added" shown only in preview | `site.ts` → `legal` |
| 2 | Shipping, Returns and Refunds, Privacy and Contact pages. Text comes from facts the owner supplies; nothing is invented. Privacy describes only what this site actually does. | `site.ts` → `policies`, `pages/Policies.tsx` |
| 3 | Checkout collects name, phone, address and PIN with validation. Delivery charge, free-delivery threshold, minimum order and delivery area are configurable. | `site.ts` → `ordering` |
| 4 | Payment note shown at checkout. Neutral default: "Payment options will be confirmed with you on WhatsApp." | `ordering.paymentNote` |
| 5 | Descriptions are neutral placeholders (none were attached). Replace with the owner's text. | `products.ts` |
| 6 | Categories: Spices & Masalas, Oils, Tea & Coffee, Honey & Nuts | `categories.ts` |
| 7 | Logo slot in the header and hero, with a text wordmark until the logo is supplied | `site.ts` → `logo` |
| 8 | Kannada product names added (e.g. ಮಿಡಿ ಉಪ್ಪಿನಕಾಯಿ). **Needs proofreading by a Kannada speaker.** | `products.ts` |
| 9 | Contact details (WhatsApp, email, address, service area, social links) in one config | `site.ts` → `contact` |
| 10 | Page titles and descriptions per page, social preview tags, `robots.txt`, a placeholder `og-image.png` | `lib/meta.ts`, `index.html` |
| 11 | Optional privacy-friendly analytics (Plausible), off until a domain is set | `site.ts` → `analytics` |
| 12 | Optional product details (ingredients, shelf life, storage, allergens, notes) shown only when filled in. Cashew has "Contains tree nuts (cashew)." | `products.ts` → `details` |
| 13 | Accessibility: alt text on photos, visible keyboard focus, skip link, labelled form errors, keyboard-usable cart with Escape to close, reduced-motion respected. Text colours chosen for contrast; gold is used for borders only, never for text. | throughout |
| 14 | Cart saved in the browser and kept after refresh. Prices are always read from the product file, so price edits apply automatically. WhatsApp message is shortened automatically if very long. | `lib/cart.tsx`, `lib/whatsapp.ts` |
| 15 | "Preview build" banner listing what is missing, plus a launch checklist, so the site isn't published with placeholders | `PreviewNotice.tsx`, README |

## Decisions I made (change them if you disagree)

- Midi Uppinakayi sits under **Spices & Masalas**, as suggested in the review. It is a pickle, so you may prefer its own category.
- The hero introduction says the range is "inspired by the flavours of traditional Karnataka kitchens". It makes no claim about where the business is based or how products are made.
- Kasuti-inspired linked-diamond divider is original artwork. It is the only regional pattern used.
- The Kannada name is the single bold element of the hero; everything else is kept quiet.
- Fonts are bundled with the site rather than loaded from Google, so Kannada renders reliably and there are no third-party requests.

## Left for the owner (not invented)

Real product photographs, hero photograph, logo file, prices and pack sizes, descriptions, WhatsApp number,
FSSAI/GSTIN, delivery and returns rules, payment method, and the final sharing image.

## Testing done

Production build and type-check pass. Pages checked at 390 px (mobile), 820 px (tablet) and 1366 px (desktop) with no sideways
overflow and no console errors. Ordering tested with temporary sample data: pack-size selection, quantity changes, totals,
free-delivery rule, cart kept after reload, products without prices or out of stock cannot be added, form validation, and the
generated WhatsApp message. One bug found during testing (cart drawer closing itself after "Add to cart") was fixed.
The test data was **not** kept: the delivered project still has no prices.


---

# Round 2: your logo and product photos

## Done
- **Logo** added from your first image, cut out to a transparent circle (no other change). It appears in the header, in the hero frame, and as the favicon and social-sharing image. Original kept in `source-images/`.
- **All 11 product photos** added, each matched to its product and shown in one 3:4 frame without stretching. The files are copied untouched (no recolouring). Focus points were set for the cashew and coffee photos so the pack stays in frame.
- **"Buy on WhatsApp" button on every product** (cards and product pages). It drafts the message to the WhatsApp number. See `README.md` for the exact file and line.
- **Phone number left empty** in `src/config/site.ts` (line 31, `whatsappNumber: ''`).
- Pepper's Kannada name changed to ಕರಿಮೆಣಸು to match your pepper label.
- Descriptions rewritten to match each pack (for example "Filter coffee powder", "Whole black pepper") without added claims.

## About the descriptions
Superseded in Round 3 below: the owner's own descriptions are now in place.

## About the photos: please read before launch
1. **They look like AI-generated images**, not photographs of the real packs (a sparkle mark in the corner of several, and garbled text on the coffee pouch such as "Sich Aretme" and "Prechiy Ground").
   Your own brief says the brand's trust should come from authentic photography. Customers who receive a pack that looks different from the picture will notice.
   Replace them with real photographs before launch, starting with coffee, tea and turmeric.
2. **Turmeric:** the supplied image had health claims printed on it ("Fights Cold & Flu", "Relieves Joint Pain", "Boosts Immunity", "Heart Health Support"). Unproven health claims on food
   can breach FSSAI advertising rules, and your brief rules out unsupported claims. I used a crop of the pouch only. The full image is in `source-images/` if you disagree.
3. **Tea:** the Kannada text on the tea label does not read as the brand name (it appears as ಸಿರಿ ಮತ್ತು ಪಾವಿದ್ಯ). The business name must not be altered.
4. **Pickle photo:** it shows a Mango Pickle and a Lemon Pickle. Your list has "Midi Uppinakayi" (tender mango pickle), and lemon pickle is not one of the 11 products. It is used for Midi Uppinakayi for now.
5. **Phone numbers printed on the labels** (groundnut oil and the pickle jars) do not match each other. Confirm which is right, and make sure the same number goes into `whatsappNumber`.
6. **Pack claims:** the sambar label says "No Artificial Colours" and "No Added Preservatives". Keep such wording only if it is true and verifiable.
7. The honey and coconut oil images carry the slogan "Crafted Purely for You. Time-Honored Tradition." and a small Nataraja statue in the background.
   Your brief asks for no temple-style imagery, so you may prefer a plainer photo.


---

# Round 3: owner's product descriptions

- The owner's descriptions for all 11 products were added exactly as supplied, in `src/data/products.ts` (the `description:` line of each product).
- Product cards show the first three lines with a "Read more" link. The product page shows the full text.
- One change: the Midi Uppinakayi text spelled the brand "Vaividhya". It now reads "Vaividya", matching the logo and your rule that the business name must not be altered. Change it back in `products.ts` if "Vaividhya" is intended.
- Some lines are nutrition or wellness statements ("naturally rich in protein... magnesium and copper", "can help increase alertness and reduce tiredness", "traditionally valued for its antioxidant and wellness properties"). They are included as supplied, but it is worth checking them against FSSAI's rules on nutrition and health claims. Each is a one-line edit.
