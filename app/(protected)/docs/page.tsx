"use client";
import { useState, useEffect } from 'react';
import { Search, FileText, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import Navbar from '@/app/components/navbar';

interface DocSection {
  subtitle: string;
  text: string;
}

interface Doc {
  id: string;
  category: string;
  title: string;
  description: string;
  sections: DocSection[];
}

const docsData: Record<string, Doc> = {
  'what-is-url-shortener': {
    id: 'what-is-url-shortener',
    category: 'basics',
    title: "What is a URL Shortener?",
    description: "A URL shortener is a sophisticated digital tool that transforms long, cumbersome web addresses into concise, manageable links. It acts as a bridge, ensuring that complex data-heavy URLs are converted into human-readable strings while maintaining their original destination. Our free url shortener service is designed for speed and reliability.",
    sections: [
      { subtitle: "The Core Concept", text: "At its most basic level, a link shortener creates a unique alias for a long web address. This alias functions as a pointer within a database. When a user interacts with the shorten url, the system instantly identifies the mapped destination and routes the user there. This short link generator is essential for modern digital communication." },
      { subtitle: "Why They Were Created", text: "The necessity for url shortener tools arose alongside the character limits of early social media. They were developed to improve the 'visual hygiene' of digital communication, replacing messy strings with professional-looking shorten link options. Today, they are used for everything from social media marketing to secure link sharing." },
      { subtitle: "Evolution of the Tool", text: "Modern shorteners like FastURL aren't just about length; they are about control. They allow for link editing, detailed traffic attribution via a link analytics dashboard, and advanced security layers like password protected links and expiring links." }
    ]
  },
  'how-it-works': {
    id: 'how-it-works',
    category: 'basics',
    title: "How does it work?",
    description: "The mechanics of URL shortening involve a combination of high-performance database management, clever hashing algorithms, and standard HTTP protocols to generate short url fast.",
    sections: [
      { subtitle: "The Database Map", text: "When you use our online link shortener to submit a long URL, our system generates a unique identifier known as a 'slug'. This slug is stored in a high-speed relational database alongside the original long URL. This process allows for instant link shortener redirection." },
      { subtitle: "The Redirect Process", text: "When someone clicks the short link, our server looks up the slug and sends back an HTTP 301 Permanent Redirect, telling the browser where to go. This ensures low latency url shortener performance for users worldwide." },
      { subtitle: "Algorithmic Generation", text: "To ensure every link is unique, we use Base62 encoding. This allows our fast url shortener to create billions of unique combinations using a very small number of characters, providing a simple url shortener experience with advanced capabilities." }
    ]
  },
  'security-features': {
    id: 'security-features',
    category: 'basics',
    title: "Security & Privacy",
    description: "Your security is our priority. FastURL provides multiple layers of protection for your links and account.",
    sections: [
      { subtitle: "Two-Factor Authentication (2FA)", text: "Secure your account with 2FA using TOTP (Time-based One-Time Password) apps like Google Authenticator or Authy. This ensures only you can access your dashboard and manage your links." },
      { subtitle: "Link Password Protection", text: "Add an extra layer of security to sensitive links. When enabled, visitors must enter a password that you set before being redirected to the destination URL." },
      { subtitle: "Secure Redirection", text: "All redirects are handled through secure protocols, and we monitor for malicious destination URLs to protect our users and their audience." }
    ]
  },
  'link-management': {
    id: 'link-management',
    category: 'management',
    title: "Link Management & Customization",
    description: "Manage your digital footprint with our professional url shortener platform, offering custom short links and branded links for maximum engagement.",
    sections: [
      { subtitle: "Custom Slugs (Branded Links)", text: "How it works: Instead of a random string, you can choose a custom keyword for your short link (e.g., fasturl.com/summer-sale). Use case: Branded links increase trust and click-through rates by 34% because users know exactly where the link leads." },
      { subtitle: "Password Protection", text: "How it works: Enable 'Link Protection' and set a password. Visitors must enter the correct key to reach the destination. Perfect for private documents or internal company files." },
      { subtitle: "Link Expiration", text: "How it works: Set a specific date and time for your link to stop working. Use case: Use this for limited-time offers, flash sales, or temporary downloads." },
      { subtitle: "Dynamic 'Redirect To'", text: "How it works: Update the destination of a short link at any time without changing the short link itself. If your landing page changes, just update the target URL in your dashboard." }
    ]
  },
  'analytics-guide': {
    id: 'analytics-guide',
    category: 'analytics',
    title: "Advanced Link Analytics",
    description: "Our url shortener with analytics provides deep insights into your audience behavior with a real time click tracking dashboard.",
    sections: [
      { subtitle: "Geo-Tracking", text: "Identify the country, state, and city of every click using IP-based geolocation. Optimize regional marketing efforts based on where your audience is located." },
      { subtitle: "Device & Browser Insights", text: "Track if users are on Mobile, Desktop, or Tablet, and which browser they prefer (Chrome, Safari, Firefox, etc.). Ensure your content is optimized for the devices your audience uses." },
      { subtitle: "Traffic Sources (Referrers)", text: "See which websites or apps (Twitter, LinkedIn, YouTube, etc.) are driving traffic to your links. Essential for measuring social media ROI." },
      { subtitle: "Real-Time Tracking", text: "Clicks are logged and reflected in your dashboard instantly, allowing you to monitor the performance of live campaigns as they happen." }
    ]
  },
  'qr-codes': {
    id: 'qr-codes',
    category: 'features',
    title: "QR Code Generation",
    description: "Bridge the gap between offline and online marketing with our integrated short link tool and QR code generator.",
    sections: [
      { subtitle: "Dynamic QR Codes", text: "Since every QR code is linked to a short URL, you can change the destination URL even after the QR code is printed. Perfect for restaurant menus and business cards." },
      { subtitle: "QR Analytics", text: "Track every scan with full analytics, just like your short links. Measure the effectiveness of your physical marketing materials." }
    ]
  },
  'bulk-shortening': {
    id: 'bulk-shortening',
    category: 'management',
    title: "Bulk URL Shortener",
    description: "Scale your operations with our mass url shortener tool, designed for batch link shortener workflows.",
    sections: [
      { subtitle: "Mass Shortening", text: "Upload multiple URLs at once to generate short links in seconds. Designed for ecommerce and large-scale marketing campaigns." },
      { subtitle: "Bulk Management", text: "Apply passwords or expiration dates to an entire batch of links simultaneously, saving you hours of manual work." }
    ]
  },
  'custom-domains': {
    id: 'custom-domains',
    category: 'features',
    title: "Custom Domain Support",
    description: "Establish ultimate brand authority with branded url shortener capabilities using your own custom domain.",
    sections: [
      { subtitle: "Verification Process", text: "To connect your domain, you need to add two records to your DNS provider: 1. A TXT record for verification (e.g., _verify.yourdomain.com) with the token provided in your dashboard. 2. A CNAME record pointing to 'cname.fasturl.in'." },
      { subtitle: "Branded Experience", text: "Once verified, all your short links will use your own domain (e.g., links.yourbrand.com/slug), providing a seamless and professional experience for your users." }
    ]
  },
  'pricing-plans': {
    id: 'pricing-plans',
    category: 'management',
    title: "Subscription Plans",
    description: "Choose the plan that fits your needs, from individual use to enterprise-scale operations.",
    sections: [
      { subtitle: "Free Plan", text: "100 links/month, 30 QR codes, basic tracking. Perfect for personal use." },
      { subtitle: "Essentials Plan", text: "10,000 links/month, 300 QR codes, real-time analytics, 4 custom domains, bulk shortening, and password protection." },
      { subtitle: "Pro Plan", text: "40,000 links/month, 2,000 QR codes, 10 custom domains, full API access, white-label support, and priority 24/7 assistance." }
    ]
  },
  'api-reference': {
    id: 'api-reference',
    category: 'advanced',
    title: "API Reference",
    description: "Integrate FastURL directly into your workflow with our RESTful API.",
    sections: [
      { subtitle: "Authentication", text: "All API requests require an API key passed in the 'Authorization' header as a Bearer token: Authorization: Bearer YOUR_API_KEY." },
      { subtitle: "Shorten a Link (POST /app/v1/shortLink)", text: "Endpoint: /api/v1/shortLink | Method: POST | Body: { \"url\": \"https://example.com\", \"linkName\": \"My Link\", \"password\": \"optional-pass\", \"expiry\": \"YYYY-MM-DD\" } | Response: { \"success\": true, \"shortUrl\": \"...\" }" },
      { subtitle: "Usage Limits", text: "API access is available on Pro plans. Ensure you monitor your usage count in the dashboard to avoid hitting your monthly limit." }
    ]
  },
  'seo-index': {
    id: 'seo-index',
    category: 'advanced',
    title: "Search & Discovery Index",
    description: "FastURL is optimized for search and discovery across various link management and analytics categories.",
    sections: [
      { subtitle: "Keywords & Search Terms", text: "url shortener, link shortener, shorten url, shorten link, short link generator, free url shortener, custom short links, branded links, create short url, url shortener with analytics, best url shortener, shorten long url online, create short link free, link shortener with analytics, shorten links instantly, generate short url fast, free link shortener with stats, link analytics dashboard, url click tracking, track link clicks, link performance analytics, real time click tracking, geo tracking for links, browser analytics for links, device tracking url, bulk url shortener, shorten multiple links, batch link shortener, bulk link analytics, mass url shortener tool, shorten links in bulk online, password protected links, expiring links, secure url shortener, private short links, link expiration tool, url shortener api, link shortening api, rest api for url shortening, create short links programmatically, free short link tool, online link shortener, fast url shortener, instant link shortener, url shortener service, simple url shortener, advanced link shortener, link tracking tool, link management platform, smart link shortener, professional url shortener, marketing link shortener, campaign link tracking, digital marketing links, affiliate link shortener, social media link shortener, shorten urls for twitter, shorten links for instagram, shorten links for facebook, shorten links for youtube, link click counter, link stats tool, link monitoring tool, url analytics tool, click analytics dashboard, web link tracker, link engagement tracking, user click tracking, url tracking system, link insights tool, data driven link tracking, short url creator, link shortener website, online url tool, shorten urls free online, free link generator, url shrinker, tiny url creator, custom domain short links, branded url shortener, enterprise url shortener, business link shortener, team link shortener, collaborative link management." }
    ]
  }
};

export default function App() {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({ 
    basics: true, 
    features: true,
    management: true,
    analytics: true,
    advanced: true
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const docParam = params.get('docs');
      
      if (docParam && docsData[docParam]) {
        setActiveDocId(docParam);
      } else {
        setActiveDocId('what-is-url-shortener');
        window.history.replaceState({}, '', '?docs=what-is-url-shortener');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleNavigation = (id: string) => {
    setActiveDocId(id);
    const newUrl = `?docs=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setIsSidebarOpen(false);
    
    const mainElement = document.getElementById('docs-content');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredDocs = Object.values(docsData).filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = activeDocId ? docsData[activeDocId] : null;

  const sidebarCategories = [
    { id: 'basics', label: 'Getting Started' },
    { id: 'management', label: 'Link Management' },
    { id: 'analytics', label: 'Analytics & Tracking' },
    { id: 'features', label: 'Core Features' },
    { id: 'advanced', label: 'Developer Tools' }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300 flex flex-col h-screen overflow-hidden">
      <div className="shrink-0 z-[60]">
        <Navbar />
      </div>
      
      <div className="flex flex-1 pt-2 h-full overflow-hidden relative"> 
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-8 right-8 z-[55] p-4 bg-primary text-primary-foreground rounded-full shadow-2xl active:scale-95 transition-all border border-primary-foreground/10"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside className={`
          fixed top-[88px] bottom-0 left-0 z-50 w-72 bg-background border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-5 border-b border-border">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border py-2.5 pl-10 pr-3 rounded-xl outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/50 text-sm text-foreground font-one"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {filteredDocs.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground italic">No results</div>
            ) : (
              sidebarCategories.map(category => {
                const catDocs = filteredDocs.filter(doc => doc.category === category.id);
                if (catDocs.length === 0) return null;
                return (
                  <div key={category.id} className="mb-6 last:mb-20 lg:last:mb-6">
                    <button 
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {category.label}
                      {openCategories[category.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {openCategories[category.id] && (
                      <ul className="space-y-1">
                        {catDocs.map((doc) => (
                          <li key={doc.id}>
                            <button
                              onClick={() => handleNavigation(doc.id)}
                              className={`w-full text-left px-3 py-2.5 flex items-center gap-2 text-sm rounded-lg transition-all cursor-pointer ${
                                activeDocId === doc.id 
                                  ? 'bg-primary/10 text-primary font-semibold' 
                                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                              }`}
                            >
                              <FileText size={14} className={activeDocId === doc.id ? "text-primary" : "text-muted-foreground"} />
                              <span className="truncate">{doc.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
            )}
          </nav>
        </aside>

        <main id="docs-content" className="flex-1 overflow-y-auto custom-scrollbar bg-background p-6 sm:p-10 md:p-12 lg:py-16 lg:pl-12 lg:pr-24">
          {activeDoc ? (
            <article className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl pb-20">
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 flex items-center gap-2 uppercase tracking-wider font-semibold">
                <span>Docs</span>
                <ChevronRight size={12} />
                <span className="text-primary">{activeDoc.category}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 font-one leading-[1.1]">
                {activeDoc.title}
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 sm:mb-12 pb-8 border-b border-border font-three">
                {activeDoc.description}
              </p>

              <div className="space-y-10 sm:space-y-12">
                {activeDoc.sections.map((section, idx) => (
                  <section key={idx} className="group">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
                      {section.subtitle}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
                      {section.text}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-20 sm:mt-24 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                <span>FastURL Documentation</span>
                <span>Last updated: Today</span>
              </div>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 text-center px-6">
              <div className="p-4 bg-secondary rounded-2xl border border-border shadow-sm">
                <FileText size={40} />
              </div>
              <p className="font-one text-lg">Select a document from the sidebar to start reading.</p>
            </div>
          )}
        </main>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
