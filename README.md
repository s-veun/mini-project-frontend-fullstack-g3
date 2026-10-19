# Green Market

A responsive, multi-page neighbourhood grocery storefront for **Green Market Phnom Penh**. The project uses standalone HTML pages, Tailwind CSS v4, custom CSS, TypeScript compiled to browser JavaScript, Preline UI and a static JSON product catalog.

The active site is intentionally framework-free: it does **not** use React, Next.js or Vite. Its shared design uses a warm cream canvas, forest-green brand elements, soft produce-inspired accents, editorial headings and real product photos from `assets/`.

## Project at a glance

- **Brand:** Green Market — “Good food, close to home.”
- **Setting:** Local grocery market serving Phnom Penh, Cambodia.
- **Active pages:** Home, Shop, Categories, Our story and Contact.
- **Current catalog:** 59 static product entries in `src/data/product.json`.
- **Frontend:** Semantic HTML, Tailwind CSS v4, custom CSS and TypeScript.
- **UI helpers:** Preline UI, loaded as a browser bundle for interface behaviors such as the mobile navigation drawer.
- **Storage:** Browser `localStorage` stores the basket count and dark-mode preference.
- **Backend:** None. Product data and form responses are frontend demos.

## Start the project

Install dependencies:

```bash
npm install
```

Build the compiled CSS and TypeScript once:

```bash
npm run build
```

For active development, run the CSS and TypeScript watchers:

```bash
npm run dev
```

`npm run dev` watches and rebuilds CSS and TypeScript; it does not start a web server. Serve the project root with VS Code Live Server or another static HTTP server, then open `index.html`. For example, if Python is available:

```bash
python3 -m http.server 5500
```

Then visit `http://localhost:5500/`.

Serve the files over HTTP instead of opening the HTML files with `file://`. The shop reads `src/data/product.json` with `fetch`, which requires an HTTP server in typical browsers.

### Available npm commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Watch and rebuild CSS and TypeScript. |
| `npm run watch:css` | Run the Tailwind CLI in watch mode. |
| `npm run watch:ts` | Run the TypeScript compiler in watch mode. |
| `npm run build` | Generate production CSS and compile TypeScript. |
| `npm run build:css` | Compile and minify `src/index.css` into `assets/css/output.css`. |
| `npm run build:ts` | Compile `src/main.ts` into `assets/js/main.js`. |

## Active site map

### 1. Home — `index.html`

The homepage introduces the market and routes visitors to products and categories.

1. **Hero:** Large editorial headline, short local-market introduction, primary “Shop the market” action, secondary story link, social-proof detail and large grocery photograph with floating captions/stamp.
2. **Service strip:** Four concise benefits: fresh daily produce, local and wider sourcing, neighbourhood delivery and friendly service.
3. **Category cards:** Fruit & veg, Pantry, Drinks and Snacks; each card combines a soft tinted panel, small icon, description, photo and link.
4. **Market favourites:** Four featured product cards rendered from the product JSON.
5. **Local-market story callout:** Large photo, sourcing copy and link to the story page.
6. **Neighbour quote:** Centered testimonial band.

### 2. Shop — `shop.html`

The complete catalog and shopping interaction demo.

1. **Page introduction:** Shop title and short description.
2. **Catalog toolbar:** Category filter chips, product search and sort select.
3. **Product results:** Responsive grid with image, category, name, rating, review count, discount badge, prices, save button and add-to-basket button.
4. **Market note:** Short notice that seasonal availability can change.

Category filters are backed by the `category` values in `src/data/product.json`. Keep those values consistent with the filter buttons when changing the catalog.

### 3. Categories — `categories.html`

An aisle directory. Large photo-backed rows link into the shop with a category query parameter; a promotional callout leads visitors to the catalog.

### 4. Our story — `about.html`

A brand-story page with a large story photograph, copy about local sourcing and community, three values cards and a final shop call to action.

### 5. Contact — `contact.html`

A contact page with a visitor message form and an adjacent panel showing email, market hours and Phnom Penh location. Submitting the form shows a client-side thank-you state.

