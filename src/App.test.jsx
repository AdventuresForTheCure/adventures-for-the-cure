import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('site routes', () => {
  it('renders the legacy home content in the React application shell', () => {
    render(<MemoryRouter initialEntries={['/home']}><App /></MemoryRouter>);

    expect(screen.getByRole('navigation', {name: 'Main navigation'})).toBeTruthy();
    expect(screen.getByText(/Becoming A Member/i)).toBeTruthy();
  });

  it('shows a useful fallback for unsupported routes', () => {
    render(<MemoryRouter initialEntries={['/missing-page']}><App /></MemoryRouter>);

    expect(screen.getByText(/You requested an invalid page/i)).toBeTruthy();
  });

  it('shows only the six public pages in the top level navigation', () => {
    render(<MemoryRouter initialEntries={['/home']}><App /></MemoryRouter>);

    const navigation = screen.getByRole('navigation', {name: 'Main navigation'});
    expect(Array.from(navigation.querySelectorAll('a.nav-link'), (link) => link.textContent)).toEqual([
      'Home', 'Join', 'Events', 'Rides', 'Campaigns', 'Contact'
    ]);
  });

  it('opens the mobile navigation and closes it after choosing a page', () => {
    render(<MemoryRouter initialEntries={['/home']}><App /></MemoryRouter>);

    const menuButton = screen.getByRole('button', {name: 'Open navigation menu'});
    const menu = screen.getByRole('navigation', {name: 'Main navigation'}).querySelector('#afc-navigation');

    expect(menu.classList.contains('show')).toBe(false);
    fireEvent.click(menuButton);
    expect(menu.classList.contains('show')).toBe(true);
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(screen.getByRole('link', {name: 'Events'}));
    expect(menu.classList.contains('show')).toBe(false);
    expect(screen.getByRole('heading', {name: 'AFC Events'})).toBeTruthy();
  });

  it('toggles the campaign list on small screens and closes it after selecting a campaign', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url) => ({
      ok: true,
      json: async () => [{name: '2026 Campaign'}, {name: '2025 Campaign'}],
      text: async () => `<article>${url}</article>`
    })));
    render(<MemoryRouter initialEntries={['/campaigns']}><App /></MemoryRouter>);

    const toggle = screen.getByRole('button', {name: 'Show campaign list'});
    const list = document.getElementById('afc-campaign-list');
    fireEvent.click(toggle);
    expect(list.classList.contains('is-open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    const campaignButton = await screen.findByRole('button', {name: '2026 Campaign'});
    fireEvent.click(campaignButton);
    await waitFor(() => expect(list.classList.contains('is-open')).toBe(false));
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('shows the fallback for retired top level pages', () => {
    for (const route of ['/donate', '/results', '/sponsor-logos', '/members', '/inventory']) {
      const {unmount} = render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>);
      expect(screen.getByText(/You requested an invalid page/i)).toBeTruthy();
      unmount();
    }
  });

  it('shows only the WsW ride on the rides page', () => {
    render(<MemoryRouter initialEntries={['/rides']}><App /></MemoryRouter>);

    expect(screen.getByRole('heading', {name: 'Westside Worlds (WsW)'})).toBeTruthy();
    expect(screen.queryByRole('heading', {name: 'The ROOST'})).toBeNull();
    expect(screen.queryByRole('heading', {name: '8am Saturday Hub Ride'})).toBeNull();
    expect(screen.queryByRole('heading', {name: '10am Saturday Hub Ride'})).toBeNull();
  });
});
