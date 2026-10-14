import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** Opens WhatsApp in a new tab, or navigates inside the site if the link is internal (e.g. /contact). */
export default function WhatsAppLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (href.startsWith('http')) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={href}>
      {children}
    </Link>
  );
}
