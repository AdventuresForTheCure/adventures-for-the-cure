import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getHtml, getJson } from '../api.js';

export default function Campaigns() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialLocation = useRef(location);
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState('');
  const [campaignHtml, setCampaignHtml] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getJson('/api/campaigns')
      .then((items) => {
        const sorted = items.slice().sort((a, b) => b.name.localeCompare(a.name));
        setCampaigns(sorted);
        let hashName = '';
        try {
          hashName = decodeURIComponent(initialLocation.current.hash.slice(1));
        } catch {
          hashName = '';
        }
        const initial = sorted.some((item) => item.name === hashName) ? hashName : sorted[0]?.name;
        if (initial) {
          setSelected(initial);
          const initialHash = `#${encodeURIComponent(initial)}`;
          if (initialLocation.current.hash !== initialHash) {
            navigate({pathname: initialLocation.current.pathname, search: initialLocation.current.search, hash: initialHash}, {replace: true});
          }
        }
      })
      .catch((requestError) => setError(requestError.message));
  }, [navigate]);

  useEffect(() => {
    if (!campaigns.length) return;
    let hashName = '';
    try {
      hashName = decodeURIComponent(location.hash.slice(1));
    } catch {
      hashName = '';
    }
    const campaignFromHistory = campaigns.find((item) => item.name === hashName) || campaigns[0];
    if (campaignFromHistory && campaignFromHistory.name !== selected) {
      setSelected(campaignFromHistory.name);
    } else if (!hashName && campaigns[0] && campaigns[0].name !== selected) {
      setSelected(campaigns[0].name);
    }
  }, [campaigns, location.hash, selected]);

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

  return (
    <div className="row campaign-browser">
      <aside className="col-lg-4">
        <div className="well">
          <p>Email <a className="email" href="mailto:afc-board-of-directors@googlegroups.com">afc-board-of-directors@googlegroups.com</a> to learn how to start your own AFC campaign.</p>
        </div>
        <div className="well">
          <h2 className="h4">AFC Campaign List</h2>
          {error && <p role="alert" className="text-danger">Unable to load campaigns: {error}</p>}
          <ul className="campaign-list">
            {campaigns.map((campaign) => (
              <li key={campaign.name}>
                <button
                  type="button"
                  className={campaign.name === selected ? 'campaign-list__item is-active' : 'campaign-list__item'}
                  aria-current={campaign.name === selected ? 'true' : undefined}
                  onClick={() => {
                    setError('');
                    setSelected(campaign.name);
                    const hash = `#${encodeURIComponent(campaign.name)}`;
                    if (location.hash !== hash) {
                      navigate({pathname: location.pathname, search: location.search, hash});
                    }
                  }}
                >
                  {campaign.name}
                </button>
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
