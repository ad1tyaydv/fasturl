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
      { subtitle: "Keywords & Search Terms", text: "url shortener, link shortener, shorten url, shorten link, short link generator, free url shortener, custom short links, branded links, create short url, url shortener with analytics, best url shortener, shorten long url online, create short link free, link shortener with analytics, shorten links instantly, generate short url fast, free link shortener with stats, link analytics dashboard, url click tracking, track link clicks, link performance analytics, real time click tracking, geo tracking for links, browser analytics for links, device tracking url, bulk url shortener, shorten multiple links, batch link shortener, bulk link analytics, mass url shortener tool, shorten links in bulk online, password protected links, expiring links, secure url shortener, private short links, link expiration tool, url shortener api, link shortening api, rest api for url shortening, create short links programmatically, free short link tool, online link shortener, fast url shortener, instant link shortener, url shortener service, simple url shortener, advanced link shortener, link tracking tool, link management platform, smart link shortener, professional url shortener, marketing link shortener, campaign link tracking, digital marketing links, affiliate link shortener, social media link shortener, shorten urls for twitter, shorten links for instagram, shorten links for facebook, shorten links for youtube, link click counter, link stats tool, link monitoring tool, url analytics tool, click analytics dashboard, web link tracker, link engagement tracking, user click tracking, url tracking system, link insights tool, data driven link tracking, short url creator, link shortener website, online url tool, shorten urls free online, free link generator, url shrinker, tiny url creator, custom domain short links, branded url shortener, enterprise url shortener, business link shortener, team link shortener, collaborative link management, multi user link shortener, link sharing tool, link optimization tool, conversion tracking links, link performance monitoring, link reporting tool, url campaign tracker, marketing analytics links, growth marketing links, click rate tracking, traffic source tracking, referral tracking links, link attribution tool, advanced url analytics, smart link tracking, automated link tracking, ai link analytics, predictive link analytics, link heatmap analytics, click behavior tracking, user engagement links, url metrics dashboard, link insights dashboard, data analytics links, web analytics links, traffic analytics tool, online analytics dashboard, link usage stats, link performance stats, link click data, url engagement data, link conversion data, link monitoring dashboard, link tracking software, url analytics software, link management software, saas url shortener, cloud link shortener, scalable url shortener, high performance url shortener, reliable link shortener, secure link management, encrypted links, privacy focused url shortener, anonymous link shortener, temporary links, disposable links, one time links, expiring short links, auto delete links, safe link sharing, protected link sharing, secure short urls, fast redirect links, optimized link redirects, low latency url shortener, high speed link redirects, global link shortener, worldwide url shortener, geo targeted links, smart redirect links, device based redirect links, browser based redirect links, conditional redirects, smart url routing, advanced redirect rules, link personalization tool, personalized short links, custom slug links, vanity url shortener, branded short domains, domain based short links, white label url shortener, custom branding links, marketing automation links, crm link tracking, sales funnel links, lead tracking links, conversion optimization links, ab testing links, split testing links, campaign optimization links, performance marketing links, seo friendly short links, seo url shortener, search optimized links, link indexing tool, crawlable short links, google friendly short links, backlink shortener, link building tool, seo analytics links, keyword tracking links, organic traffic links, paid ads tracking links, utm link shortener, utm tracking tool, campaign url builder, utm link generator, advanced campaign tracking, link tagging tool, link labeling tool, link categorization tool, link grouping tool, bulk link management, bulk link editing, bulk link tracking, mass link analytics, enterprise link analytics, large scale link tracking, high volume link shortener, unlimited link creation, free unlimited url shortener, premium url shortener features, pro link shortener tool, advanced analytics dashboard, detailed click analytics, user friendly analytics tool, easy link tracking, beginner friendly url shortener, developer friendly api, robust link api, scalable api for links, link developer tools, api for link tracking, api for url analytics, integration ready url shortener, webhook link tracking, event based link tracking, real time analytics api, dashboard for developers, analytics for developers, programmable link shortener, headless link shortener, modern link shortener, next gen url shortener, innovative link tracking, cutting edge link analytics, powerful url shortener, ultimate link tracking tool, best link analytics platform, top url shortener service, leading link shortener, trusted url shortener, popular link shortener, trending url shortener, new url shortener tool, modern analytics platform, future ready link tracking, scalable analytics system, big data link analytics, cloud analytics links, data visualization links, chart based analytics, graph analytics dashboard, link performance graphs, click trends visualization, traffic trends dashboard, user trends analytics, link growth analytics, click growth tracking, engagement trends tool, marketing insights tool, actionable link insights, business intelligence links, analytics driven marketing, data driven decisions links, smart marketing links, ai powered link shortener, machine learning link analytics, intelligent link tracking, smart analytics engine, automated insights links, recommendation engine links, predictive analytics links, future traffic prediction, advanced data insights, performance optimization links, high converting links, optimized marketing links, conversion boosting links, growth hacking links, viral link tracking, social sharing links, influencer marketing links, affiliate marketing tools, affiliate link tracking, affiliate analytics tool, commission tracking links, monetization links, revenue tracking links, ecommerce link tracking, product link shortener, shop link shortener, checkout link tracking, sales link analytics, conversion funnel tracking, customer journey links, user behavior tracking links, session tracking links, engagement metrics links, retention analytics links, churn analysis links, user segmentation links, audience analytics links, demographic tracking links, location based analytics, city level tracking links, country level tracking links, global analytics dashboard, multilingual url shortener, international link shortener, cross platform link tracking, mobile friendly link shortener, responsive analytics dashboard, mobile analytics tool, ios link tracking, android link tracking, desktop analytics links, cross device analytics, unified analytics dashboard, omnichannel link tracking, multi channel marketing links, integrated analytics platform, all in one link shortener, complete analytics solution, end to end link tracking, full stack url shortener, comprehensive analytics tool" }
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
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <div className="flex pt-16"> 
        <aside className="w-72 border-r border-gray-200 flex flex-col fixed top-16 bottom-0 left-0 bg-white z-40">
          <div className="p-6 border-b border-gray-200">
            <div className="font-bold text-xl mb-6 tracking-tight"></div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 py-2 pl-10 pr-3 rounded-none outline-none focus:border-gray-900 transition-colors placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            {filteredDocs.length === 0 ? (
              <div className="px-2 py-4 text-sm text-gray-500 italic">No results</div>
            ) : (
              sidebarCategories.map(category => {
                const catDocs = filteredDocs.filter(doc => doc.category === category.id);
                if (catDocs.length === 0) return null;
                return (
                  <div key={category.id} className="mb-8">
                    <button 
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-2 hover:text-gray-900"
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
                              className={`w-full text-left px-2 py-2 flex items-center gap-2 text-sm border-l-2 transition-all ${
                                activeDocId === doc.id 
                                  ? 'border-gray-900 font-bold text-gray-900' 
                                  : 'border-transparent text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              <FileText size={14} className={activeDocId === doc.id ? "text-gray-900" : "text-gray-400"} />
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

        <main className="flex-1 ml-72 p-12 lg:p-24 max-w-5xl">
          {activeDoc ? (
            <article className="animate-in fade-in duration-500">
              <div className="text-sm text-gray-500 mb-8 flex items-center gap-2">
                <span>Docs</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">{activeDoc.title}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8">
                {activeDoc.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-16 pb-8 border-b border-gray-200">
                {activeDoc.description}
              </p>

              <div className="space-y-12">
                {activeDoc.sections.map((section, idx) => (
                  <section key={idx}>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.subtitle}</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">{section.text}</p>
                  </section>
                ))}
              </div>

              <div className="mt-24 pt-8 border-t border-gray-200 flex justify-between text-sm text-gray-500">
                <span>FastURL Documentation</span>
                <span>Last updated: Today</span>
              </div>
            </article>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a document from the sidebar to start reading.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}