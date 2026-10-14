import { useState } from 'react';
import { siteConfig } from '../config/site';
import type { Product } from '../types';

/**
 * One consistent frame (4:5) for every product photograph.
 * Photos are never stretched. Missing photos show a neutral placeholder, never a stock image.
 */
export default function ProductImage({ product, eager = false }: { product: Product; eager?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = product.image;

  if (src && failedSrc !== src) {
    return (
      <div className="pimg">
        <img
          src={src}
          alt={product.imageAlt ?? product.name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectFit: product.imageFit ?? 'cover', objectPosition: product.imagePosition ?? 'center' }}
          onError={() => setFailedSrc(src)}
        />
      </div>
    );
  }

  return (
    <div className="pimg pimg--empty" role="img" aria-label={`${product.name}: photograph to be added`}>
      <span className="pimg__name">{product.name}</span>
      {product.kannadaName && (
        <span className="pimg__kn" lang="kn">
          {product.kannadaName}
        </span>
      )}
      {siteConfig.showPreviewNotice && <span className="pimg__note">Photo to be added</span>}
    </div>
  );
}
