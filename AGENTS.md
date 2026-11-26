# Project Guide

## Project shape

This is a legacy Adventures For the Cure website built with Node.js, Express 4, Jade, and AngularJS. Express is the server entrypoint (`server.js`): it configures middleware, registers routes, serves `public/` as static content, renders the initial page, and serves Jade templates as client partials. AngularJS owns browser-side navigation and loads those partials through `/partials/*`.

The README records the project's original migration goals and historical setup notes. Treat it as background, not as a definitive description of current functionality; inspect the implementation before relying on it.

## Where things live

- `server/config/` contains environment configuration, Express setup, route registration, cache headers, and optional database/cloud-service setup.
- `server/controllers/`, `server/models/`, and `server/utilities/` contain the server-side handlers and supporting code.
- `server/views/` and `server/includes/` contain the Jade page shell and shared template fragments.
- `public/app/app.js` defines AngularJS routes. `public/app/services/`, `public/app/models/`, and `public/app/views/` contain client services, models, and page templates/controllers.
- `public/app/views/campaigns/campaigns/` and `public/app/views/results/videos/` hold individual HTML content entries. The API discovers these files from disk and returns their names/content.
- `public/dist/app.js` is the generated browser bundle. `public/vendor/` contains browser dependencies installed through Bower; do not edit generated or vendor files to make application changes.
- `public/css/`, `public/img/`, `public/docs/`, and other files under `public/` are served as static assets. `resources/` is a separate archive of source and historical media, not the web server's static root.

## Development and verification

- `npm run start-local` starts the Express app with Node using `server.js` (default development port is 3030).
- `npx gulp` runs the default Gulp task: clean `public/dist/`, lint browser JavaScript, and rebuild `public/dist/app.js` with Angular annotation.
- `npx gulp server-all` runs the server JavaScript lint task. `npx gulp public-all` runs the browser lint and bundle tasks.
- Gulp defines `server-test` and `public-test` tasks for `test/server/*.js` and `test/public/*.js`. No test files are currently present, so do not describe the test suite as passing or as providing coverage.
- `npm run start-local` does not build the browser bundle first. Rebuild it with Gulp when changing client JavaScript.

The package declares Node 6.9.x and npm 3.10.x, and the dependencies/tooling are old. Check compatibility before changing runtime or dependencies; avoid broad upgrades unless the task requires them. Gulp 3 may not run on newer Node releases without compatibility workarounds.

## Change guidance

- Make client JavaScript changes in `public/app/`; treat `public/dist/app.js` as generated output. Follow the existing AngularJS module, service, controller, and dependency-injection patterns unless the task includes a deliberate modernization.
- Express renders `.jade` templates for `/partials/*`. Many view directories also contain `.html` counterparts; inspect both and existing references before editing so the change matches the path actually used by the application.
- Campaign and video entries are content files consumed by filesystem-backed API endpoints. Preserve their filename conventions and verify references to local images/documents when changing them.
- Keep changes focused on the requested behavior. Do not infer that planned features in the README (such as member authentication) are implemented; several authentication routes and client route guards are commented out.
- Mongoose models and a Mongo connection helper exist, but `server.js` does not currently invoke the Mongo setup. Confirm the active startup and route path before assuming a model is backed by a live database.
- Never add credentials, tokens, or private keys to source or documentation. Use environment configuration for secrets and avoid copying existing credential values when working near integrations.
- Before editing, inspect `git status` and preserve unrelated user changes. Report the checks actually run and their outcomes; do not claim tests passed when none were available.
