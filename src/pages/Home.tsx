import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import StitchDivider from '../components/StitchDivider';
import { siteConfig } from '../config/site';
import { categories } from '../data/categories';
import { products } from '../data/products';
import WhatsAppLink from '../components/WhatsAppLink';
import { enquiryHref } from '../lib/whatsapp';
import { usePageMeta } from '../lib/meta';

export default function Home() {
  const { brand, logo, logoAlt, heroImage, heroImageAlt } = siteConfig;
  usePageMeta(null, `${brand.nameEnglish} (${brand.nameKannada}): ${brand.tagline} Order on WhatsApp.`);
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            {logo && heroImage && <img className="hero__logo" src={logo} alt={logoAlt} />}
            <p className="hero__kn" lang="kn">
              {brand.nameKannada}
            </p>
            <p className="hero__en">{brand.nameEnglish}</p>
            <p className="hero__tag">{brand.tagline}</p>
            <StitchDivider className="hero__rule" />
            <h1 className="hero__headline">{brand.heroHeadline}</h1>
            <p className="hero__intro">{brand.intro}</p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn--primary">
                Explore Products
              </Link>
              <WhatsAppLink className="btn btn--outline" href={enquiryHref()}>
                Order on WhatsApp
              </WhatsAppLink>
            </div>
          </div>

          <figure className="hero__figure">
            <div className="hero__frame">
              {heroImage ? (
                <img src={heroImage} alt={heroImageAlt} />
              ) : logo ? (
                <div className="hero__logo-panel">
                  <img src={logo} alt={logoAlt} />
                </div>
              ) : (
                <div className="hero__placeholder" role="img" aria-label="Hero photograph to be added">
                  {siteConfig.showPreviewNotice && <span>Hero photograph to be added</span>}
                </div>
              )}
            </div>
          </figure>
        </div>
      </section>

      <section className="section" aria-labelledby="range-title">
        <div className="container">
          <h2 id="range-title" className="section__title">
            The range
          </h2>
          <ul className="catindex">
            {categories.map((c) => {
              const items = products.filter((p) => p.category === c.id);
              return (
                <li key={c.id}>
                  <Link to={`/products#${c.id}`} className="catindex__row">
                    <span className="catindex__name">{c.name}</span>
                    <span className="catindex__items">{items.map((p) => p.name).join(', ')}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section section--tint" aria-labelledby="featured-title">
          <div className="container">
            <div className="section__head">
              <h2 id="featured-title" className="section__title">
                From the range
              </h2>
              <Link to="/products" className="textlink">
                See all {products.length} products
              </Link>
            </div>
            <div className="grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="how-title">
        <div className="container how">
          <h2 id="how-title" className="section__title">
            How ordering works
          </h2>
          <ol className="steps">
            <li>
              <h3>Choose your products</h3>
              <p>Pick a size where there is a choice and add it to your cart.</p>
            </li>
            <li>
              <h3>Enter delivery details</h3>
              <p>Give your name, phone number and address at checkout.</p>
            </li>
            <li>
              <h3>Send the order on WhatsApp</h3>
              <p>Your order is written out for you. It is placed once you send that message.</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
