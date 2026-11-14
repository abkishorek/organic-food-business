import { siteConfig } from '../config/site';
import { formatPrice } from './catalog';
import type { OrderOption, Product } from '../types';

export const whatsappReady = (number: string): boolean => /^\d{8,15}$/.test(number);

export const canDraft = (number: string): boolean => whatsappReady(number) || siteConfig.showPreviewNotice;

export function whatsappLink(text: string, number: string): string {
  const target = whatsappReady(number) ? number : '';
  return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
}

export function enquiryHref(number: string, text = `Hello ${siteConfig.brand.nameEnglish}, I would like to place an order.`): string {
  return canDraft(number) ? whatsappLink(text, number) : '/contact';
}

export function buildBuyMessage(product: Product, option?: OrderOption): string {
  const brand = siteConfig.brand.nameEnglish;
  if (!option) {
    return `Hello ${brand}, I would like to buy ${product.name}. Please share the available sizes, price and delivery details.`;
  }
  const label = option.label ? ` (${option.label})` : '';
  return [
    `Hello ${brand}, I would like to buy:`,
    `${product.name}${label} = ${formatPrice(option.price)}`,
    'Please confirm availability and delivery details.',
  ].join('\n');
}
