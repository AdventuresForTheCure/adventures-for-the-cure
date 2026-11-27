const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const http = require('node:http');
const app = require('../../server/app');

let server;
let baseUrl;

before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});

test('serves the client application for browser routes', async () => {
  const response = await fetch(`${baseUrl}/home`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.equal(new URL(response.url).pathname, '/');
  assert.match(html, /id="root"/);
  assert.match(html, /Fundraise Through Cycling and Adventure/);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.adventuresforthecure\.com\/"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /type="module"/);
});

test('serves server-rendered campaign pages with unique metadata and content', async () => {
  const response = await fetch(`${baseUrl}/campaigns/patapsco-100-2026`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /<title>Patapsco 100 2026 \| Adventures For the Cure<\/title>/);
  assert.match(html, /<h1>Patapsco <span>100<\/span><\/h1>/);
  assert.match(html, /Total raised so far/);
  assert.match(html, /property="og:title"/);
});

test('publishes crawl rules and a sitemap for canonical pages', async () => {
  const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
  const robots = await robotsResponse.text();
  assert.equal(robotsResponse.status, 200);
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \/$/m);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: https:\/\/www\.adventuresforthecure\.com\/sitemap\.xml/);

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get('content-type'), /application\/xml/);
  assert.match(sitemap, /https:\/\/www\.adventuresforthecure\.com\//);
  assert.match(sitemap, /https:\/\/www\.adventuresforthecure\.com\/campaigns\/patapsco-100-2026/);
  assert.doesNotMatch(sitemap, /\/api\//);
  assert.doesNotMatch(sitemap, /\/home(?:<|\/)/);
});

test('lists campaigns and serves a campaign content file', async () => {
  const listResponse = await fetch(`${baseUrl}/api/campaigns`);
  const campaigns = await listResponse.json();
  const campaignName = '2026-12-11 Patapsco 100 2026';

  assert.equal(listResponse.status, 200);
  assert.ok(campaigns.some((campaign) => campaign.name === campaignName));

  const detailResponse = await fetch(`${baseUrl}/api/campaigns/${encodeURIComponent(campaignName)}`);
  const html = await detailResponse.text();

  assert.equal(detailResponse.status, 200);
  assert.match(detailResponse.headers.get('content-type'), /text\/html/);
  assert.match(html, /Patapsco/);
});

test('serves static assets', async () => {
  const response = await fetch(`${baseUrl}/img/afc.jpg`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image/);
});

test('returns JSON not-found responses for unknown and retired integration APIs', async () => {
  for (const endpoint of ['/api/not-a-route', '/api/xero/inventoryItems', '/api/videos', '/api/sponsorLogos', '/api/jerseyImages']) {
    const response = await fetch(`${baseUrl}${endpoint}`);

    assert.equal(response.status, 404);
    assert.equal((await response.json()).reason, 'API endpoint not found');
  }
});

test('returns a not-found response for missing campaign content', async () => {
  const response = await fetch(`${baseUrl}/api/campaigns/not-a-real-campaign`);

  assert.equal(response.status, 404);
  assert.equal((await response.json()).reason, 'Content not found');
});

test('returns a not-found response for an unknown campaign URL', async () => {
  const response = await fetch(`${baseUrl}/campaigns/not-a-real-campaign`);

  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'Campaign not found');
});
