import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { siteConfig } from '../config/site';
import { getOrderOptions, getProduct } from './catalog';
import type { OrderOption, Product } from '../types';

interface StoredLine {
  productId: string;
  packId: string;
  qty: number;
}

export interface CartLine {
  key: string;
  product: Product;
  option: OrderOption;
  qty: number;
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (productId: string, packId: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'siri-vaividya-cart-v1';
const CartContext = createContext<CartContextValue | null>(null);
const lineKey = (productId: string, packId: string) => `${productId}::${packId}`;

function load(): StoredLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is StoredLine =>
        !!l && typeof l.productId === 'string' && typeof l.packId === 'string' && Number.isInteger(l.qty) && l.qty > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredLine[]>(load);
  const [isOpen, setOpen] = useState(false);
  const max = siteConfig.ordering.maxQuantityPerLine;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* storage unavailable (private mode): cart still works for this visit */
    }
  }, [stored]);

  // Prices are always read from the product file, never stored, so price changes apply automatically.
  // Lines whose product or pack no longer exists, or can't be ordered, are dropped.
  const lines = useMemo<CartLine[]>(() => {
    const out: CartLine[] = [];
    for (const s of stored) {
      const product = getProduct(s.productId);
      if (!product) continue;
      const option = getOrderOptions(product).find((o) => o.packId === s.packId);
      if (!option) continue;
      const qty = Math.min(s.qty, max);
      out.push({ key: lineKey(s.productId, s.packId), product, option, qty, lineTotal: option.price * qty });
    }
    return out;
  }, [stored, max]);

  const add = useCallback(
    (productId: string, packId: string, qty = 1) => {
      setStored((prev) => {
        const exists = prev.find((l) => l.productId === productId && l.packId === packId);
        if (exists) {
          return prev.map((l) => (l === exists ? { ...l, qty: Math.min(l.qty + qty, max) } : l));
        }
        return [...prev, { productId, packId, qty: Math.min(qty, max) }];
      });
      setOpen(true);
    },
    [max],
  );

  const setQty = useCallback(
    (key: string, qty: number) => {
      setStored((prev) =>
        prev
          .map((l) => (lineKey(l.productId, l.packId) === key ? { ...l, qty: Math.min(qty, max) } : l))
          .filter((l) => l.qty > 0),
      );
    },
    [max],
  );

  const remove = useCallback((key: string) => {
    setStored((prev) => prev.filter((l) => lineKey(l.productId, l.packId) !== key));
  }, []);

  const clear = useCallback(() => setStored([]), []);
  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      isOpen,
      openCart,
      closeCart,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, isOpen, openCart, closeCart, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
