"use client";
import React, { useState, useEffect } from 'react';
import { Search, FileText, ChevronDown, ChevronRight } from 'lucide-react';
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
  'link-management': {
    id: 'link-management',
    category: 'management',
    title: "Link Management & Customization",
    description: "Manage your digital footprint with our professional url shortener platform, offering custom short links and branded links for maximum engagement.",
    sections: [
      { subtitle: "Custom Slugs (Branded Links)", text: "How it works: Instead of a random string, you can choose a custom keyword for your short link (e.g., fasturl.com/summer-sale). Use case: Branded links increase trust and click-through rates by 34% because users know exactly where the link leads. It's the best url shortener strategy for brand recognition." },
      { subtitle: "Password Protection", text: "How it works: Enable 'Link Protection' and set a password. Visitors must enter the correct key to reach the destination. Use case: Secure url shortener features are perfect for sharing private documents, early-access content, or internal company files through secure short urls." },
      { subtitle: "Link Expiration", text: "How it works: Set a specific date and time for your link to stop working. Use case: Use this link expiration tool for limited-time offers, flash sales, or temporary downloads to ensure your marketing link shortener campaigns remain relevant." },
      { subtitle: "Redirect Targeting", text: "How it works: Use the 'Redirect To' feature to change the destination of a short link at any time without changing the link itself. Use case: If a destination URL changes or an offer expires, you can update the link in real-time, making it a smart link shortener for dynamic campaigns." }
    ]
  },
  'analytics-guide': {
    id: 'analytics-guide',
    category: 'analytics',
    title: "Advanced Link Analytics",
    description: "Our url shortener with analytics provides deep insights into your audience behavior with a real time click tracking dashboard.",
    sections: [
      { subtitle: "Geo-Tracking & Location Insights", text: "How it works: We use IP-based geolocation to identify the country, state, and city of every click. Use case: Geo tracking for links helps you understand your global reach and optimize regional marketing efforts or ad spend based on location based analytics." },
      { subtitle: "Device & Browser Analytics", text: "How it works: Our system parses the User-Agent header to identify if the user is on Mobile, Desktop, or Tablet, and which browser they are using. Use case: Browser analytics for links and device tracking url data help you ensure your destination page is optimized for the most popular devices among your audience." },
      { subtitle: "Referrer Tracking", text: "How it works: We track the source website or app that brought the user to your link. Use case: Traffic source tracking is essential for affiliate link shortener users and digital marketing links to see which platforms (Twitter, Instagram, YouTube) are driving the most conversions." },
      { subtitle: "Real-Time Click Data", text: "How it works: Clicks are logged instantly and reflected in your click analytics dashboard without delay. Use case: Monitor the success of a live campaign or a viral post with real-time click tracking to make data driven decisions links." }
    ]
  },
  'qr-codes': {
    id: 'qr-codes',
    category: 'features',
    title: "QR Code Generation",
    description: "Bridge the gap between offline and online marketing with our integrated short link tool and QR code generator.",
    sections: [
      { subtitle: "Dynamic QR Codes", text: "How it works: Every QR code is linked to a short URL, which then redirects to your destination. Use case: Since the QR code points to a short link, you can change the destination URL even after printing the QR code. This is perfect for restaurant menus, business cards, or event posters." },
      { subtitle: "QR Analytics", text: "How it works: Just like links, every scan is tracked with full analytics. Use case: Measure the ROI of physical marketing materials by tracking link clicks specifically from your QR code scans." }
    ]
  },
  'bulk-shortening': {
    id: 'bulk-shortening',
    category: 'management',
    title: "Bulk URL Shortener",
    description: "Scale your operations with our mass url shortener tool, designed for batch link shortener workflows.",
    sections: [
      { subtitle: "Shorten Multiple Links", text: "How it works: Upload a list of URLs or enter them manually to shorten urls free online in bulk. Use case: Perfect for ecommerce managers who need to create short links for hundreds of products or marketers running multi-channel campaigns." },
      { subtitle: "Bulk Link Analytics", text: "How it works: Track the performance of an entire batch of links at once. Use case: Compare the performance of different link sets to see which campaign strategy is most effective using bulk link tracking." }
    ]
  },
  'custom-domains': {
    id: 'custom-domains',
    category: 'features',
    title: "Custom Domain Support",
    description: "Establish ultimate brand authority with branded url shortener capabilities using your own custom domain.",
    sections: [
      { subtitle: "Branded Short Domains", text: "How it works: Connect your own domain (e.g., link.yourbrand.com) to FastURL via CNAME and TXT records. Use case: Domain based short links remove our branding and replace it with yours, making your links look more professional and increasing user click tracking engagement." },
      { subtitle: "White Label URL Shortener", text: "How it works: All redirects happen through your domain, providing a seamless brand experience. Use case: Enterprise url shortener users use this for customer communication, SMS marketing, and high-stakes social media link shortener needs." }
    ]
  },
  'api-access': {
    id: 'api-access',
    category: 'advanced',
    title: "Developer API",
    description: "Integrate link shortening directly into your applications with our robust link shortening api.",
    sections: [
      { subtitle: "Programmable Link Shortener", text: "How it works: Use our REST API for url shortening to create, manage, and track links via code. Use case: Automate link creation in your own SaaS platform, CRM, or mobile app using our developer friendly api." },
      { subtitle: "Real Time Analytics API", text: "How it works: Fetch click data and analytics programmatically for your own internal dashboards. Use case: Build custom reporting tools or integrate link performance analytics directly into your business intelligence links workflow." }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <div className="flex pt-16 h-screen overflow-hidden"> 
        <aside className="w-72 border-r border-border flex flex-col fixed top-16 bottom-0 left-0 bg-background z-40">
          <div className="p-6 border-b border-border">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border py-2.5 pl-10 pr-3 rounded-xl outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 text-sm text-foreground font-one"
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
                  <div key={category.id} className="mb-6">
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
                              className={`w-full text-left px-3 py-2 flex items-center gap-2 text-sm rounded-lg transition-all cursor-pointer ${
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

        <main className="flex-1 ml-72 p-8 lg:p-16 max-w-5xl overflow-y-auto custom-scrollbar bg-background">
          {activeDoc ? (
            <article className="animate-in fade-in duration-500 max-w-3xl">
              <div className="text-xs text-muted-foreground mb-8 flex items-center gap-2 uppercase tracking-wider font-semibold">
                <span>Docs</span>
                <ChevronRight size={12} />
                <span className="text-primary">{activeDoc.category}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 font-one">
                {activeDoc.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-12 pb-8 border-b border-border font-three">
                {activeDoc.description}
              </p>

              <div className="space-y-12">
                {activeDoc.sections.map((section, idx) => (
                  <section key={idx} className="group">
                    <h2 className="text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
                      {section.subtitle}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed font-three">
                      {section.text}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-24 pt-8 border-t border-border flex justify-between text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                <span>FastURL Documentation</span>
                <span>Last updated: Today</span>
              </div>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <div className="p-4 bg-secondary rounded-full border border-border">
                <FileText size={32} />
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