### Shared site shell

All pages share the same visual and navigational frame:

- A narrow forest-green announcement bar.
- A sticky, translucent header with the Green Market mark, five desktop nav links, search/theme controls, basket count and mobile-menu button.
- A Preline-powered mobile navigation drawer.
- A dark-green footer with navigation, contact details and newsletter form.
- A small toast region for basket feedback.

## Visual design system

Use these rules to keep new content visually consistent with the existing site.

### Brand and color

| Token | Value | Use |
| --- | --- | --- |
| Forest | `#244b38` | Main brand, announcement bar, buttons and footer. |
| Leaf | `#a8c45b` | Fresh accent and small highlights. |
| Cream | `#f8f7f2` | Main page background. |
| Body text | `#28362c` | Primary text. |
| Sage | `#e4ead3` | Produce/category sections and pale panels. |
| Peach | `#f3e4d7` | Warm card accent. |
| Butter | `#efedcf` | Soft category accent. |
| Lilac-neutral | `#e8e5d9` | Secondary muted category accent. |
| Footer green | `#244b38` | Main footer surface; darker forest is used in dark mode. |

Keep most surfaces warm and low-contrast. Use muted green-gray for supporting copy and reserve stronger green for primary actions, links and important labels. Sale badges use a restrained warm coral.

### Type

- **Body and controls:** DM Sans.
- **Display headings:** Manrope, typically bold with tight letter spacing.
- **Editorial emphasis:** Italicize selected words inside large headings; keep the rest of the heading clean and confident.
- **Eyebrows and metadata:** Small uppercase text with generous letter spacing.

Google Fonts are linked in the page heads. Keep sensible sans-serif fallbacks so the pages remain readable if remote fonts are unavailable.

### Layout and components

- Main desktop content width: maximum `1200px`, centered.
- Header: compact, sticky, lightly translucent, with a fine bottom border and blur.
- Buttons and cards: restrained corner radius (mostly 3–4px); reserve circles for icon controls and small badges.
- Product card: warm off-white surface, fine border, photo area, small uppercase category label, short product name, star rating, aligned price row and round add button.
- Product photos: use the real product photo referenced by the product record. Preserve its aspect ratio/crop carefully; do not replace product photography with cartoon drawings, clip-art or generated SVG illustrations.
- Images: retain descriptive `alt` text; use `loading="lazy"` for below-the-fold images.
- Motion: subtle hover lift/zoom and short transitions only. Respect `prefers-reduced-motion`.
- Spacing: generous section padding, short readable text widths and clear separation between editorial sections.

### Responsive behavior

- **Wide desktop:** Content uses a centered 1200px shell; shop and home product grids show four columns.
- **At 980px and below:** Main shell narrows; product grids become two columns; category grids become two columns; shop controls can wrap/stack; footer becomes two columns.
- **At 640px and below:** Desktop navigation hides and the mobile drawer button appears; the homepage hero stacks; service benefits use a two-column grid; product cards remain two columns; footer content stacks into two compact columns with newsletter across the full width.
- Keep all pages usable at 320px viewport width. Avoid horizontal scrolling.

### Dark mode

The theme toggle adds/removes `.dark` on the root element. Dark colors and component adjustments live in `src/index.css`. Persist the preference in `localStorage` with the key `greenmarket-theme`. Keep both themes readable and maintain product-image contrast.

## Product data and images

`src/data/product.json` is the single static catalog source. Each product follows this shape:

```json
{
  "id": 89,
  "name": "Sweet Valencia Oranges",
  "category": "Fruits & Veggies",
  "price": 3.25,
  "originalPrice": 3.99,
  "image": "./assets/image%20copy%2013.png",
  "description": "Juicy, bright oranges selected for fresh juice and snacks.",
  "rating": 4.8,
  "reviews": 119,
  "discount": 19,
  "inStock": true,
  "stock": 42,
  "isFeatured": false,
  "isNew": true
}
```

Field notes:

