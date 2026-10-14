import { NavLink } from 'react-router-dom';
import { useCart } from '../lib/cart';
import Brand from './Brand';

export default function Header() {
  const { count, openCart } = useCart();
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Brand />
        <nav className="nav" aria-label="Main">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <button type="button" className="cart-btn" onClick={openCart} aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}>
            Cart
            <span className="cart-btn__count" aria-hidden="true">
              {count}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
