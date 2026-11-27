import siteSeo from '../shared/siteSeo.json';

function updateMeta(attribute, key, value) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
  element.dataset.routeMeta = 'true';
}

function updateCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
  element.dataset.routeMeta = 'true';
}

export function applyPageMetadata(pathname) {
  const page = siteSeo.pages[pathname];
  if (!page) return;

  const canonicalUrl = new URL(pathname, siteSeo.siteUrl).href;
  const imageUrl = new URL(page.image || siteSeo.organization.logo, siteSeo.siteUrl).href;
  applyCustomMetadata({title: page.title, description: page.description, canonicalUrl, imageUrl});
}

export function applyCustomMetadata({title, description, canonicalUrl, imageUrl}) {
  document.title = title;
  updateMeta('name', 'description', description);
  updateMeta('property', 'og:type', 'website');
  updateMeta('property', 'og:title', title);
  updateMeta('property', 'og:description', description);
  updateMeta('property', 'og:url', canonicalUrl);
  if (imageUrl) {
    updateMeta('property', 'og:image', imageUrl);
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:image', imageUrl);
  } else {
    updateMeta('name', 'twitter:card', 'summary');
  }
  updateMeta('name', 'twitter:title', title);
  updateMeta('name', 'twitter:description', description);
  updateCanonical(canonicalUrl);
}

export function clearPageMetadata() {
  document.title = 'Adventures For the Cure';
  document.head.querySelectorAll('[data-route-meta="true"]').forEach((element) => element.remove());
}

export { siteSeo };
