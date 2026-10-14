import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Analytics from './Analytics';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import Header from './Header';
import PreviewNotice from './PreviewNotice';

export default function Layout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <PreviewNotice />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Analytics />
    </>
  );
}
