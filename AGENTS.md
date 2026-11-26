# Project guide

## Architecture

This is a Node.js 26, Express 5, React, and Vite site. `server.js` starts the Express application from `server/app.js`. Express configures middleware, registers JSON APIs, serves the built Vite app from `dist/` when present, and serves static files from `public/`. Vite serves the React app in development; its `/api` requests proxy to Express on port 3030.

The React app uses React Router. Some informational pages still render existing HTML content files from `public/app/views/`; campaign and video entries are served as HTML through filesystem-backed APIs. Treat those files as site content and retain their filenames and links.

## Where things live

- `server/config/`: environment configuration, Express middleware, and routes.
- `server/controllers/` and `server/utilities/`: filesystem-backed API handlers and shared server helpers.
- `src/`: React entrypoint, routes/pages, shared components, styles, and client tests.
- `public/`: static images, CSS, documents, and retained HTML page/campaign/video content.
- `resources/`: archival source and historical materials; it is not served as the website's static root.
- `dist/`: generated Vite production output. Do not edit it directly.
- `test/server/`: Node test-runner route tests.

## Common commands

- `npm install`: install locked npm dependencies.
- `npm run dev`: start Vite and Express together; open `http://localhost:5173` for development.
- `npm run server:dev`: run only Express with Node's file watcher when the API needs to be started separately.
- `npm run build`: produce the browser app in `dist/`.
- `npm start`: start Express. Run `npm run build` first to serve the production app.
- `npm run start-local`: build and start the production-like site on port 3030; it does not need a separate build command.
- `npm test`, `npm run test:server`, and `npm run test:client`: run the current server and client checks.
- `npm run audit`: audit npm dependencies.

## Change guidance and constraints

- Edit client behavior in `src/`, not generated files in `dist/`.
- Campaign and video HTML are API-backed content. Preserve their names and verify any referenced local assets when editing them.
- When changing a retained informational HTML page, inspect its React route and shared CSS context. Avoid reviving removed Jade or AngularJS paths.
- The current server has no database, upload provider, or outgoing email service. Public `mailto:` links are part of site content and open the visitor's mail application.
- Read current code and `git status` before editing. Preserve unrelated working-tree changes.
- Keep secrets and tokens out of source and documentation. Configure the production session secret through the environment and rotate any real credentials that were previously exposed in source.
- Report the checks actually run and their outcomes.
