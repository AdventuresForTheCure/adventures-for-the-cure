import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getHtml, getJson } from '../api.js';
import { applyCustomMetadata, clearPageMetadata, siteSeo } from '../pageMetadata.js';

function getCampaignSlug(campaign) {
  if (campaign.slug) return campaign.slug;
  return campaign.name
    .replace(/^\d{4}-\d{2}(?:-\d{2})?\s+/, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'campaign';
}

function getCampaignTitle(campaign) {
  return campaign.title || campaign.name.replace(/^\d{4}-\d{2}(?:-\d{2})?\s+/, '').trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureCampaignHeading(html, title) {
  let headingCount = 0;
  const normalized = html.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (heading, attributes, content) => {
    headingCount += 1;
    if (headingCount === 1) return `<h1${attributes}>${content}</h1>`;
    return `<h2${attributes}>${content}</h2>`;
  });

  return headingCount ? normalized : `<h1>${escapeHtml(title)}</h1>${normalized}`;
}

function getCampaignPreview(campaignHtml, campaignTitle) {
  if (!campaignHtml) {
    return {
      description: `Explore the ${campaignTitle} campaign from Adventures For the Cure.`,
      image: `${siteSeo.siteUrl}${siteSeo.organization.logo}`
    };
  }

  const content = document.createElement('div');
  content.innerHTML = campaignHtml;
  content.querySelectorAll('script, style').forEach((element) => element.remove());
  const description = (content.textContent || '').replace(/\s+/g, ' ').trim();
  const imageSource = content.querySelector('img')?.getAttribute('src');
  let image = `${siteSeo.siteUrl}${siteSeo.organization.logo}`;
  if (imageSource && !/^(data:|javascript:)/i.test(imageSource)) {
    try {
      image = new URL(imageSource, window.location.href).href;
    } catch {
      image = `${siteSeo.siteUrl}${siteSeo.organization.logo}`;
    }
  }

  return {
    description: description
      ? description.length > 160 ? `${description.slice(0, 157).replace(/\s+\S*$/, '')}...` : description
      : `Explore the ${campaignTitle} campaign from Adventures For the Cure.`,
    image
  };
}

export default function Campaigns({ initialData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const initialCampaign = initialData?.selectedCampaign || null;
  const initialContentName = useRef(initialCampaign?.name || '');
  const [campaigns, setCampaigns] = useState(initialData?.campaigns || []);
  const [selected, setSelected] = useState(initialCampaign?.name || '');
  const [campaignHtml, setCampaignHtml] = useState(initialData?.campaignHtml || '');
  const [error, setError] = useState('');
  const [campaignListOpen, setCampaignListOpen] = useState(false);

  useEffect(() => {
    if (initialData?.campaigns?.length) return;
    getJson('/api/campaigns')
      .then((items) => {
        const sorted = items.slice().sort((a, b) => b.name.localeCompare(a.name));
        setCampaigns(sorted);
      })
      .catch((requestError) => setError(requestError.message));
  }, [initialData]);

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
      if (campaign) {
        navigate(`/campaigns/${getCampaignSlug(campaign)}${location.search}`, {replace: true});
      }
    }

    if (!slug && !location.hash) {
      campaign = campaigns[0] || null;
      if (!campaign) {
        setSelected('');
        setCampaignHtml('');
        setError('');
        return;
      }
      navigate(`/campaigns/${getCampaignSlug(campaign)}${location.search}`, {replace: true});
    }

    if (!campaign) {
      setSelected('');
      setCampaignHtml('');
      setError('Campaign not found.');
      return;
    }

    setError('');
    setSelected(campaign.name);
    const campaignPath = `/campaigns/${getCampaignSlug(campaign)}`;
    if (slug && location.pathname !== campaignPath) {
      navigate({pathname: campaignPath, search: location.search}, {replace: true});
    }
  }, [campaigns, location.hash, location.pathname, location.search, navigate, slug]);

  useEffect(() => {
    setCampaignListOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!selected) return undefined;
    if (initialContentName.current === selected) {
      initialContentName.current = '';
      return undefined;
    }

    let active = true;
    setCampaignHtml('');
    getHtml(`/api/campaigns/${encodeURIComponent(selected)}`)
      .then((html) => { if (active) setCampaignHtml(html); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, [selected]);

  const renderedCampaignHtml = selected
    ? ensureCampaignHeading(campaignHtml, campaigns.find((campaign) => campaign.name === selected)?.title || selected)
    : '';

  useEffect(() => {
    if (!renderedCampaignHtml.includes('strava-embed-placeholder')) return undefined;

    const routeSection = document.querySelector('.campaign-ptap2026__route');
    if (!routeSection) return undefined;

    const embedScript = document.createElement('script');
    embedScript.src = 'https://strava-embeds.com/embed.js';
    embedScript.async = true;
    routeSection.appendChild(embedScript);

    return () => embedScript.remove();
  }, [renderedCampaignHtml]);

  const selectedCampaign = campaigns.find((campaign) => campaign.name === selected);

  useEffect(() => {
    if (!selectedCampaign) return undefined;

    const title = `${getCampaignTitle(selectedCampaign)} | Adventures For the Cure`;
    const canonicalUrl = new URL(`/campaigns/${getCampaignSlug(selectedCampaign)}`, siteSeo.siteUrl).href;
    const preview = getCampaignPreview(renderedCampaignHtml, getCampaignTitle(selectedCampaign));
    applyCustomMetadata({title, description: preview.description, canonicalUrl, imageUrl: preview.image});
    return clearPageMetadata;
  }, [renderedCampaignHtml, selectedCampaign]);

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
              <span className="campaign-list__hamburger" aria-hidden="true"><span /><span /><span /></span>
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
        {selected
          ? renderedCampaignHtml
            ? <div className="well legacy-content" dangerouslySetInnerHTML={{ __html: renderedCampaignHtml }} />
            : <div className="well" aria-busy="true">{error ? 'Campaign unavailable.' : 'Loading campaign…'}</div>
          : <div className="well campaign-archive-intro">
              <h1>Charity Fundraising Campaigns</h1>
              <p>Adventures For the Cure turns cycling and other adventures into opportunities to raise money and awareness for charitable causes. Browse current and past campaigns, or email us to learn how to start a campaign of your own.</p>
              <p>Our campaigns have supported children with diabetes through Camp Nejeda and children with disabilities in Kenya through Kupenda for the Children.</p>
            </div>}
      </section>
    </div>
  );
}
