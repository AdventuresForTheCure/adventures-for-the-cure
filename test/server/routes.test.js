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
  assert.match(html, /id="root"/);
  assert.match(html, /type="module"/);
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
