import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteConfig } from '../config/site';
import { useCart } from '../lib/cart';
import { computeTotals, formatPrice } from '../lib/catalog';
import QuantityStepper from './QuantityStepper';

export default function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, setQty, remove } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const totals = computeTotals(subtotal);

  useEffect(() => {
    closeCart();
  }, [location.pathname, closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="drawer-wrap">
      <div className="drawer-backdrop" onClick={closeCart} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="drawer__head">
          <h2 id="cart-title">Your cart</h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Your cart is empty.</p>
            <Link to="/products" className="btn btn--primary">
              Explore products
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {lines.map((l) => (
                <li key={l.key} className="cline">
                  <div className="cline__info">
                    <p className="cline__name">{l.product.name}</p>
                    <p className="cline__meta">
                      {l.option.label ? `${l.option.label} · ` : ''}
                      {formatPrice(l.option.price)} each
                    </p>
                    <button type="button" className="linkish" onClick={() => remove(l.key)}>
                      Remove
                    </button>
                  </div>
                  <div className="cline__side">
                    <QuantityStepper value={l.qty} onChange={(n) => setQty(l.key, n)} label={l.product.name} />
                    <p className="cline__total">{formatPrice(l.lineTotal)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="drawer__foot">
              <dl className="sum">
                <div>
                  <dt>Items total</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd>
                    {totals.shipping === null ? 'Confirmed on WhatsApp' : totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                  </dd>
                </div>
              </dl>
              {totals.belowMinimum && totals.minimumOrder !== null && (
                <p className="notice notice--warn">
                  Minimum order is {siteConfig.ordering.currencySymbol}
                  {totals.minimumOrder}. Add {formatPrice(totals.minimumOrder - totals.subtotal)} more to continue.
                </p>
              )}
              <Link
                to="/checkout"
                className={`btn btn--primary btn--block ${totals.belowMinimum ? 'btn--disabled' : ''}`}
                aria-disabled={totals.belowMinimum}
                onClick={(e) => totals.belowMinimum && e.preventDefault()}
              >
                Continue to checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
