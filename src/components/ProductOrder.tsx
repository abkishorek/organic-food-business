import { useState } from 'react';
import { formatPrice, getOrderOptions } from '../lib/catalog';
import { useSiteData } from '../lib/site-data';
import { buildBuyMessage, enquiryHref } from '../lib/whatsapp';
import type { Product } from '../types';
import WhatsAppLink from './WhatsAppLink';

export default function ProductOrder({ product }: { product: Product }) {
  const { whatsappNumber } = useSiteData();
  const options = getOrderOptions(product);
  const [packId, setPackId] = useState(options[0]?.packId ?? '');
  const selected = options.find((option) => option.packId === packId) ?? options[0];

  if (!selected) {
    const soldOut = product.availability === 'out-of-stock';
    const message = soldOut
      ? `Hello Siri Vaividya, is ${product.name} available again?`
      : buildBuyMessage(product);
    return (
      <div className="order order--closed">
        {soldOut && <p className="order__note">Currently unavailable</p>}
        <WhatsAppLink className={`btn btn--block ${soldOut ? 'btn--quiet' : 'btn--primary'}`} href={enquiryHref(whatsappNumber, message)}>
          {soldOut ? 'Ask on WhatsApp' : 'Order Now'}
        </WhatsAppLink>
      </div>
    );
  }

  const selectId = `pack-${product.id}`;
  return (
    <div className="order">
      {options.length > 1 && (
        <div className="field field--inline">
          <label htmlFor={selectId}>Size</label>
          <select id={selectId} value={selected.packId} onChange={(event) => setPackId(event.target.value)}>
            {options.map((option) => (
              <option key={option.packId} value={option.packId}>
                {option.label}: {formatPrice(option.price)}
              </option>
            ))}
          </select>
        </div>
      )}
      <p className="order__price">
        {formatPrice(selected.price)}
        {options.length === 1 && selected.label && <span className="order__pack"> / {selected.label}</span>}
      </p>
      <WhatsAppLink
        className="btn btn--primary btn--block"
        href={enquiryHref(whatsappNumber, buildBuyMessage(product, selected))}
      >
        Order Now
      </WhatsAppLink>
    </div>
  );
}
