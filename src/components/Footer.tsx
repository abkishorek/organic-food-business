import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';
import StitchDivider from './StitchDivider';

export default function Footer() {
  const { brand, legal, contact } = siteConfig;
  const preview = siteConfig.showPreviewNotice;
  const social = [
    contact.instagram && { label: 'Instagram', href: contact.instagram },
    contact.facebook && { label: 'Facebook', href: contact.facebook },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="site-footer">
      <div className="container">
        <StitchDivider />
        <div className="footer-grid">
          <div>
            <p className="footer-kn" lang="kn">
              {brand.nameKannada}
            </p>
            <p className="footer-en">{brand.nameEnglish}</p>
            <p className="footer-tag">{brand.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/shipping">Shipping</Link>
              </li>
              <li>
                <Link to="/returns">Returns and refunds</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-legal">
            {(legal.fssai || preview) && <p>FSSAI licence no.: {legal.fssai || <em>to be added</em>}</p>}
            {(legal.gstin || preview) && <p>GSTIN: {legal.gstin || <em>to be added (if registered)</em>}</p>}
          </div>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} {brand.nameEnglish}
        </p>
      </div>
    </footer>
  );
}
