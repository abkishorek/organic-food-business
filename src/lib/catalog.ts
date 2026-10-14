import { siteConfig } from '../config/site';
import { products } from '../data/products';
import type { OrderOption, Product } from '../types';

const isPrice = (n: number | null | undefined): n is number =>
  typeof n === 'number' && Number.isFinite(n) && n > 0;

export function formatPrice(n: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
  return `${siteConfig.ordering.currencySymbol}${formatted}`;
}

export function getProduct(id: string | undefined): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Every price that has been properly configured for this product. */
function configuredPrices(p: Product): number[] {
  if (p.packSizes.length > 0) {
    return p.packSizes.filter((s) => s.available !== false && isPrice(s.price)).map((s) => s.price as number);
  }
  return isPrice(p.price) ? [p.price] : [];
}

/** The ways a customer can actually order this product. Empty = cannot be ordered. */
export function getOrderOptions(p: Product): OrderOption[] {
  if (p.availability !== 'available') return [];
  if (p.packSizes.length > 0) {
    return p.packSizes
      .filter((s) => s.available !== false && isPrice(s.price))
      .map((s) => ({ packId: s.id, label: s.label, price: s.price as number }));
  }
  return isPrice(p.price) ? [{ packId: 'default', label: '', price: p.price }] : [];
}

export function isOrderable(p: Product): boolean {
  return getOrderOptions(p).length > 0;
}

/** Text for the price line on a card. Returns null when the price should be hidden. */
export function priceLabel(p: Product): string | null {
  const prices = configuredPrices(p);
  if (prices.length === 0) {
    return siteConfig.ordering.showPricePlaceholder ? 'Price to be updated' : null;
  }
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatPrice(min) : `From ${formatPrice(min)}`;
}

export function availabilityNote(p: Product): string | null {
  if (p.availability === 'out-of-stock') return 'Currently unavailable';
  return null;
}

export interface Totals {
  subtotal: number;
  /** null = delivery charge not yet confirmed */
  shipping: number | null;
  total: number;
  isFinal: boolean;
  belowMinimum: boolean;
  minimumOrder: number | null;
}

export function computeTotals(subtotal: number): Totals {
  const { shippingCharge, freeShippingAbove, minimumOrder } = siteConfig.ordering;
  let shipping: number | null = null;
  if (shippingCharge !== null) {
    shipping = freeShippingAbove !== null && subtotal >= freeShippingAbove ? 0 : shippingCharge;
  }
  return {
    subtotal,
    shipping,
    total: subtotal + (shipping ?? 0),
    isFinal: shipping !== null,
    belowMinimum: minimumOrder !== null && subtotal < minimumOrder,
    minimumOrder,
  };
}
