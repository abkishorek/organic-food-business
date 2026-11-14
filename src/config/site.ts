/**
 * SITE SETTINGS: the one place for business details.
 * Anything left empty ('' or null) is simply hidden or shown as "to be confirmed".
 * Nothing here is invented: fill in only what is true.
 */
export const siteConfig = {
  brand: {
    nameKannada: 'ಸಿರಿ ವೈವಿಧ್ಯ',
    nameEnglish: 'Siri Vaividya',
    tagline: 'Variety in Taste, Trust in Quality!',
    heroHeadline: 'Purity You Can Taste, Wellness You Can Trust.',
    intro:
      'Everyday kitchen essentials, inspired by the flavours of traditional Karnataka kitchens. Browse the range and order directly on WhatsApp.',
  },

  /** Your logo file (in public/images). null = text wordmark is shown instead. */
  logo: '/images/logo.webp' as string | null,
  logoAlt: 'Siri Vaividya logo',

  /** Hero photograph, e.g. '/images/hero.jpg'. Use a real photograph. null = placeholder frame. */
  heroImage: null as string | null,
  heroImageAlt: '',

  contact: {
    /**
     * >>> THE WHATSAPP NUMBER GOES HERE <<<
     * Digits only: country code + number, no "+", no spaces, no dashes.
     * Example for an Indian number 98765 43210  ->  '919876543210'
     * The storefront uses this number until an admin saves a number in Supabase.
     */
    whatsappNumber: '',
    email: '',
    address: '',
    serviceArea: '',
    instagram: '',
    facebook: '',
  },

  /** Compliance details. Shown in the footer once filled in. */
  legal: {
    fssai: '', // FSSAI licence / registration number
    gstin: '', // only if registered
  },

  ordering: {
    currencySymbol: '₹',
    /** Delivery charge in rupees. null = "to be confirmed on WhatsApp". 0 = free delivery. */
    shippingCharge: null as number | null,
    /** Delivery is free at or above this order value. null = no free-delivery rule. */
    freeShippingAbove: null as number | null,
    /** Minimum order value in rupees. null = no minimum. */
    minimumOrder: null as number | null,
    /** Show "Price to be updated" for products with no price yet. false = hide the price. */
    showPricePlaceholder: true,
  },

  /**
   * Policy text. One string per paragraph. Leave [] until the owner has decided the rules.
   * The pages show "being finalised" until you add text.
   */
  policies: {
    shipping: [] as string[],
    returns: [] as string[],
  },

  /** Privacy-friendly analytics (Plausible). Put your domain, e.g. 'sirivaividya.in'. '' = off. */
  analytics: {
    plausibleDomain: '',
  },

  /** Enables preview-only placeholders, footer reminders, and order-drafting fallbacks. */
  showPreviewNotice: true,
};

export type SiteConfig = typeof siteConfig;
