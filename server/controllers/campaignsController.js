var config = require('../config/config');
var fs = require('fs/promises');
var fsSync = require('fs');
var path = require('path');
var contentFiles = require('../utilities/contentFiles');
var campaignSlugs = require('../utilities/campaignSlugs');

exports.getCampaigns = async function(req, res, next) {
  try {
    var files = await contentFiles.listFiles(config.campaignsPath, '.html');
    var names = files.map(function(fileName) { return fileName.slice(0, -5); });
    res.json(campaignSlugs.createCampaignEntries(names));
  } catch (error) {
    next(error);
  }
};

exports.getCampaign = async function(req, res, next) {
  try {
    var html = await contentFiles.readContent(config.campaignsPath, req.params.name, '.html');
    res.type('html').send(html);
  } catch (error) {
    next(error);
  }
};

exports.getCampaignPage = async function(req, res, next) {
  try {
    var files = await contentFiles.listFiles(config.campaignsPath, '.html');
    var names = files.map(function(fileName) { return fileName.slice(0, -5); });
    var campaign = campaignSlugs.createCampaignEntries(names).find(function(entry) {
      return entry.slug === req.params.slug;
    });

    if (!campaign) return res.status(404).type('text').send('Campaign not found');

    var htmlPath = path.join(config.campaignsPath, campaign.name + '.html');
    var indexPath = fsSync.existsSync(config.appPath) ? config.appPath : path.join(config.rootPath, 'index.html');
    var result = await Promise.all([fs.readFile(indexPath, 'utf8'), fs.readFile(htmlPath, 'utf8')]);
    var pageHtml = result[0];
    var campaignHtml = result[1];
    var title = campaign.title + ' | Adventures For the Cure';
    var description = campaignSlugs.getCampaignDescription(campaignHtml, campaign.title);
    var canonicalUrl = req.protocol + '://' + req.get('host') + '/campaigns/' + encodeURIComponent(campaign.slug);
    var imageMatch = campaignHtml.match(/<img\b[^>]*\bsrc\s*=\s*['"]([^'"]+)['"]/i);
    var imageUrl = '';

    if (imageMatch && !/^(data:|javascript:)/i.test(imageMatch[1])) {
      try {
        imageUrl = new URL(imageMatch[1], canonicalUrl).href;
      } catch {
        imageUrl = '';
      }
    }

    var escape = campaignSlugs.escapeHtml;
    var metadata = [
      '<meta name="description" content="' + escape(description) + '">',
      '<link rel="canonical" href="' + escape(canonicalUrl) + '">',
      '<meta property="og:type" content="website">',
      '<meta property="og:title" content="' + escape(title) + '">',
      '<meta property="og:description" content="' + escape(description) + '">',
      '<meta property="og:url" content="' + escape(canonicalUrl) + '">',
      '<meta name="twitter:card" content="' + (imageUrl ? 'summary_large_image' : 'summary') + '">',
      '<meta name="twitter:title" content="' + escape(title) + '">',
      '<meta name="twitter:description" content="' + escape(description) + '">'
    ];
    if (imageUrl) {
      metadata.push('<meta property="og:image" content="' + escape(imageUrl) + '">');
      metadata.push('<meta name="twitter:image" content="' + escape(imageUrl) + '">');
    }

    pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + escape(title) + '</title>');
    pageHtml = pageHtml.replace('</head>', metadata.join('\n    ') + '\n  </head>');
    res.type('html').send(pageHtml);
  } catch (error) {
    next(error);
  }
};
