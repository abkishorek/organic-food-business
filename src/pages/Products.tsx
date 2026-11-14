import ProductCard from '../components/ProductCard';
import StitchDivider from '../components/StitchDivider';
import { categories } from '../data/categories';
import { usePageMeta } from '../lib/meta';
import { useSiteData } from '../lib/site-data';

export default function Products() {
  const { products } = useSiteData();
  usePageMeta('Products', 'Browse spices and masalas, oils, tea and coffee, honey and cashew from Siri Vaividya.');
  return (
    <div className="container page">
      <header className="page__head">
        <h1>Products</h1>
        <nav className="chips" aria-label="Categories">
          {categories.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              {c.name}
            </a>
          ))}
        </nav>
      </header>

      {categories.map((c, i) => {
        const items = products.filter((p) => p.category === c.id);
        if (items.length === 0) return null;
        return (
          <section key={c.id} id={c.id} className="catsec" aria-labelledby={`${c.id}-t`}>
            {i > 0 && <StitchDivider className="catsec__rule" />}
            <h2 id={`${c.id}-t`} className="catsec__title">
              {c.name}
            </h2>
            <p className="catsec__blurb">{c.blurb}</p>
            <div className="grid">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
