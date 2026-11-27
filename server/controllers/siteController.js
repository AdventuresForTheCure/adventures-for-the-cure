var config = require('../config/config');
var fs = require('fs/promises');
var fsSync = require('fs');
var path = require('path');
var { pathToFileURL } = require('url');
var contentFiles = require('../utilities/contentFiles');
var campaignSlugs = require('../utilities/campaignSlugs');
var siteSeo = require('../../shared/siteSeo.json');

var rendererPromise;

function escapeHtml(value) {
  return campaignSlugs.escapeHtml(value);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeCampaignHtml(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function campaignImage(html, pageUrl) {
  var match = html.match(/<img\b[^>]*\bsrc\s*=\s*['"]([^'"]+)['"]/i);
  if (!match || /^(data:|javascript:)/i.test(match[1])) return '';
  try {
    return new URL(match[1], pageUrl).href;
  } catch {
    return '';
  }
}

function createMetadata({title, description, canonicalUrl, imageUrl, jsonLd}) {
  var metadata = [
    '<meta name="description" content="' + escapeHtml(description) + '">',
    '<link rel="canonical" href="' + escapeHtml(canonicalUrl) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="' + escapeHtml(title) + '">',
    '<meta property="og:description" content="' + escapeHtml(description) + '">',
    '<meta property="og:url" content="' + escapeHtml(canonicalUrl) + '">',
    '<meta name="twitter:card" content="' + (imageUrl ? 'summary_large_image' : 'summary') + '">',
    '<meta name="twitter:title" content="' + escapeHtml(title) + '">',
    '<meta name="twitter:description" content="' + escapeHtml(description) + '">'
  ];
  if (imageUrl) {
    metadata.push('<meta property="og:image" content="' + escapeHtml(imageUrl) + '">');
    metadata.push('<meta name="twitter:image" content="' + escapeHtml(imageUrl) + '">');
  }
  if (jsonLd) {
    metadata.push('<script type="application/ld+json">' + JSON.stringify(jsonLd).replace(/</g, '\\u003c') + '</script>');
  }
  return metadata.join('\n    ');
}

async function loadRenderer() {
  if (!rendererPromise) rendererPromise = import(pathToFileURL(config.serverBundlePath).href);
  return rendererPromise;
}

async function buildPageData(req) {
  if (req.path === '/campaigns' || req.path.startsWith('/campaigns/')) {
    var files = await contentFiles.listFiles(config.campaignsPath, '.html');
    var names = files.map(function(fileName) { return fileName.slice(0, -5); });
    var entries = campaignSlugs.createCampaignEntries(names).sort(function(a, b) {
      return b.name.localeCompare(a.name);
    });
    var campaign = null;
    var html = '';

    if (req.params.slug) {
      campaign = entries.find(function(entry) { return entry.slug === req.params.slug; });
      if (!campaign) return {notFound: true};
    } else if (req.path === '/campaigns') {
      campaign = entries[0] || null;
    }

    if (campaign) {
      html = await contentFiles.readContent(config.campaignsPath, campaign.name, '.html');
      html = normalizeCampaignHtml(html);
    }

    return {
      initialData: {campaigns: entries, selectedCampaign: campaign, campaignHtml: html},
      campaign: campaign,
      campaignHtml: html
    };
  }
  return {initialData: null};
}

exports.renderPage = async function(req, res, next) {
  try {
    var pageData = await buildPageData(req);
    if (pageData.notFound) return res.status(404).type('text').send('Campaign not found');

    var page = pageData.campaign
      ? {
          title: pageData.campaign.title + ' | Adventures For the Cure',
          description: campaignSlugs.getCampaignDescription(pageData.campaignHtml, pageData.campaign.title),
          image: campaignImage(pageData.campaignHtml, config.siteUrl + req.path)
        }
      : siteSeo.pages[req.path];

    if (!page) return res.status(404).type('text').send('Page not found');

    var canonicalPath = pageData.campaign ? '/campaigns/' + pageData.campaign.slug : req.path;
    var canonicalUrl = config.siteUrl + canonicalPath;
    var imageUrl = page.image
      ? new URL(page.image, config.siteUrl).href
      : new URL(siteSeo.organization.logo, config.siteUrl).href;
    var jsonLd = req.path === '/' ? {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteSeo.organization.name,
      url: config.siteUrl,
      logo: new URL(siteSeo.organization.logo, config.siteUrl).href,
      description: siteSeo.organization.description,
      email: siteSeo.organization.email,
      nonprofitStatus: 'https://schema.org/Nonprofit501c3',
      areaServed: [
        {'@type': 'AdministrativeArea', name: 'Maryland'},
        {'@type': 'Country', name: 'United States'}
      ]
    } : null;

    var templatePath = fsSync.existsSync(config.appPath) ? config.appPath : path.join(config.rootPath, 'index.html');
    if (!fsSync.existsSync(config.serverBundlePath)) {
      return res.sendFile(templatePath);
    }

    var renderer = await loadRenderer();
    var markup = renderer.render(req.originalUrl, pageData.initialData);
    var template = await fs.readFile(templatePath, 'utf8');
    var escapedData = pageData.initialData
      ? '<script type="application/json" id="__AFC_INITIAL_DATA__">' + JSON.stringify(pageData.initialData).replace(/</g, '\\u003c') + '</script>'
      : '';
    var rootMarkup = '<div id="root">' + markup + '</div>' + escapedData;

    template = template.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + escapeHtml(page.title) + '</title>');
    template = template.replace('<div id="root"></div>', rootMarkup);
    template = template.replace('</head>', createMetadata({
      title: page.title,
      description: page.description,
      canonicalUrl: canonicalUrl,
      imageUrl: imageUrl,
      jsonLd: jsonLd
    }) + '\n  </head>');
    res.status(200).type('html').send(template);
  } catch (error) {
    next(error);
  }
};

exports.getSitemap = async function(req, res, next) {
  try {
    var paths = Object.keys(siteSeo.pages).filter(function(route) { return route !== '/campaigns'; });
    var files = await contentFiles.listFiles(config.campaignsPath, '.html');
    var names = files.map(function(fileName) { return fileName.slice(0, -5); });
    var campaigns = campaignSlugs.createCampaignEntries(names);
    paths = paths.concat(campaigns.map(function(campaign) { return '/campaigns/' + campaign.slug; }));

    var urlEntries = paths.map(function(route) {
      return '  <url><loc>' + escapeXml(config.siteUrl + route) + '</loc></url>';
    });
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urlEntries.join('\n') + '\n</urlset>\n';
    res.type('application/xml').send(xml);
  } catch (error) {
    next(error);
  }
};
