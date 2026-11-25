# VirgoPoint Haulage website

The public site for VirgoPoint Haulage, a VirgoPoint Capital company. It is a static, multi-page site: plain HTML, CSS and a little JavaScript, with no framework and no build step.

```
site/                 everything that is served
  index.html          Home: "Port to door."
  services-*.html     Terminal collection, Road haulage
  carriers.html       Register as a transporter
  track.html          Track a shipment (hands off to WhatsApp until WatchTower tracking is live)
  watchtower.html     WatchTower (customer product, early access)
  proof-of-delivery.html
  quote.html          Get a quote (sends the request to WhatsApp)
  about.html, privacy.html, terms.html
  signature.html      Email Signature Studio (internal tool)
  img/, trk/, brand/  images, videos and logos
tests/e2e/            Playwright smoke tests
```

## Run it

```bash
pnpm install
pnpm dev               # http://localhost:5173
pnpm test:e2e          # set PW_CHROMIUM=/path/to/chrome to use a Chromium you already have
```

## How the pages are made

The pages are generated from the design drafts (concept C3, "Follow one trip") in the project files, `vpc/website/concept-c/pages-r1/source/`. Run the steps in this order: `build_quote2.py`, `site2.py`, `home_opts.py`, `carriers_opts.py`, then `finalize.py`. The last step writes the production pages to `pages-r1/prod/`, which are copied into `site/` here.

## What is not live yet

- **Forms** open WhatsApp with the details written out. There is no server-side form handling yet.
- **Track** does not look anything up. It hands the number to WhatsApp until WatchTower serves live terminal and GPS data.
- **Sign in** to WatchTower is not built. The page asks customers to request early access.
- **Privacy and Terms** are drafts for legal review, and the pages say so.
- **Pictures** are the current scene renders. Final assets will be swapped in later.

## Deploy

`vercel.json` serves `site/` as-is, with clean URLs. The live vpc.com.ng is still the older page, deployed by hand to the Vercel project `vpc-ng`. Merging this branch does not change the live site.
