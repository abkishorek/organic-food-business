import { siteConfig } from '../config/site';
import { usePageMeta } from '../lib/meta';
import { enquiryHref, whatsappReady } from '../lib/whatsapp';
import { useSiteData } from '../lib/site-data';

export default function Contact() {
  usePageMeta('Contact', 'Contact Siri Vaividya on WhatsApp or email.');
  const { contact } = siteConfig;
  const { whatsappNumber, isLoading } = useSiteData();
  const hasWhatsappNumber = whatsappNumber.trim().length > 0;
  const validWhatsappNumber = whatsappReady(whatsappNumber);
  const rows: [string, React.ReactNode][] = [];
  if (contact.email) rows.push(['Email', <a key="e" href={`mailto:${contact.email}`}>{contact.email}</a>]);
  if (contact.address) rows.push(['Address', contact.address]);
  if (contact.serviceArea) rows.push(['Where we deliver', contact.serviceArea]);
  if (contact.instagram) rows.push(['Instagram', <a key="i" href={contact.instagram} target="_blank" rel="noopener noreferrer">{contact.instagram}</a>]);
  if (contact.facebook) rows.push(['Facebook', <a key="f" href={contact.facebook} target="_blank" rel="noopener noreferrer">{contact.facebook}</a>]);

  return (
    <div className="container page page--narrow">
      <h1>Contact</h1>
      {hasWhatsappNumber && (
        <p>
          You can contact{' '}
          {validWhatsappNumber ? (
            <a href={enquiryHref(whatsappNumber)} target="_blank" rel="noopener noreferrer">
              +{whatsappNumber}
            </a>
          ) : (
            `+${whatsappNumber}`
          )}{' '}
          for any queries.
        </p>
      )}
      {isLoading && !hasWhatsappNumber && <p role="status">Loading contact details…</p>}
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
      {!isLoading && !hasWhatsappNumber && rows.length === 0 && (
        <p>The WhatsApp contact number has not been saved yet. Please add it in Admin and choose Save all changes.</p>
      )}
    </div>
  );
}
