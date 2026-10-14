import { siteConfig } from '../config/site';
import type { CartLine } from './cart';
import { computeTotals, formatPrice } from './catalog';
import type { OrderOption, Product } from '../types';

export interface Customer {
  name: string;
  phone: string;
  address: string;
  pin: string;
  notes: string;
}

export const whatsappReady = (): boolean => /^\d{8,15}$/.test(siteConfig.contact.whatsappNumber);

/**
 * WhatsApp buttons work when a number is set. While showPreviewNotice is true they also work
 * without one (WhatsApp then asks you to pick a contact), so the owner can test the drafts.
 * Once the site is live (showPreviewNotice false) a missing number sends people to the Contact page instead.
 */
export const canDraft = (): boolean => whatsappReady() || siteConfig.showPreviewNotice;

export function whatsappLink(text: string): string {
  const target = whatsappReady() ? siteConfig.contact.whatsappNumber : '';
  return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
}

/** A WhatsApp link with a ready-written message. Falls back to the contact page if not allowed. */
export function enquiryHref(text = `Hello ${siteConfig.brand.nameEnglish}, I would like to place an order.`): string {
  return canDraft() ? whatsappLink(text) : '/contact';
}

/** The message drafted by a product's "Buy on WhatsApp" button. */
export function buildBuyMessage(product: Product, option?: OrderOption, qty = 1): string {
  const brand = siteConfig.brand.nameEnglish;
  if (!option) {
    return `Hello ${brand}, I would like to buy ${product.name}. Please share the available sizes, price and delivery details.`;
  }
  const label = option.label ? ` (${option.label})` : '';
  return [
    `Hello ${brand}, I would like to buy:`,
    `${product.name}${label} x ${qty} = ${formatPrice(option.price * qty)}`,
    'Please confirm availability and delivery details.',
  ].join('\n');
}

const lineText = (l: CartLine, i: number): string =>
  `${i + 1}. ${l.product.name}${l.option.label ? ` (${l.option.label})` : ''} x ${l.qty} = ${formatPrice(l.lineTotal)}`;

export function buildOrderMessage(lines: CartLine[], c: Customer, compact = false): string {
  const t = computeTotals(lines.reduce((s, l) => s + l.lineTotal, 0));
  const out: string[] = [];
  out.push(`*New order: ${siteConfig.brand.nameEnglish}*`, '');
  out.push(`Name: ${c.name.trim()}`, `Phone: ${c.phone.trim()}`, `Address: ${c.address.trim()}`, `PIN code: ${c.pin.trim()}`, '');
  out.push('*Items*');
  out.push(...lines.map(lineText));
  out.push('');
  out.push(`Items total: ${formatPrice(t.subtotal)}`);
  if (t.shipping === null) out.push('Delivery charge: to be confirmed');
  else out.push(`Delivery: ${t.shipping === 0 ? 'Free' : formatPrice(t.shipping)}`);
  out.push(`${t.isFinal ? 'Total' : 'Total (before delivery)'}: ${formatPrice(t.total)}`);
  if (!compact && c.notes.trim()) out.push('', `Notes: ${c.notes.trim().slice(0, 300)}`);
  return out.join('\n');
}

/** Builds the final wa.me link, keeping the message a safe length for all devices. */
export function buildOrderLink(lines: CartLine[], c: Customer): { href: string; message: string } {
  let message = buildOrderMessage(lines, c);
  if (encodeURIComponent(message).length > 3500) message = buildOrderMessage(lines, c, true);
  return { href: whatsappLink(message), message };
}
