import { useEffect } from 'react';
import { siteConfig } from '../config/site';

/** Loads Plausible (cookie-free analytics) only if a domain is set in site.ts. */
export default function Analytics() {
  useEffect(() => {
    const domain = siteConfig.analytics.plausibleDomain;
    if (!domain || document.querySelector('script[data-plausible]')) return;
    const s = document.createElement('script');
    s.defer = true;
    s.src = 'https://plausible.io/js/script.js';
    s.setAttribute('data-domain', domain);
    s.setAttribute('data-plausible', '1');
    document.head.appendChild(s);
  }, []);
  return null;
}