- `id` must be unique; the add-to-basket interaction uses it to find the product.
- `category` must match one of the shop filters.
- `price` and `originalPrice` are USD values.
- `image` is a local path under `assets/`. Filenames containing spaces are URL-encoded (`%20`).
- `rating`, `reviews`, `discount`, `inStock`, `stock`, `isFeatured` and `isNew` are presentation/demo data.

The current catalog contains **59 products** across Beverages, Fruits & Veggies, Meats & Seafood, Dairy, Snacks, Bakery, Frozen Foods, Baby Care, Pantry and Household. The product images are local assets. Check that every image path points to a real file whenever products are added or renamed.

## Frontend behavior

`src/main.ts` is the source of the shared browser behavior. `assets/js/main.js` is generated from it during the build.

- Fetches `src/data/product.json` and fills product grids marked with `data-product-grid`.
- Shows four featured products on the homepage using `isFeatured`.
- Filters and searches products on the shop page.
- Sorts by popularity/default order, price or rating.
- Updates category chips and the shop URL query string.
- Adds products to a demo basket count stored as `greenmarket-cart` in `localStorage`.
- Toggles save/heart styling on product cards.
- Toggles dark mode and stores it as `greenmarket-theme`.
- Shows a toast when a product is added.
- Replaces contact/newsletter forms with simple frontend confirmation states.
- Provides a fallback market image if a product image fails to load.

There is no payment processing, product database, authentication, server-side form submission or persistent line-item basket. Treat these as UI demonstrations unless a backend is added.

## SEO and accessibility baseline

- Each active page has a unique `<title>` and meta description.
- Main content uses page headings and semantic sections.
- Interactive controls have labels or accessible names.
- Product and editorial photos include alt text.
- The mobile drawer has dialog semantics and buttons have explicit types/labels where needed.
- Preserve keyboard access, clear focus states, sufficient contrast and reduced-motion support when changing components.

## Project structure

```text
.
├── index.html                 # Active homepage
├── shop.html                  # Active catalog page
├── categories.html            # Active aisle directory
├── about.html                 # Active story page
├── contact.html               # Active contact page
├── package.json               # Build scripts and dependencies
├── tsconfig.json              # Browser TypeScript compiler settings
├── README.md                  # Project and AI design reference
├── assets/
│   ├── css/output.css         # Generated Tailwind/custom CSS bundle
│   ├── js/main.js             # Generated browser JavaScript
│   ├── js/preline.js          # Preline browser bundle
│   └── ...                    # Product photos, logo and editorial assets
└── src/
    ├── index.css              # Tailwind imports, design system and site styles
    ├── main.ts                # TypeScript interactions and product rendering
    ├── data/product.json      # Static product catalog
    ├── css/, html/, js/       # Older prototypes and utilities
    ├── page/                  # Older standalone page prototypes
    └── style.css              # Older stylesheet
```

The root-level HTML files listed above are the active pages linked by the current navigation. Older material under `src/page`, `src/html`, `src/css`, `src/js`, and `src/style.css` is legacy/prototype material; do not treat it as the active design unless you intentionally migrate it.

## Reusable AI prompt: preserve this UX/UI

Copy the prompt below into an AI design or coding tool. Attach this README and the relevant project files or screenshots as context.

