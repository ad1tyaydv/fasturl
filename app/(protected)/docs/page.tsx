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
    description: "A URL shortener is a sophisticated digital tool that transforms long, cumbersome web addresses into concise, manageable links. It acts as a bridge, ensuring that complex data-heavy URLs are converted into human-readable strings while maintaining their original destination.",
    sections: [
      { subtitle: "The Core Concept", text: "At its most basic level, a URL shortener creates a unique alias for a long web address. This alias functions as a pointer within a database. When a user interacts with the shortened link, the system instantly identifies the mapped destination and routes the user there." },
      { subtitle: "Why They Were Created", text: "The necessity for URL shorteners arose alongside the character limits of early social media. They were developed to improve the 'visual hygiene' of digital communication, replacing messy strings with professional-looking links." },
      { subtitle: "Evolution of the Tool", text: "Modern shorteners aren't just about length; they are about control. They allow for link editing, detailed traffic attribution, and advanced security layers." }
    ]
  },
  'how-it-works': {
    id: 'how-it-works',
    category: 'basics',
    title: "How does it work?",
    description: "The mechanics of URL shortening involve a combination of database management, clever hashing algorithms, and standard HTTP protocols.",
    sections: [
      { subtitle: "The Database Map", text: "When you submit a long URL, our system generates a unique identifier known as a 'slug'. This slug is stored in a high-speed relational database alongside the original long URL." },
      { subtitle: "The Redirect Process", text: "When someone clicks the short link, our server looks up the slug and sends back an HTTP 301 Permanent Redirect, telling the browser where to go." },
      { subtitle: "Algorithmic Generation", text: "To ensure every link is unique, we use Base62 encoding. This allows for billions of unique combinations using a very small number of characters." }
    ]
  },
  'benefits': {
    id: 'benefits',
    category: 'basics',
    title: "What are the benefits?",
    description: "Modern URL shorteners provide a competitive edge in digital branding, data collection, and user experience.",
    sections: [
      { subtitle: "Aesthetics and Trust", text: "A clean, branded short link looks significantly more professional and increases 'link trust,' making users much more likely to click." },
      { subtitle: "Actionable Analytics", text: "Short links act as tracking beacons. They allow you to see geographic location, referral sources, and device types in real-time." },
      { subtitle: "Social Media Optimization", text: "Platforms like Instagram and X value brevity. Short links leave more room for compelling captions and hashtags." }
    ]
  },
  'popular-shorteners': {
    id: 'popular-shorteners',
    category: 'basics',
    title: "Popular Shorteners",
    description: "The URL shortening landscape is diverse, offering everything from basic free redirectors to comprehensive enterprise-grade platforms.",
    sections: [
      { subtitle: "Industry Leaders", text: "Bitly and TinyURL are the most recognized names, pioneering link management for enterprises and offering deep integrations." },
      { subtitle: "Modern Solutions", text: "Next-generation platforms like FastURL are built on modern serverless architectures, prioritizing speed and privacy-first analytics." },
      { subtitle: "Niche and Open Source", text: "Open-source projects like Shlink or Polr allow businesses to self-host their own shortening service for total data sovereignty." }
    ]
  },
  core: {
    id: 'core',
    category: 'features',
    title: "Core Infrastructure",
    description: "FastURL is engineered for the modern web, utilizing a globally distributed edge network to ensure links resolve instantly.",
    sections: [
      { subtitle: "Instant URL Shortening", text: "Our engine processes URLs in under 50ms, stripping out unnecessary bloat while preserving essential data." },
      { subtitle: "Custom Short Links", text: "Define custom 'slugs' (like /sale) to improve memorability and boost click-through rates." },
      { subtitle: "Fast Redirect Performance", text: "We utilize Anycast routing to ensure users reach the nearest node for sub-100ms redirection." },
      { subtitle: "Reliable Infrastructure", text: "High-availability architecture ensures your links never go down, even during massive traffic spikes." }
    ]
  },
  analytics: {
    id: 'analytics',
    category: 'features',
    title: "Tracking & Analytics",
    description: "Understand exactly who is clicking your links and where they are coming from with our robust suite of tracking tools.",
    sections: [
      { subtitle: "Total & Unique Click Tracking", text: "Distinguish between raw traffic and unique individual visitors to measure true campaign reach." },
      { subtitle: "IP & Geographic Tracking", text: "Identify the location of your visitors to optimize regional marketing efforts and ad spend." },
      { subtitle: "Device & Referrer Tracking", text: "See if users are on Mobile or Desktop and identify the source site bringing them in." },
      { subtitle: "Real-Time Click Analytics", text: "Watch your campaign performance live as clicks happen, allowing for immediate strategy pivots." }
    ]
  },
  security: {
    id: 'security',
    category: 'features',
    title: "Security & Control",
    description: "Security is the backbone of FastURL, protecting your sensitive data and keeping your links under total control.",
    sections: [
      { subtitle: "Password Protection", text: "Require a unique key before visitors can access the destination URL, perfect for gated content." },
      { subtitle: "Link Expiration", text: "Set specific dates or click limits after which the link automatically deactivates." },
      { subtitle: "Secure HTTPS Links", text: "Every link generated is encrypted with SSL to ensure safe browsing for your users." },
      { subtitle: "Spam Protection", text: "Advanced filtering to prevent your links from being used for malicious intent or phishing." }
    ]
  },
  customization: {
    id: 'customization',
    category: 'features',
    title: "Branding & Customization",
    description: "Transform generic links into powerful marketing assets that act as an extension of your brand identity.",
    sections: [
      { subtitle: "Custom Domain Support", text: "Use your own branded domain (e.g., links.yourbrand.com) to increase authority and trust." },
      { subtitle: "QR Code Generation", text: "Instantly create high-resolution QR codes for any shortened link, optimized for print media." },
      { subtitle: "Link Preview Customization", text: "Control the title and image that appears when your link is shared on social media platforms." },
      { subtitle: "Campaign & UTM Support", text: "Easily attach UTM parameters to track marketing campaigns within Google Analytics or Mixpanel." }
    ]
  },
  management: {
    id: 'management',
    category: 'features',
    title: "Link Management",
    description: "Managing thousands of links is simple with a dashboard designed for speed, efficiency, and power users.",
    sections: [
      { subtitle: "Bulk URL Shortening", text: "Shorten hundreds of links at once through our high-speed bulk creation engine via CSV." },
      { subtitle: "Search & Filter Dashboard", text: "Find any link in seconds using our advanced real-time search and multi-tag filtering." },
      { subtitle: "API & CSV Access", text: "Integration-ready tools for developers and large-scale data management workflows." },
      { subtitle: "One-Click Management", text: "Edit, archive, or copy links instantly without refreshing the page, keeping you in flow." }
    ]
  }
};

export default function App() {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({ basics: true, features: true });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const docParam = params.get('docs');
      
      if (docParam && docsData[docParam]) {
        setActiveDocId(docParam);
      } else {
        setActiveDocId('core');
        window.history.replaceState({}, '', '?docs=core');
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
    { id: 'features', label: 'Features' }
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