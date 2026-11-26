# Adventures For the Cure

Legacy website built with Node.js, Express, Jade, and AngularJS. The project targets Node 6.9.x and npm 3.10.x; its older dependencies may not work with modern Node versions.

## Setup

In PowerShell, from the project root:

```powershell
npm install
.\node_modules\.bin\bower.cmd install
```

## Run locally

```powershell
npm run start-local
```

The site listens on port `3030` by default. Set `PORT` to use a different port.

## Build and development tasks

The local Gulp executable is `node_modules/.bin/gulp` (`gulp.cmd` on Windows).

```powershell
.\node_modules\.bin\gulp.cmd                 # Default: lint client JavaScript and build public/dist/app.js
.\node_modules\.bin\gulp.cmd public-all      # Clean and rebuild the client bundle
.\node_modules\.bin\gulp.cmd server-all      # Lint server JavaScript
.\node_modules\.bin\gulp.cmd development     # Build, lint server code, watch files, and restart the server
```

Gulp also defines `public-test` and `server-test`, which look for tests in `test/public/` and `test/server/`. Those directories currently contain no test files.
