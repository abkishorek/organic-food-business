import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/meta';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <div className="container page page--narrow">
      <h1>Page not found</h1>
      <p>That page does not exist or has moved.</p>
      <Link to="/products" className="btn btn--primary">
        Explore products
      </Link>
    </div>
  );
}
