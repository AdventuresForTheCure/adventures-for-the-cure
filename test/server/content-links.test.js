const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const rootPath = path.resolve(__dirname, '../..');
const publicPath = path.join(rootPath, 'public');
const appViewsPath = path.join(publicPath, 'app/views');
const clientPages = [
  ['home/home.html', '/home'],
  ['events/events.html', '/events'],
  ['rides/rides.html', '/rides'],
  ['contact/contact.html', '/contact'],
  ['join/join.html', '/join'],
  ['sponsors/sponsors.html', '/home'],
  ['footer/footer.html', '/home'],
  ['invalidPage/invalidPage.html', '/missing']
];
const appRoutes = new Set([
  '/', '/home', '/join', '/events', '/rides', '/campaigns', '/contact'
]);

function htmlFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(filename) : entry.name.endsWith('.html') ? [filename] : [];
  });
}

function pathExistsWithExactCase(pathname) {
  let currentPath = publicPath;
  for (const segment of pathname.split('/').filter(Boolean)) {
    const entries = fs.readdirSync(currentPath);
    if (!entries.includes(segment)) return false;
    currentPath = path.join(currentPath, segment);
  }
  return fs.existsSync(currentPath) && fs.statSync(currentPath).isFile();
}

test('reachable HTML content only references valid local assets and routes', () => {
  const documents = clientPages.map(([file, route]) => [path.join(appViewsPath, file), route]);
  const campaignDirectory = path.join(appViewsPath, 'campaigns/campaigns');
  documents.push(...htmlFiles(campaignDirectory).map((file) => [file, '/campaigns']));

  const brokenReferences = [];
  for (const [filename, route] of documents) {
    const html = fs.readFileSync(filename, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    for (const match of html.matchAll(/\b(src|poster|href)=["']([^"']+)["']/gi)) {
      const kind = match[1].toLowerCase();
      const value = match[2].trim();
      if (!value || value.includes('{{') || /^(https?:|\/\/|data:|javascript:|mailto:|tel:|#)/i.test(value)) continue;

      const url = new URL(value, `http://localhost${route}`);
      const pathname = decodeURIComponent(url.pathname);
      if (kind === 'href' && (appRoutes.has(pathname) || pathname.startsWith('/api/'))) continue;
      const relativePath = pathname.replace(/^\/+/, '');
      const targetPath = path.resolve(publicPath, relativePath);
      if (!targetPath.startsWith(publicPath + path.sep) || !pathExistsWithExactCase(relativePath)) {
        brokenReferences.push(`${path.relative(rootPath, filename)}: ${kind} ${value}`);
      }
    }
  }

  assert.deepEqual(brokenReferences, []);
});
