import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getHtml, getJson } from '../api.js';

function getCampaignSlug(campaign) {
  if (campaign.slug) return campaign.slug;
  return campaign.name
    .replace(/^\d{4}(?:-\d{2}(?:-\d{2})?)?\s+/, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'campaign';
}

function getCampaignTitle(campaign) {
  return campaign.title || campaign.name.replace(/^\d{4}(?:-\d{2}(?:-\d{2})?)?\s+/, '').trim();
}

function updateMeta(attribute, key, value) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
  element.dataset.campaignMeta = 'true';
}

function updateCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
  element.dataset.campaignMeta = 'true';
}

function getCampaignPreview(campaignHtml, campaignTitle) {
  if (!campaignHtml) {
    return {description: `Explore the ${campaignTitle} campaign from Adventures For the Cure.`, image: ''};
  }

  const content = document.createElement('div');
  content.innerHTML = campaignHtml;
  content.querySelectorAll('script, style').forEach((element) => element.remove());
  const description = (content.textContent || '').replace(/\s+/g, ' ').trim();
  const imageSource = content.querySelector('img')?.getAttribute('src');
  let image = '';
  if (imageSource && !/^(data:|javascript:)/i.test(imageSource)) {
    try {
      image = new URL(imageSource, window.location.href).href;
    } catch {
      image = '';
    }
  }

  return {
    description: description
      ? description.length > 160 ? `${description.slice(0, 157).replace(/\s+\S*$/, '')}...` : description
      : `Explore the ${campaignTitle} campaign from Adventures For the Cure.`,
    image
  };
}

export default function Campaigns() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState('');
  const [campaignHtml, setCampaignHtml] = useState('');
  const [error, setError] = useState('');
  const [campaignListOpen, setCampaignListOpen] = useState(false);

  useEffect(() => {
    getJson('/api/campaigns')
      .then((items) => {
        const sorted = items.slice().sort((a, b) => b.name.localeCompare(a.name));
        setCampaigns(sorted);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  useEffect(() => {
    if (!campaigns.length) return;

    let campaign = slug ? campaigns.find((item) => getCampaignSlug(item) === slug) : null;
    if (!slug && location.hash) {
      let hashName = '';
      try {
        hashName = decodeURIComponent(location.hash.slice(1));
      } catch {
        hashName = '';
      }
      campaign = campaigns.find((item) => item.name === hashName);
    }
    if (!campaign && !slug) campaign = campaigns[0];

    if (!campaign) {
      setSelected('');
      setCampaignHtml('');
      setError('Campaign not found.');
      return;
    }

    setError('');
    setSelected(campaign.name);
    const campaignPath = `/campaigns/${getCampaignSlug(campaign)}`;
    if (location.pathname !== campaignPath || location.hash) {
      navigate({pathname: campaignPath, search: location.search}, {replace: true});
    }
  }, [campaigns, location.hash, location.pathname, location.search, navigate, slug]);

  useEffect(() => {
    setCampaignListOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    setCampaignHtml('');
    getHtml(`/api/campaigns/${encodeURIComponent(selected)}`)
      .then((html) => { if (active) setCampaignHtml(html); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, [selected]);

  useEffect(() => {
    if (!campaignHtml.includes('strava-embed-placeholder')) return;

    const routeSection = document.querySelector('.campaign-ptap2026__route');
    if (!routeSection) return;

    const embedScript = document.createElement('script');
    embedScript.src = 'https://strava-embeds.com/embed.js';
    embedScript.async = true;
    routeSection.appendChild(embedScript);

    return () => embedScript.remove();
  }, [campaignHtml]);

  const selectedCampaign = campaigns.find((campaign) => campaign.name === selected);

  useEffect(() => {
    if (!selectedCampaign) return undefined;

    const title = `${getCampaignTitle(selectedCampaign)} | Adventures For the Cure`;
    const path = `/campaigns/${getCampaignSlug(selectedCampaign)}`;
    const canonicalUrl = new URL(path, window.location.origin).href;
    const preview = getCampaignPreview(campaignHtml, getCampaignTitle(selectedCampaign));
    document.title = title;
    updateMeta('name', 'description', preview.description);
    updateMeta('property', 'og:type', 'website');
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', preview.description);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('name', 'twitter:card', preview.image ? 'summary_large_image' : 'summary');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', preview.description);
    if (preview.image) {
      updateMeta('property', 'og:image', preview.image);
      updateMeta('name', 'twitter:image', preview.image);
    }
    updateCanonical(canonicalUrl);

    return () => {
      document.title = 'Adventures For the Cure';
      document.head.querySelectorAll('[data-campaign-meta="true"]').forEach((element) => element.remove());
    };
  }, [campaignHtml, selectedCampaign]);

  return (
    <div className="row campaign-browser">
      <aside className="col-lg-4">
        <div className="well">
          <p>Email <a className="email" href="mailto:afc-board-of-directors@googlegroups.com">afc-board-of-directors@googlegroups.com</a> to learn how to start your own AFC campaign.</p>
        </div>
        <div className="well">
          <div className="campaign-list__header">
            <h2 className="h4" id="campaign-list-title">AFC Campaign List</h2>
            <button
              type="button"
              className="campaign-list__toggle"
              aria-label={campaignListOpen ? 'Hide campaign list' : 'Show campaign list'}
              aria-controls="afc-campaign-list"
              aria-expanded={campaignListOpen}
              onClick={() => setCampaignListOpen((open) => !open)}
            >
              <span className="campaign-list__hamburger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
          {error && <p role="alert" className="text-danger">{campaigns.length ? error : `Unable to load campaigns: ${error}`}</p>}
          <ul id="afc-campaign-list" className={`campaign-list${campaignListOpen ? ' is-open' : ''}`} aria-labelledby="campaign-list-title">
            {campaigns.map((campaign) => (
              <li key={campaign.name} className={campaign.name === selected ? 'is-active' : undefined}>
                <Link
                  to={`/campaigns/${getCampaignSlug(campaign)}`}
                  className={campaign.name === selected ? 'campaign-list__item is-active' : 'campaign-list__item'}
                  aria-current={campaign.name === selected ? 'true' : undefined}
                  onClick={() => {
                    setError('');
                    setCampaignListOpen(false);
                  }}
                >
                  {campaign.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <section className="col-lg-8" aria-live="polite">
        {campaignHtml
          ? <div className="well legacy-content" dangerouslySetInnerHTML={{ __html: campaignHtml }} />
          : <div className="well" aria-busy="true">{error ? 'Campaign unavailable.' : 'Loading campaign…'}</div>}
      </section>
    </div>
  );
}
