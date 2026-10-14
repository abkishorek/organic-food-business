import { Link } from 'react-router-dom';
import { getOrderOptions, priceLabel } from '../lib/catalog';
import type { Product } from '../types';
import AddToCart from './AddToCart';
import ProductImage from './ProductImage';

export default function ProductCard({ product }: { product: Product }) {
  const label = priceLabel(product);
  const orderable = getOrderOptions(product).length > 0;
  return (
    <article className="pcard">
      <Link to={`/products/${product.id}`} className="pcard__media" aria-label={`${product.name}, view details`}>
        <ProductImage product={product} />
      </Link>
      <div className="pcard__body">
        <h3 className="pcard__title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        {product.kannadaName && (
          <p className="pcard__kn" lang="kn">
            {product.kannadaName}
          </p>
        )}
        <p className="pcard__desc">{product.description}</p>
        <Link to={`/products/${product.id}`} className="pcard__more" aria-label={`Read more about ${product.name}`}>
          Read more
        </Link>
        {!orderable && label && <p className="pcard__price">{label}</p>}
        <AddToCart product={product} />
      </div>
    </article>
  );
}
