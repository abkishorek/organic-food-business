import { siteConfig } from '../config/site';
import { usePageMeta } from '../lib/meta';
import { enquiryHref, whatsappReady } from '../lib/whatsapp';

export default function Contact() {
  usePageMeta('Contact', 'Contact Siri Vaividya on WhatsApp or email.');
  const { contact } = siteConfig;
  const rows: [string, React.ReactNode][] = [];
  if (whatsappReady()) {
    rows.push([
      'WhatsApp',
      <a key="w" href={enquiryHref()} target="_blank" rel="noopener noreferrer">
        {contact.phoneDisplay || `+${contact.whatsappNumber}`}
      </a>,
    ]);
  }
  if (contact.email) rows.push(['Email', <a key="e" href={`mailto:${contact.email}`}>{contact.email}</a>]);
  if (contact.address) rows.push(['Address', contact.address]);
  if (contact.serviceArea) rows.push(['Where we deliver', contact.serviceArea]);
  if (contact.instagram) rows.push(['Instagram', <a key="i" href={contact.instagram} target="_blank" rel="noopener noreferrer">{contact.instagram}</a>]);
  if (contact.facebook) rows.push(['Facebook', <a key="f" href={contact.facebook} target="_blank" rel="noopener noreferrer">{contact.facebook}</a>]);

  return (
    <div className="container page page--narrow">
      <h1>Contact</h1>
      {rows.length > 0 ? (
        <dl className="facts">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>Contact details are being added. Please check back soon.</p>
      )}
    </div>
  );
}
