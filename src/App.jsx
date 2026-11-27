import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Campaigns from './pages/Campaigns.jsx';
import LegacyContent from './LegacyContent.jsx';
import homeHtml from '../public/app/views/home/home.html?raw';
import eventsHtml from '../public/app/views/events/events.html?raw';
import ridesHtml from '../public/app/views/rides/rides.html?raw';
import contactHtml from '../public/app/views/contact/contact.html?raw';
import joinHtml from '../public/app/views/join/join.html?raw';
import sponsorsHtml from '../public/app/views/sponsors/sponsors.html?raw';
import footerHtml from '../public/app/views/footer/footer.html?raw';
import invalidHtml from '../public/app/views/invalidPage/invalidPage.html?raw';
import { applyPageMetadata, clearPageMetadata, siteSeo } from './pageMetadata.js';

const links = [
  ['Home', '/'], ['Join', '/join'], ['Events', '/events'],
  ['Rides', '/rides'], ['Campaigns', '/campaigns'], ['Contact', '/contact']
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark afc-navbar fixed-top" aria-label="Main navigation">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/home" aria-label="Adventures For the Cure home">
          <img src="/img/afc.jpg" alt="Adventures For the Cure" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="afc-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse${isOpen ? ' show' : ''}`} id="afc-navigation">
          <ul className="navbar-nav me-auto">
            {links.map(([label, to]) => (
              <li className="nav-item" key={to}>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to={to}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Sponsors() {
  return <aside className="col-lg-3"><div dangerouslySetInnerHTML={{ __html: sponsorsHtml }} /></aside>;
}

function RouteMetadata() {
  const location = useLocation();

  useEffect(() => {
    if (!siteSeo.pages[location.pathname]) return undefined;
    applyPageMetadata(location.pathname);
    return clearPageMetadata;
  }, [location.pathname]);

  return null;
}

function PageLayout({ initialData }) {
  return (
    <>
      <RouteMetadata />
      <Navigation />
      <main className="container-fluid afc-page">
        <div className="row">
          <section className="col-lg-9 afc-main-content">
            <Routes>
              <Route path="/" element={<LegacyContent html={homeHtml} />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/home" element={<LegacyContent html={homeHtml} />} />
              <Route path="/events" element={<LegacyContent html={eventsHtml} />} />
              <Route path="/rides" element={<LegacyContent html={ridesHtml} />} />
              <Route path="/join" element={<LegacyContent html={joinHtml} />} />
              <Route path="/contact" element={<LegacyContent html={contactHtml} />} />
              <Route path="/campaigns" element={<Campaigns initialData={initialData} />} />
              <Route path="/campaigns/:slug" element={<Campaigns initialData={initialData} />} />
              <Route path="*" element={<LegacyContent html={invalidHtml} />} />
            </Routes>
          </section>
          <Sponsors />
        </div>
      </main>
      <footer className="container text-center afc-footer" dangerouslySetInnerHTML={{ __html: footerHtml }} />
      <ToastContainer position="top-right" autoClose={3500} />
    </>
  );
}

export default function App({ initialData }) {
  return <PageLayout initialData={initialData} />;
}
