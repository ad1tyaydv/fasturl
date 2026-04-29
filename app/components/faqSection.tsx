"use client";

import { useState } from "react";

import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowDown01Icon }
  from '@hugeicons/core-free-icons';

interface FaqItem {
  question: string;
  answer: string;
}

const faqsLeft: FaqItem[] = [
  {
    question: "What is a URL shortener and why do I need one?",
    answer: "A URL shortener transforms long, complex web addresses into short, manageable links. You need one to save space on social media, improve link aesthetics, and most importantly, to track detailed click analytics that standard URLs don't provide."
  },
  {
    question: "How do I create a branded link with a custom domain?",
    answer: "You can connect your own domain (e.g., link.yourbrand.com) in the Domain settings. Once verified via DNS records, you can generate short links using your brand name instead of our default domain, which increases trust and click-through rates."
  },
  {
    question: "What specific analytics data can I track?",
    answer: "Fasturl tracks total and unique clicks, geographic location (country, state, city), device types (mobile/desktop), browser info, and referral sources. This data is available in real-time through your analytics dashboard."
  },
  {
    question: "Can I shorten multiple links at once?",
    answer: "Yes! Our Bulk URL Shortener allows you to shorten hundreds of links simultaneously by uploading a CSV file or pasting a list. This is a massive time-saver for large-scale marketing campaigns."
  },
  {
    question: "How do dynamic QR codes work?",
    answer: "Unlike static QR codes, our dynamic QR codes are linked to a short URL. This means you can change the destination URL in your dashboard even after the QR code has been printed, without needing to regenerate the code."
  },
  {
    question: "Is my data and my users' privacy secure?",
    answer: "Absolutely. We use industry-standard SSL encryption for all redirects. We also offer 2FA for your account and ensure that all tracking data is handled securely and according to privacy regulations."
  },
  {
    question: "Can I protect my links with a password?",
    answer: "Yes, our 'Link Protection' feature allows you to set a password for any link. Visitors will be prompted to enter the correct password before being redirected to the destination URL."
  },
  {
    question: "What happens when a link expires?",
    answer: "You can set an expiration date or click limit for any link. Once the limit is reached, the link will automatically deactivate, and visitors will be shown an expired page or redirected elsewhere if configured."
  },
  {
    question: "How can I integrate fasturl into my own application?",
    answer: "We provide a robust Developer API that allows you to programmatically create links. You can generate an API key in your settings to get started with integration."
  },
  {
    question: "What are the limits of the Free plan?",
    answer: "Our Free plan includes basic shortening and limited monthly links. For advanced features like custom domains, bulk shortening, and full API access, we recommend our Essential or Pro plans."
  }
];

const faqsRight: FaqItem[] = [
  {
    question: "Can I change the destination of an existing short link?",
    answer: "Yes! With our 'Redirect To' feature, you can update the original long URL of any short link at any time. This allows you to correct mistakes or pivot your campaign without changing the link you've shared."
  },
  {
    question: "Does fasturl support geo-targeted redirects?",
    answer: "Currently, we provide geo-tracking for all clicks. Advanced geo-targeting, which allows you to redirect users to different destinations based on their country, is a feature we are actively developing."
  },
  {
    question: "How do I enable 2FA on my account for extra security?",
    answer: "Go to your account settings and enable 'Two-Factor Authentication'. You can use any standard authenticator app to secure your login process and prevent unauthorized access to your links."
  },
  {
    question: "What is a 'White Label' shortener?",
    answer: "A White Label shortener allows you to remove all fasturl branding and use your own domain and logo. This provides a seamless, professional experience for your customers and strengthens your brand authority."
  },
  {
    question: "How do I track UTM parameters with fasturl?",
    answer: "You can include UTM parameters in your long URL before shortening it. fasturl will preserve these parameters during redirection, allowing you to see the data in your Google Analytics or other tracking tools."
  },
  {
    question: "Is there a limit on how many clicks I can track?",
    answer: "We track every single click on your links. While our plans have different link creation limits, we provide unlimited click tracking for the links you've created, ensuring you never miss a data point."
  },
  {
    question: "Can I export my link and analytics data?",
    answer: "Yes, you can export your link lists and detailed analytics reports as CSV files. This allows you to perform deeper analysis or import your data into other business intelligence tools."
  },
  {
    question: "How do I verify my custom domain?",
    answer: "Once you add a domain, we provide CNAME and TXT records that you need to add to your domain's DNS settings. Our system will automatically verify these records and activate your domain."
  },
  {
    question: "What payment methods do you accept for premium plans?",
    answer: "We accept all major credit/debit cards and supported digital payment methods through our secure payment gateway, ensuring a smooth upgrade process for your professional needs."
  },
  {
    question: "How do I contact support if I have more questions?",
    answer: "Our support team is available 24/7. You can reach out to us via the contact form on our website or email us directly at fasturl@tutamail.com for priority assistance."
  }
];


export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (side: string, index: number) => {
    const key = `${side}-${index}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  
  return (
    <section className="py-24 px-4 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-one font-bold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-muted-foreground font-one text-lg max-w-2xl mx-auto">
            Have questions about fasturl? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-24">
          
          <div className="space-y-4">
            {faqsLeft.map((faq, index) => {
              const key = `left-${index}`;
              const isOpen = openIndex === key;
              return (
                <div 
                  key={key} 
                  className="border-b border-border transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq('left', index)}
                    className="w-full py-6 flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span className={`text-lg font-one font-bold transition-colors ${isOpen ? 'text-blue-500' : 'text-foreground group-hover:text-blue-500'}`}>
                      {faq.question}
                    </span>
                    <HugeiconsIcon icon={ArrowDown01Icon}
                      className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-muted-foreground font-one leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            {faqsRight.map((faq, index) => {
              const key = `right-${index}`;
              const isOpen = openIndex === key;
              return (
                <div 
                  key={key} 
                  className="border-b border-border transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq('right', index)}
                    className="w-full py-6 flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span className={`text-lg font-three font-bold transition-colors ${isOpen ? 'text-blue-500' : 'text-foreground group-hover:text-blue-500'}`}>
                      {faq.question}
                    </span>
                    <HugeiconsIcon icon={ArrowDown01Icon}
                      className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-muted-foreground font-one leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}