```text
You are continuing the Green Market website project described in the attached README. Study the existing root-level HTML pages, src/index.css, src/main.ts, src/data/product.json, and the real images under assets/ before making changes.

GOAL
Create or update the requested page/feature so it looks like it belongs to the existing Green Market website. Preserve the current UX/UI, brand identity, page shell, spacing, color system, typography, product-card design and responsive behavior across every page. Do not invent a new visual style or redesign existing pages unless explicitly asked.

TECHNICAL RULES
- Use semantic HTML, Tailwind CSS v4, the existing custom CSS, and plain TypeScript compiled to browser JavaScript.
- Do not use React, JSX, Next.js, Vite, Vue, Svelte or another frontend framework/build system.
- Use Preline UI for supported interface patterns such as the mobile navigation drawer; keep the site-specific interactions in src/main.ts.
- Keep data static and local unless a backend is explicitly requested.
- Reuse existing shared patterns and styles. Avoid introducing a second design system or unnecessary dependencies.
- Product imagery must use real image files already present in assets/. Do not use cartoon, animated, clip-art or illustrated product images. Do not hotlink remote product photos. Check every path and URL-encode spaces in filenames.
- Keep all five root pages working together: index.html, shop.html, categories.html, about.html and contact.html.
- Preserve unique page titles, meta descriptions, image alt text, mobile navigation, dark mode and reduced-motion support.
- Do not break existing filters, search, sort, URL query state, basket count, contact/newsletter confirmation or product rendering.

VISUAL IDENTITY
- Brand: Green Market, a friendly Phnom Penh neighbourhood grocery store. Voice: warm, thoughtful, local and straightforward.
- Main background: warm cream #f8f7f2. Forest brand green: #244b38. Leaf accent: #a8c45b. Main text: #28362c.
- Supporting section colors: sage #e4ead3, peach #f3e4d7, butter #efedcf and muted lilac-neutral #e8e5d9. Use subdued gray-green supporting text and restrained coral sale badges.
- Use DM Sans for body text and controls; Manrope for display headings and card titles. Large headings may include one italic editorial phrase.
- Keep the centered content shell near 1200px on desktop. Use generous whitespace, thin warm borders, 3–4px corners, small uppercase eyebrow labels and compact metadata.
- Keep the sticky translucent header, green announcement strip, footer, floating toast style, card treatment, small circular controls and restrained hover transitions consistent.
- Product cards use a real rectangular product photo, category eyebrow, short name, five-star rating/review count, price/optional struck-through original price, sale badge, heart control and round add button.
- Dark mode uses the existing `.dark` class and the stored `greenmarket-theme` preference. Retain readability and image contrast.

RESPONSIVE RULES
- At desktop sizes, use four columns for product grids and four home category cards.
- At widths up to 980px, collapse product grids to two columns, category grids to two columns and let toolbars/footer wrap as in the existing site.
- At widths up to 640px, stack the homepage hero, use the Preline mobile drawer, hide desktop navigation and keep product grids as two columns.
- Support a 320px-wide viewport without horizontal overflow. Keep tap targets comfortable and text legible.

EXISTING PAGE STRUCTURE
- Home: editorial hero; service-benefit strip; four category cards; four featured products; local-market/sourcing callout; neighbour quote.
- Shop: intro; category filter chips; search and sort controls; dynamic product grid; seasonal availability note.
- Categories: aisle introduction; large photo-backed category rows that link to the filtered shop; promotional callout.
- Our story: intro; photo and story text; three values cards; shop call to action.
- Contact: intro; accessible contact form; email/hours/location panel; order-help callout.
- All pages share the announcement strip, sticky header/navigation, responsive drawer, footer/newsletter and toast region.

IMPLEMENTATION PROCESS
1. Inspect the current files and identify the smallest set of changes that meets the request.
2. Reuse current data structures, CSS classes and page-shell patterns. Keep changes scoped and avoid rewriting unrelated pages.
3. For new product records, add unique IDs and valid local image paths in src/data/product.json; use categories already supported by shop filters.
4. For TypeScript changes, edit src/main.ts, then rebuild so assets/js/main.js stays in sync. For styling changes, edit src/index.css, then rebuild assets/css/output.css.
5. Run `npm run build` after implementation and report any checks that could not be completed.
6. Summarize changed files, behavior and any remaining limitations.

REQUEST TO IMPLEMENT:
[Write the new page, feature or change here.]
```

## Making future UI changes

1. Update the relevant active root HTML page for content and semantic structure.
2. Add or adjust shared design rules in `src/index.css` rather than introducing conflicting page-specific styles.
3. Add interactive behavior in `src/main.ts` and use the existing `data-action`, `data-filter`, `data-sort`, `data-form` and `data-product-grid` hooks where practical.
4. For product work, update `src/data/product.json` and use a valid local image in `assets/`.
5. Run `npm run build` to regenerate `assets/css/output.css` and `assets/js/main.js`.
6. Preview using a local HTTP server; browser `fetch` does not work reliably when pages are opened directly from disk.
