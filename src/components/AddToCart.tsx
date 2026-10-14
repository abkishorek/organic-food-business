import { useState } from 'react';
import { useCart } from '../lib/cart';
import { formatPrice, getOrderOptions } from '../lib/catalog';
import { buildBuyMessage, enquiryHref } from '../lib/whatsapp';
import type { Product } from '../types';
import WhatsAppLink from './WhatsAppLink';

/**
 * Ordering controls for one product.
 * - "Buy on WhatsApp" is always there. It opens WhatsApp with the message already written.
 * - "Add to cart" appears only once the product has a real price and is set to 'available'.
 */
export default function AddToCart({ product, showQty = false }: { product: Product; showQty?: boolean }) {
  const { add } = useCart();
  const options = getOrderOptions(product);
  const [packId, setPackId] = useState(options[0]?.packId ?? '');
  const [qty, setQty] = useState(1);
  const selected = options.find((o) => o.packId === packId) ?? options[0];

  if (!selected) {
    const soldOut = product.availability === 'out-of-stock';
    return (
      <div className="order order--closed">
        {soldOut && <p className="order__note">Currently unavailable</p>}
        <WhatsAppLink
          className={`btn btn--block ${soldOut ? 'btn--quiet' : 'btn--primary'}`}
          href={enquiryHref(
            soldOut
              ? `Hello Siri Vaividya, is ${product.name} available again?`
              : buildBuyMessage(product),
          )}
        >
          {soldOut ? 'Ask on WhatsApp' : 'Buy on WhatsApp'}
        </WhatsAppLink>
      </div>
    );
  }

  const selectId = `pack-${product.id}${showQty ? '-d' : ''}`;
  return (
    <div className="order">
      {options.length > 1 && (
        <div className="field field--inline">
          <label htmlFor={selectId}>Size</label>
          <select id={selectId} value={selected.packId} onChange={(e) => setPackId(e.target.value)}>
            {options.map((o) => (
              <option key={o.packId} value={o.packId}>
                {o.label}: {formatPrice(o.price)}
              </option>
            ))}
          </select>
        </div>
      )}
      <p className="order__price">
        {formatPrice(selected.price)}
        {options.length === 1 && selected.label && <span className="order__pack"> / {selected.label}</span>}
      </p>
      <div className="order__row">
        {showQty && (
          <div className="stepper" role="group" aria-label={`Quantity: ${product.name}`}>
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
              −
            </button>
            <output aria-live="polite">{qty}</output>
            <button type="button" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
              +
            </button>
          </div>
        )}
        <button type="button" className="btn btn--outline" onClick={() => add(product.id, selected.packId, qty)}>
          Add to cart
        </button>
      </div>
      <WhatsAppLink className="btn btn--primary btn--block" href={enquiryHref(buildBuyMessage(product, selected, qty))}>
        Buy on WhatsApp
      </WhatsAppLink>
    </div>
  );
}
