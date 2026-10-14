import { useEffect } from 'react';
import { siteConfig } from '../config/site';

/** Sets the browser tab title and search description for the current page. */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    const brand = siteConfig.brand.nameEnglish;
    document.title = title ? `${title} | ${brand}` : `${brand} | ${siteConfig.brand.nameKannada}`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
