function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

exports.createCampaignEntries = function(names) {
  var entries = names.map(function(name) {
    var datePrefix = name.match(/^(\d{4})-\d{2}(?:-\d{2})?\s+/);
    var title = name.replace(/^\d{4}-\d{2}(?:-\d{2})?\s+/, '').trim() || name;
    return {
      name: name,
      title: title,
      baseSlug: slugify(title) || 'campaign',
      fullSlug: slugify(name) || 'campaign',
      year: datePrefix ? datePrefix[1] : ''
    };
  });
  var baseCounts = new Map();
  entries.forEach(function(entry) {
    baseCounts.set(entry.baseSlug, (baseCounts.get(entry.baseSlug) || 0) + 1);
  });

  var usedSlugs = new Set();
  return entries.map(function(entry, index) {
    var slug = entry.baseSlug;
    if (baseCounts.get(slug) > 1 && entry.year) slug += '-' + entry.year;
    if (usedSlugs.has(slug)) slug = entry.fullSlug;
    if (usedSlugs.has(slug)) slug += '-' + (index + 1);
    usedSlugs.add(slug);
    var title = entry.title;
    if (baseCounts.get(entry.baseSlug) > 1 && entry.year && !new RegExp('\\b' + entry.year + '$').test(title)) {
      title += ' ' + entry.year;
    }
    return {name: entry.name, title: title, slug: slug};
  });
};

exports.escapeHtml = function(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

exports.getCampaignDescription = function(html, title) {
  var description = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  if (!description) return 'Explore the ' + title + ' campaign from Adventures For the Cure.';
  if (description.length > 160) description = description.slice(0, 157).replace(/\s+\S*$/, '') + '...';
  return description;
};
