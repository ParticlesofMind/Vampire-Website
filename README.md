# Vampires in New York

Interactive comic reader for James Marston's story. Chapter one: The New Beginning.

## Run it

```bash
npm install
npm run dev      # dev server with live reload, opens the landing page
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Layout

- `index.html` sends visitors to the landing page
- `html/` pages: landing (`index.html`), reader (`comicReader.html`), shop, login
- `scss/` styles, compiled by Vite (no separate Sass step)
  - `theme.scss` colors, type and the shared header, footer and buttons
  - `comicReader.scss` reader, narration boxes and settings drawer
  - `home.scss` landing page
- `public/js/` reader scripts
- `public/json/imagePaths.json` panel layout, narration text and audio per page
- `public/assets/` panel art, animations and sound

## Look

Blackletter for names and section titles, IM Fell English for printed captions and interface text,
Special Elite for Marston's own voice. Night background by default, with a paper background in the reader settings.
