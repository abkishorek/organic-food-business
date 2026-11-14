import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Analytics from './Analytics';
import Footer from './Footer';
import Header from './Header';
import { useSiteData } from '../lib/site-data';

export default function Layout() {
  const { pathname, hash } = useLocation();
  const { loadError } = useSiteData();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {loadError && <p className="notice notice--warn" role="alert">{loadError} Showing the saved catalogue instead.</p>}
        <Outlet />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
