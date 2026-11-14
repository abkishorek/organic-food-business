import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { siteConfig } from '../config/site';
import { products as defaultProducts } from '../data/products';
import type { CategoryId, Product } from '../types';
import { supabase, supabaseConfigError } from './supabase';

interface SiteContent {
  products: Product[];
  whatsappNumber: string;
}

interface SiteDataValue extends SiteContent {
  isLoading: boolean;
  loadError: string | null;
  refresh: () => Promise<void>;
  save: (content: SiteContent) => Promise<void>;
}

const categories: CategoryId[] = ['spices', 'oils', 'beverages', 'honey-nuts'];
const SiteDataContext = createContext<SiteDataValue | null>(null);

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.description === 'string' &&
    typeof p.category === 'string' &&
    categories.includes(p.category as CategoryId) &&
    (p.image === null || typeof p.image === 'string') &&
    (p.price === null || (typeof p.price === 'number' && Number.isFinite(p.price))) &&
    Array.isArray(p.packSizes) &&
    (p.availability === 'available' || p.availability === 'out-of-stock' || p.availability === 'to-be-confirmed')
  );
}

function readContent(row: { products: unknown; whatsapp_number: unknown }): SiteContent {
  if (!Array.isArray(row.products) || !row.products.every(isProduct)) {
    throw new Error('Stored product data is invalid. The catalogue could not be loaded.');
  }
  if (typeof row.whatsapp_number !== 'string') {
    throw new Error('Stored WhatsApp number is invalid.');
  }
  return { products: row.products, whatsappNumber: row.whatsapp_number };
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>({
    products: defaultProducts,
    whatsappNumber: siteConfig.contact.whatsappNumber,
  });
  const [isLoading, setLoading] = useState(Boolean(supabase));
  const [loadError, setLoadError] = useState(supabaseConfigError);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('products, whatsapp_number')
        .eq('id', 1)
        .maybeSingle();
      if (error) throw new Error(`Could not load storefront updates: ${error.message}`);
      if (data) {
        setContent(readContent(data));
      } else {
        setLoadError('No storefront settings have been saved yet. Sign in to Admin, enter the WhatsApp number, and choose Save all changes.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load storefront updates.';
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (next: SiteContent) => {
    if (!supabase) throw new Error(supabaseConfigError ?? 'Supabase is not configured.');
    const { error } = await supabase.from('site_content').upsert(
      { id: 1, products: next.products, whatsapp_number: next.whatsappNumber },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`Could not save storefront updates: ${error.message}`);
    setContent(next);
    setLoadError(null);
  }, []);

  const value = useMemo(
    () => ({ ...content, isLoading, loadError, refresh, save }),
    [content, isLoading, loadError, refresh, save],
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataValue {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error('useSiteData must be used inside SiteDataProvider');
  return context;
}
