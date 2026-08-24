# 🍲 Kitchen Atlas

A single-page dashboard: tell it what is in your kitchen, and it shows you the
well-known international dishes you can actually make with it — where each one
comes from, its history, a picture, the full ingredient list and the method.

**Live:** https://mjjaber.github.io/pagerefresh-privacy-policy/kitchen-atlas/

## What it does

- **Add ingredients** by typing (with autocomplete, plurals and everyday synonyms —
  "aubergine", "courgette", "prawns", "beef mince" all resolve correctly), or tap
  the quick-add chips for the ingredients that unlock the most dishes.
- **Ranks 74 famous dishes** from 30+ countries by how much of each you already have.
- **Cook now / Almost there** filters: dishes you can make with nothing missing, or
  dishes that are one or two items short.
- **Every dish opens a full card**: country and region, the story of where the dish
  came from, a photo, ingredients with ✓ for what you have, and numbered steps.
- **"Buy one thing, unlock more"** works out which single missing ingredient would
  open up the most new dishes.
- Search, sort (best match / quickest / A–Z / country), region filter, dark and
  light themes, printable recipes, and a 🎲 Surprise me button.

Your ingredient list is stored in your own browser (localStorage) and never leaves it.

## On a phone

The layout is phone-first — this is an app you use standing in a kitchen:

- **Compact list view by default** on phones (thumbnail, dish, what you're missing),
  so four or five dishes fit per screen; a toggle in the filter bar switches to
  full picture cards, and the choice is remembered.
- **Sticky filter bar and ingredient box** — search and the Cook now / Almost there
  tabs stay reachable while the list scrolls.
- **The ingredient chips and quick-add row are single swipeable strips**, so a long
  kitchen list never pushes the dishes off the screen.
- **A dish opens as a full-screen sheet**, and the phone's back button/gesture closes
  it instead of leaving the app. Each dish also has its own link (…/#pad-thai).
- **The screen stays awake while a recipe is open** (Wake Lock, where supported), and
  tapping a step or an ingredient ticks it off as you cook.
- **Add to Home Screen** works — it installs with an icon and opens full-screen
  (`manifest.webmanifest`, standalone display, maskable icons).
- All tap targets are at least 42px, inputs are 16px so iOS never zooms on focus,
  and the layout respects notch/home-bar safe areas in both orientations.

## How it is built

Plain HTML, CSS and JavaScript — no build step, no framework, no server.

```
kitchen-atlas/
  index.html            layout
  manifest.webmanifest  add-to-home-screen metadata
  icons/                app icons (generated, not hand-drawn)
  css/styles.css        styling, themes, phone-first layout
  js/dishes.js          the dish database (country, history, ingredients, method)
  js/app.js             matching, filtering, ranking, rendering
```

Photos and the "read more" links come from Wikipedia's public API at page load and
are cached in the browser; if a picture cannot be fetched, the card falls back to an
illustrated tile, so the app works fully offline apart from the images.

## Adding a dish

Append an object to `window.DISHES` in `js/dishes.js`:

```js
{
  id:"unique-slug", name:"Dish Name", country:"Country", flag:"🇺🇳", region:"Europe",
  wiki:"Wikipedia article title", time:"30 min", diff:"Easy", serves:4, tags:["soup"],
  blurb:"One line for the card.",
  history:"A paragraph on where it comes from.",
  ing:[["canonical ingredient key","200 g of the thing"]],
  staples:["salt","black pepper"],
  steps:["Do this.","Then this."]
}
```

The first element of each `ing` entry is the key used for matching — reuse the keys
already in the file so the autocomplete and equivalence rules keep working. Anything
listed in `staples` is assumed to be in every kitchen and never counts as missing.
