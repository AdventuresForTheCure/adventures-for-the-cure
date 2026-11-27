# Adventures For the Cure

The site runs on Node.js 26, Express 5, React, and Vite. Campaign and video pages are HTML content under `public/app/views/` and are served by the Express API.

## Install

```sh
npm install
```

## Run locally

For day-to-day development, run this once:

```sh
npm run dev
```

This starts both the Vite frontend and Express API. Open <http://localhost:5173>. Vite proxies API requests to Express on port `3030`; no separate terminal or build step is needed.

For a production-like local run, use:

```sh
npm run start-local
```

This builds the frontend and starts Express on <http://localhost:3030>. It also builds automatically, so you do not need to run `npm run build` first.

`npm run build` creates the production files in `dist/`. Run it before `npm start`, which starts Express without building. `PORT` can change the default server port.

## Search visibility

Production builds include server-rendered HTML for public page routes and the campaign archive. Campaign detail pages have dedicated `/campaigns/<slug>` URLs. Express also provides `/sitemap.xml`, and `public/robots.txt` allows public crawling while excluding API endpoints.

After deployment, verify `https://www.adventuresforthecure.com/` in Google Search Console and submit `https://www.adventuresforthecure.com/sitemap.xml`. Search Console ownership verification and sitemap submission require access to the site’s Search Console property. The robots policy allows all crawlers, including crawlers used for AI search and model training.

## Checks

```sh
npm test             # Server route/content-link checks and React tests
npm run test:server  # Server tests only
npm run test:client  # React tests only
npm run audit        # npm security audit
```

Edit client behavior in `src/`, site images and styles in `public/`, and campaign/video content in their existing HTML directories. Build output in `dist/` is generated.
