import Script from "next/script";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FastURL",
  url: "https://fasturl.in",
  description:
    "Professional link management platform to shorten URLs, create branded links, generate QR codes, and track real-time analytics.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fasturl.in/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FastURL",
  url: "https://fasturl.in",
  logo: "https://fasturl.in/favicon.ico",
  sameAs: ["https://x.com/fasturldotin"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "fasturl@tutamail.com",
    contactType: "customer service",
    availableLanguage: "English",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FastURL",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://fasturl.in",
  description:
    "All-in-one link management platform for URL shortening, QR code generation, custom domains, and real-time click analytics.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free Plan",
      description: "100 short links per month, 30 QR codes, basic analytics",
    },
    {
      "@type": "Offer",
      price: "1",
      priceCurrency: "USD",
      name: "Essentials Plan",
      description:
        "10,000 links per month, 300 QR codes, custom domains, bulk shortener",
    },
    {
      "@type": "Offer",
      price: "3",
      priceCurrency: "USD",
      name: "Pro Plan",
      description:
        "40,000 links per month, 2,000 QR codes, API access, priority support",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a URL shortener and why do I need one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A URL shortener transforms long, complex web addresses into short, manageable links. You need one to save space on social media, improve link aesthetics, and most importantly, to track detailed click analytics that standard URLs don't provide.",
      },
    },
    {
      "@type": "Question",
      name: "How do I create a branded link with a custom domain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can connect your own domain (e.g., link.yourbrand.com) in the Domain settings. Once verified via DNS records, you can generate short links using your brand name instead of our default domain, which increases trust and click-through rates.",
      },
    },
    {
      "@type": "Question",
      name: "What specific analytics data can I track?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fasturl tracks total and unique clicks, geographic location (country, state, city), device types (mobile/desktop), browser info, and referral sources. This data is available in real-time through your analytics dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "Can I shorten multiple links at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Our Bulk URL Shortener allows you to shorten hundreds of links simultaneously by uploading a CSV file or pasting a list. This is a massive time-saver for large-scale marketing campaigns.",
      },
    },
    {
      "@type": "Question",
      name: "How do dynamic QR codes work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike static QR codes, our dynamic QR codes are linked to a short URL. This means you can change the destination URL in your dashboard even after the QR code has been printed, without needing to regenerate the code.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data and my users' privacy secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We use industry-standard SSL encryption for all redirects. We also offer 2FA for your account and ensure that all tracking data is handled securely and according to privacy regulations.",
      },
    },
    {
      "@type": "Question",
      name: "Can I protect my links with a password?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our 'Link Protection' feature allows you to set a password for any link. Visitors will be prompted to enter the correct password before being redirected to the destination URL.",
      },
    },
    {
      "@type": "Question",
      name: "What happens when a link expires?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can set an expiration date or click limit for any link. Once the limit is reached, the link will automatically deactivate, and visitors will be shown an expired page or redirected elsewhere if configured.",
      },
    },
    {
      "@type": "Question",
      name: "How can I integrate fasturl into my own application?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide a robust Developer API that allows you to programmatically create links. You can generate an API key in your settings to get started with integration.",
      },
    },
    {
      "@type": "Question",
      name: "What are the limits of the Free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Free plan includes basic shortening and limited monthly links. For advanced features like custom domains, bulk shortening, and full API access, we recommend our Essential or Pro plans.",
      },
    },
    {
      "@type": "Question",
      name: "Can I change the destination of an existing short link?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! With our 'Redirect To' feature, you can update the original long URL of any short link at any time. This allows you to correct mistakes or pivot your campaign without changing the link you've shared.",
      },
    },
    {
      "@type": "Question",
      name: "How do I contact support if I have more questions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our support team is available 24/7. You can reach out to us via the contact form on our website or email us directly at fasturl@tutamail.com for priority assistance.",
      },
    },
  ],
};

export default function JsonLd() {
  return (
    <>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="software-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        strategy="afterInteractive"
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        strategy="afterInteractive"
      />
    </>
  );
}
