import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';
import { useCart } from '../lib/cart';
import { computeTotals, formatPrice } from '../lib/catalog';
import { usePageMeta } from '../lib/meta';
import { buildOrderLink, canDraft, whatsappReady, type Customer } from '../lib/whatsapp';

type Errors = Partial<Record<keyof Customer, string>>;

function validate(c: Customer): Errors {
  const e: Errors = {};
  if (c.name.trim().length < 2) e.name = 'Enter your name.';
  if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(c.phone.replace(/\s|-/g, '').replace(/^(\+?91)/, '$1'))) {
    e.phone = 'Enter a 10-digit mobile number.';
  }
  if (c.address.trim().length < 10) e.address = 'Enter your full delivery address.';
  if (!/^\d{6}$/.test(c.pin.trim())) e.pin = 'Enter a 6-digit PIN code.';
  return e;
}

export default function Checkout() {
  usePageMeta('Checkout');
  const { lines, subtotal, clear, setQty, remove } = useCart();
  const [c, setC] = useState<Customer>({ name: '', phone: '', address: '', pin: '', notes: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ href: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const totals = computeTotals(subtotal);
  const ready = canDraft();

  const set = (k: keyof Customer) => (e: { target: { value: string } }) => setC((p) => ({ ...p, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(c);
    setErrors(errs);
    if (Object.keys(errs).length > 0 || totals.belowMinimum || !ready || lines.length === 0) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    const result = buildOrderLink(lines, c);
    setSent(result);
    window.open(result.href, '_blank', 'noopener,noreferrer');
  }

  async function copy() {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent.message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container page page--narrow">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/products" className="btn btn--primary">
          Explore products
        </Link>
      </div>
    );
  }

  const field = (k: keyof Customer, label: string, props: Record<string, string | number | boolean> = {}) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      <input
        id={`f-${k}`}
        value={c[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
        {...props}
      />
      {errors[k] && (
        <p className="field__error" id={`e-${k}`}>
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <div className="container page">
      <h1>Checkout</h1>
      <div className="checkout">
        <form className="checkout__form" onSubmit={submit} noValidate>
          <h2>Delivery details</h2>
          {field('name', 'Full name', { autoComplete: 'name' })}
          {field('phone', 'Mobile number', { autoComplete: 'tel', inputMode: 'tel' })}
          <div className="field">
            <label htmlFor="f-address">Delivery address</label>
            <textarea
              id="f-address"
              rows={3}
              value={c.address}
              onChange={set('address')}
              autoComplete="street-address"
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'e-address' : undefined}
            />
            {errors.address && (
              <p className="field__error" id="e-address">
                {errors.address}
              </p>
            )}
          </div>
          {field('pin', 'PIN code', { autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 6 })}
          <div className="field">
            <label htmlFor="f-notes">Notes (optional)</label>
            <textarea id="f-notes" rows={2} value={c.notes} onChange={set('notes')} maxLength={300} />
          </div>

          {!whatsappReady() && (
            <p className="notice notice--warn">
              {ready
                ? 'Preview: no WhatsApp number is set yet, so WhatsApp will ask you to choose a contact. Add the number in src/config/site.ts (contact, whatsappNumber).'
                : 'Online ordering is not available right now. Please use the Contact page.'}
            </p>
          )}
          {totals.belowMinimum && totals.minimumOrder !== null && (
            <p className="notice notice--warn">
              Minimum order is {formatPrice(totals.minimumOrder)}. Add {formatPrice(totals.minimumOrder - totals.subtotal)} more.
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--block" disabled={!ready || totals.belowMinimum}>
            Send order on WhatsApp
          </button>
          <p className="fine">
            This opens WhatsApp with your order written out. Your order is placed only when you send that message.{' '}
            {siteConfig.ordering.paymentNote || 'Payment options will be confirmed with you on WhatsApp.'}
          </p>

          {sent && (
            <div className="notice notice--ok" role="status">
              <p>WhatsApp should have opened with your order. If it did not, use one of these:</p>
              <p className="notice__actions">
                <a href={sent.href} target="_blank" rel="noopener noreferrer">
                  Open WhatsApp again
                </a>
                <button type="button" className="linkish" onClick={copy}>
                  {copied ? 'Copied' : 'Copy order message'}
                </button>
                <button type="button" className="linkish" onClick={clear}>
                  Clear cart
                </button>
              </p>
            </div>
          )}
        </form>

        <aside className="checkout__summary" aria-labelledby="sum-title">
          <h2 id="sum-title">Your order</h2>
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
                  <div className="stepper" role="group" aria-label={`Quantity: ${l.product.name}`}>
                    <button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label={`Decrease ${l.product.name}`}>
                      −
                    </button>
                    <output>{l.qty}</output>
                    <button
                      type="button"
                      onClick={() => setQty(l.key, l.qty + 1)}
                      disabled={l.qty >= siteConfig.ordering.maxQuantityPerLine}
                      aria-label={`Increase ${l.product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <p className="cline__total">{formatPrice(l.lineTotal)}</p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="sum">
            <div>
              <dt>Items total</dt>
              <dd>{formatPrice(totals.subtotal)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{totals.shipping === null ? 'Confirmed on WhatsApp' : totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd>
            </div>
            <div className="sum__total">
              <dt>{totals.isFinal ? 'Total' : 'Total before delivery'}</dt>
              <dd>{formatPrice(totals.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
