import { NavLink } from 'react-router-dom';
import Brand from './Brand';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Brand />
        <nav className="nav" aria-label="Main">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/admin" className="nav__admin">Admin</NavLink>
        </nav>
      </div>
    </header>
  );
}
