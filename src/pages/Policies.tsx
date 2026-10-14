import { siteConfig } from '../config/site';
import { usePageMeta } from '../lib/meta';

function PolicyPage({ title, paragraphs, children }: { title: string; paragraphs?: string[]; children?: React.ReactNode }) {
  usePageMeta(title);
  return (
    <div className="container page page--narrow prose">
      <h1>{title}</h1>
      {paragraphs && paragraphs.length === 0 && (
        <p>This policy is being finalised. For questions in the meantime, please contact us from the Contact page.</p>
      )}
      {paragraphs?.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {children}
    </div>
  );
}

export const Shipping = () => {
  const o = siteConfig.ordering;
  const facts: string[] = [];
  if (o.shippingCharge !== null) facts.push(o.shippingCharge === 0 ? 'Delivery is free.' : `Delivery charge: ${o.currencySymbol}${o.shippingCharge}.`);
  if (o.freeShippingAbove !== null) facts.push(`Delivery is free on orders of ${o.currencySymbol}${o.freeShippingAbove} and above.`);
  if (o.minimumOrder !== null) facts.push(`Minimum order: ${o.currencySymbol}${o.minimumOrder}.`);
  if (siteConfig.contact.serviceArea) facts.push(`We deliver to: ${siteConfig.contact.serviceArea}.`);
  const all = [...facts, ...siteConfig.policies.shipping];
  return <PolicyPage title="Shipping" paragraphs={all} />;
};

export const Returns = () => <PolicyPage title="Returns and refunds" paragraphs={siteConfig.policies.returns} />;

export const Privacy = () => (
  <PolicyPage title="Privacy">
    <p>This page explains what this website does with your information.</p>
    <h2>Your cart</h2>
    <p>Your cart is saved in your own browser so it is still there if you refresh the page. It is not sent to us or stored on a server.</p>
    <h2>Checkout details</h2>
    <p>
      The name, phone number and address you type at checkout are used only to write your order message. When you press
      send, that message goes to us through WhatsApp, which has its own privacy policy. This website does not store those details.
    </p>
    <h2>Visitor statistics</h2>
    <p>
      {siteConfig.analytics.plausibleDomain
        ? 'We use Plausible Analytics to count visits. It does not use cookies and does not collect personal data.'
        : 'This website does not currently use analytics or tracking cookies.'}
    </p>
  </PolicyPage>
);
