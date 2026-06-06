# BlackPeak — Shopify Theme

An Online Store 2.0 (section-based) Shopify theme for the BlackPeak better-for-you
soda brand. Converted from the static marketing site in the parent folder.

> **Heads up:** A Shopify theme renders **products, collections, and pages that
> live in your Shopify admin** — it can't ship them. The theme below references
> those entities; you create them once in admin (steps 2–4) and everything wires
> up. Until then, the storefront renders but product/shop areas will be empty.

---

## 1. Upload the theme

**Option A — Shopify CLI (recommended for developers)**

```bash
# Install once: https://shopify.dev/docs/themes/tools/cli
cd "shopify-theme"
shopify theme dev --store your-store.myshopify.com   # live local preview
# or push it as an unpublished theme:
shopify theme push --unpublished --store your-store.myshopify.com
```

**Option B — Admin upload (no tools)**

```bash
cd "shopify-theme"
zip -r ../blackpeak-theme.zip . -x ".*"
```
Then in Shopify admin: **Online Store → Themes → Add theme → Upload zip file**,
select `blackpeak-theme.zip`, and click **Customize** to preview.

---

## 2. Create the navigation menu

**Online Store → Navigation → Main menu.** Add:

| Title   | Link                          |
|---------|-------------------------------|
| Home    | Home page                     |
| Shop    | Collections → *Shop* (step 4) |
| Flavors | Pages → *Flavors* (step 3)    |
| About   | Pages → *About* (step 3)      |
| FAQ     | Pages → *FAQ* (step 3)        |

The header/footer sections read this menu. You can also build separate footer
menus and assign them in the Footer section settings.

---

## 3. Create the content pages

**Online Store → Pages → Add page.** Create three pages, and for each, set the
**Theme template** (right sidebar) to the matching custom template:

| Page title | Handle (URL)  | Theme template |
|------------|---------------|----------------|
| About      | `about`       | `page.about`   |
| FAQ        | `faq`         | `page.faq`     |
| Flavors    | `flavors`     | `page.flavors` |

The page **body can be left blank** — all copy lives in the section settings and
is fully editable in the theme customizer. (These templates ignore the page body.)

---

## 4. Create products and the Shop collection

**Products** — **Products → Add product.** Create at least the three flavors:

| Product       | Suggested handle | Tag (optional) |
|---------------|------------------|----------------|
| Green Apple   | `green-apple`    | `bestseller`   |
| Mojito        | `mojito`         |                |
| Watermelon    | `watermelon`     |                |

For each product, upload its can image as the **featured image** (the originals
are in `assets/`), set a price, and add variants if you sell multiple pack sizes
(e.g. *12-pack*, *24-case*). The product template auto-renders a variant dropdown.

**Optional metafields** (for nicer grid/bundle output) — define under
**Settings → Custom data → Products**:
- `blackpeak.theme` (single line text): `apple`, `mojito`, or `watermelon` — color-codes the product card.
- `blackpeak.tagline` (single line text): short descriptor shown in the bundle row.

**Collection** — **Products → Collections → Create collection** named **Shop**
(handle `shop`). Add your products. It uses the `collection` template, which
includes the product grid, the build-your-own bundle, and a newsletter block.

---

## 5. Wire up the bundle builder

Open the **Shop** collection in the customizer
(**Online Store → Themes → Customize**, then navigate to the collection):
- Select the **Build-your-own bundle** section.
- Pick your three flavor products in **Flavor 1/2/3** (use single-can variants if
  you have them, so a 12-can mix maps to 12 line items).
- Adjust the display price/copy as needed.

The builder enforces a 12-can total and adds all selected line items to the cart
in one click via the Shopify AJAX Cart API.

---

## What's editable in the customizer

Every block from the original site is a section with settings — no code needed to
change copy or imagery:

- **Announcement marquee** — scrolling messages (header group)
- **Header / Footer** — menus, tagline, social links
- **Hero** — eyebrow, 3 stacked words, lede, CTAs, 3 stats
- **Press bar** — add/remove publication logos (sans or serif)
- **Flavors grid** — flavor cards (theme color, tag, name, copy, image, CTA)
- **Sugar comparison** — both columns' numbers and bullet lists
- **Story** — heading, rich-text body, image
- **Benefits** — icon + title + copy blocks
- **Reviews** — aggregate score + testimonial blocks
- **Newsletter** — title, copy, doodles (posts to Shopify customer list)
- **Page hero / Flavor block / FAQ / Pillars / Stat strip** — used by the page templates

---

## Brand tokens

Colors and fonts are CSS variables at the top of `assets/styles.css`
(`--brand-ink`, `--apple-bg`, `--font-display`, etc.). Edit them there to
re-theme the entire store. Fonts load from Google Fonts (Fredoka + Plus Jakarta
Sans) in `layout/theme.liquid`.

---

## File structure

```
shopify-theme/
├── assets/            styles.css, script.js, can-*.png
├── config/            settings_schema.json, settings_data.json
├── layout/            theme.liquid
├── locales/           en.default.json
├── sections/          header, footer, marquee, hero, press, flavors-grid,
│                      comparison, story, benefits, reviews, newsletter,
│                      page-hero, flavor-block, faq, about-content, pillars,
│                      stat-strip, main-page, main-collection, main-product,
│                      bundle-builder, + header-group/footer-group
├── snippets/          (reserved)
└── templates/         index.json, page.json, page.about.json, page.faq.json,
                       page.flavors.json, collection.json, product.json,
                       cart.liquid, 404.liquid
```

## Notes & limitations

- The printed nutrition on the can photos still reads the old "140 CAL / 39g" —
  that's baked into the images; swap them with updated renders when available.
- The mock cart from the static site is replaced with real Shopify cart calls.
  There's no slide-out cart drawer; the cart link goes to the full `/cart` page.
- Theme not yet run through `shopify theme check`. If you have the CLI, run it
  for a final lint before publishing.
