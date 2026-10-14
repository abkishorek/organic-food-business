import { siteConfig } from '../config/site';
import { products } from '../data/products';
import { isOrderable } from '../lib/catalog';
import { whatsappReady } from '../lib/whatsapp';

/** Development helper. Lists what's still missing. Hidden when showPreviewNotice is false. */
export default function PreviewNotice() {
  if (!siteConfig.showPreviewNotice) return null;
  const missing: string[] = [];
  if (!whatsappReady()) missing.push('WhatsApp number');
  if (!siteConfig.logo) missing.push('logo');
  if (!siteConfig.heroImage) missing.push('hero photograph (optional, the logo is shown for now)');
  const noPhoto = products.filter((p) => !p.image).length;
  if (noPhoto) missing.push(`${noPhoto} product photo${noPhoto > 1 ? 's' : ''}`);
  const noOrder = products.filter((p) => !isOrderable(p)).length;
  if (noOrder) missing.push(`prices for ${noOrder} product${noOrder > 1 ? 's' : ''}`);
  if (!siteConfig.legal.fssai) missing.push('FSSAI number');
  if (siteConfig.policies.shipping.length === 0 || siteConfig.policies.returns.length === 0) missing.push('shipping and returns text');
  if (missing.length === 0) return null;
  return (
    <div className="preview-notice" role="note">
      <strong>Preview build.</strong> Still to add: {missing.join(', ')}. Set <code>showPreviewNotice</code> to false in
      src/config/site.ts before launch.
    </div>
  );
}
