import { Link, useParams } from 'react-router-dom';
import AddToCart from '../components/AddToCart';
import ProductImage from '../components/ProductImage';
import { categories } from '../data/categories';
import { getOrderOptions, getProduct, priceLabel } from '../lib/catalog';
import { usePageMeta } from '../lib/meta';
import NotFound from './NotFound';

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id);
  usePageMeta(product?.name ?? 'Product not found', product ? product.description.split('. ').slice(0, 2).join('. ') : undefined);
  if (!product) return <NotFound />;

  const category = categories.find((c) => c.id === product.category);
  const label = priceLabel(product);
  const orderable = getOrderOptions(product).length > 0;
  const d = product.details ?? {};
  const rows: [string, string][] = (
    [
      ['Ingredients', d.ingredients],
      ['Shelf life', d.shelfLife],
      ['Storage', d.storage],
      ['Allergen information', d.allergens],
      ['Notes', d.notes],
    ] as [string, string | undefined][]
  ).filter((r): r is [string, string] => !!r[1]);

  return (
    <div className="container page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/products">Products</Link>
        {category && (
          <>
            <span aria-hidden="true"> / </span>
            <Link to={`/products#${category.id}`}>{category.name}</Link>
          </>
        )}
      </nav>
      <div className="detail">
        <div className="detail__media">
          <ProductImage product={product} eager />
        </div>
        <div className="detail__body">
          <h1>{product.name}</h1>
          {product.kannadaName && (
            <p className="detail__kn" lang="kn">
              {product.kannadaName}
            </p>
          )}
          <p className="detail__desc">{product.description}</p>
          {!orderable && label && <p className="pcard__price">{label}</p>}
          <AddToCart product={product} showQty />
          {rows.length > 0 && (
            <dl className="facts">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
