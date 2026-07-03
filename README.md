# Dragon Ink and Thread — Website

Marketing website for **Dragon Ink and Thread**, a soon-to-open small business in
Texas hand-sewing goods like totes, scrunchies, and bows (with more to come).

It's a single-page static site — plain HTML, CSS, and vanilla JavaScript. No build
step, no dependencies.

## Structure

```
.
├─ index.html        # The whole page (hero, about, products, what's next, contact)
├─ css/styles.css    # Warm handmade/boutique theme (colors set via CSS variables)
├─ js/main.js        # Mobile nav, scroll-reveal, footer year
└─ assets/           # Put your logo & product photos here (see assets/README.txt)
```

## Preview locally

Just open `index.html` in your browser — that's it.

Or, for clean paths, run a tiny local server:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Make it yours (before launch)

- **Contact info:** Email is `dragoninkandthread@gmail.com`; Instagram/TikTok link to
  `@dragonink_and_thread`. The "Join the Nest" form opens the visitor's mail app with a
  pre-filled signup email (no backend needed) — swap in Mailchimp/Buttondown later if
  the list outgrows the inbox.
- **Photos:** Add images to `assets/` and swap the emoji placeholder blocks for
  `<img>` tags (instructions in `assets/README.txt`).
- **Colors:** Tweak the palette at the top of `css/styles.css` (the `:root` variables).
- **Copy:** Edit the text in `index.html` to match your voice.

## Deploy

Because it's fully static, you can host it free on:

- **GitHub Pages** — push this repo and enable Pages on the `main` branch.
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder or connect the repo.

## License

© Dragon Ink and Thread. All rights reserved.
