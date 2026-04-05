# Design System Document: High-End Banking Web Experience

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Vault."**

Unlike traditional banking interfaces that feel like static spreadsheets, this system is designed to feel like a high-precision, living instrument. It moves away from the "template" look of the web by utilizing deep, infinite blacks juxtaposed with high-energy neon light sources. We avoid rigid, boxy layouts in favor of intentional asymmetry—where key data points are elevated through scale and glow rather than just placement. The goal is to provide a "Cyber-Premium" experience that feels both impenetrable and incredibly fluid.

## 2. Colors
Our palette is rooted in absolute depth, using the contrast between the void of the background and the electric vitality of the primary accent.

### Palette Highlights
* **Background (`#0e0e0e`):** The canvas. It is a deep, near-black that provides the foundation for all light-based elements.
* **Primary (`#8eff71`):** A vibrant, neon green used sparingly for high-intent actions and critical status indicators.
* **Surface Containers:** Ranging from `surface-container-lowest` (`#000000`) to `surface-container-highest` (`#262626`). These define the "geometry" of the app.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. For example, a card should be a `surface-container-high` block sitting directly on a `surface` background. The difference in tonal value is sufficient to define the edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers.
* **Base:** `surface` (`#0e0e0e`).
* **Sectioning:** Use `surface-container-low` for large background areas.
* **Interaction Hubs:** Use `surface-container-highest` for cards and interactive modules.
* **Nesting:** If a card contains a nested element (like a small "Quick Action" box), that element should shift to a different container tier to create "visual gravity."

### The "Glass & Gradient" Rule
To move beyond a flat "Material" look, utilize **Glassmorphism**. Floating elements (Modals, Dropdowns) must use semi-transparent surface colors with a `backdrop-filter: blur(20px)`.
**Signature Textures:** Main CTAs should not be flat. Use a subtle linear gradient transitioning from `primary` (`#8eff71`) to `primary-container` (`#2ff801`) at a 135-degree angle to provide a sense of "liquid light."

## 3. Typography
We use **Inter** as our typographic backbone for its clinical precision and readability at small scales.

* **Display (lg/md/sm):** Used for account balances and "Hero" impact statements. These should be tight-tracked (-2%) to feel authoritative.
* **Headline & Title:** Used for section headers. In this system, titles are often used in `on-surface-variant` (`#ababab`) to let the data (Display) take center stage.
* **Body & Labels:** Functional and clean. Labels use `label-sm` in all-caps with a 5% letter spacing to create a technical, "instrument-panel" aesthetic.

The hierarchy is built on **Tonal Contrast**: Bold, white (`on-surface`) for primary information; muted grey (`on-surface-variant`) for secondary context; and neon green (`primary`) for the most critical interactive paths.

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, mimicking a physical environment where objects closer to the user catch more ambient light.

* **The Layering Principle:** Avoid "Drop Shadows" in the traditional sense. Use the `surface-container` tiers to stack elements. A `surface-container-highest` card provides enough "lift" against a `#0e0e0e` background without any shadow at all.
* **Ambient Shadows:** If an element must "float" (like a global navigation bar or a modal), use a shadow with a blur value of `40px-80px` and an opacity of `6%`. The shadow color should be a tinted dark green (using a low-opacity version of `on-primary-fixed`) to make the light feel integrated into the dark theme.
* **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` token at **15% opacity**. This creates a "hairline" effect that is felt rather than seen.
* **Glassmorphism:** For all overlays, use a `surface-variant` color at 60% opacity with a heavy backdrop blur. This allows the neon accents from the layer below to bleed through, creating a sophisticated, multi-dimensional depth.

## 5. Components

### Buttons
* **Primary:** Gradient of `primary` to `primary-container`. High-contrast black text (`on-primary`). `0.75rem` (md) corner radius.
* **Secondary:** Ghost style. No background fill, `Ghost Border` (15% opacity), and `primary` colored text.
* **Tertiary:** Transparent background. Text is `on-surface-variant`, shifting to `on-surface` on hover.

### Input Fields
* **Styling:** No bottom line. Fields are `surface-container-highest` blocks.
* **Focus State:** The container background remains the same, but the `Ghost Border` increases to 100% opacity of the `primary` color, creating a subtle neon ring.
* **Error:** Use the `error` (`#ff7351`) token for the label and a subtle glow on the input container.

### Cards & Lists
* **Rules:** Forbid the use of divider lines.
* **Separation:** Use `4.0rem` (16) vertical spacing between major list groups or change the `surface-container` tier.
* **Interaction:** On hover, a card's background should shift from `surface-container-high` to `surface-container-highest`.

### Signature Component: The "Action Tile"
For banking operations (Transfer, Withdraw, Pay), use large, square tiles (as seen in the mobile reference). These tiles use `surface-container-highest` and feature a centered `primary` icon. On hover, the icon should emit a soft `primary` glow (outer shadow).

## 6. Do's and Don'ts

### Do
* **Do** use asymmetrical layouts. Let the account balance (Display-lg) sit off-center to create a modern, editorial feel.
* **Do** use the `20` (5rem) spacing token for major section breathing room. High-end banking is about "space."
* **Do** use the `primary` green for "Success" and "Growth" (e.g., positive balance shifts).

### Don'ts
* **Don't** use 100% white backgrounds for any reason.
* **Don't** use standard "Box Shadows" (small blur, high opacity). They look "cheap" in a dark theme.
* **Don't** use dividers. If you feel the need for a divider, increase the spacing (`10` or `12` token) instead.
* **Don't** clutter the navigation. Use a high-contrast, minimalist side-nav or a floating "Glass" top-nav.